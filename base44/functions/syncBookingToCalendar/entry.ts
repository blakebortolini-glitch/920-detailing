import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SERVICE_LABELS = {
  interior: 'Interior Detailing',
  exterior: 'Exterior Detailing & Paint Correction',
  ceramic: 'Ceramic Coating',
  full: 'Interior + Exterior Bundle',
  unsure: 'Not Sure — Need a Quote',
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const payload = await req.json();

    const bookingId = payload.event?.entity_id || payload.bookingId;

    let bookingRecord;
    try {
      bookingRecord = await base44.asServiceRole.entities.Booking.get(bookingId);
    } catch (e) {
      return Response.json({ success: false, reason: 'Booking not found' });
    }

    if (!bookingRecord) {
      return Response.json({ success: false, reason: 'Booking not found' });
    }

    // The SDK wraps entity fields under .data
    const booking = bookingRecord.data || bookingRecord;

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    // --- CANCELLATION: delete calendar events and free up the slot ---
    if (booking.status === 'cancelled') {
      const deleteEvent = async (eventId) => {
        if (!eventId) return;
        const res = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
          {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (!res.ok && res.status !== 404) {
          console.error(`Failed to delete calendar event ${eventId}:`, await res.text());
        }
      };

      await Promise.all([
        deleteEvent(booking.calendarEventId),
        deleteEvent(booking.calendarBlockEventId),
      ]);

      return Response.json({ success: true, action: 'deleted' });
    }

    // --- CREATION: add events to Google Calendar ---
    const serviceLabel = SERVICE_LABELS[booking.service] || booking.service;
    const vehicleStr = `${booking.year ? booking.year + ' ' : ''}${booking.vehicle}`;

    // Normalize date — handle both 'yyyy-MM-dd' and full ISO strings
    const rawDate = booking.date;
    const dateStr = rawDate ? rawDate.split('T')[0] : null;
    if (!dateStr) {
      return Response.json({ success: false, reason: 'Booking has no date' });
    }
    const timeStr = booking.time || '09:00';

    const parseTime = (t) => {
      const ampm = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (ampm) {
        let h = parseInt(ampm[1]);
        const m = ampm[2];
        const period = ampm[3].toUpperCase();
        if (period === 'PM' && h !== 12) h += 12;
        if (period === 'AM' && h === 12) h = 0;
        return `${String(h).padStart(2, '0')}:${m}`;
      }
      return t;
    };

    const time24 = parseTime(timeStr);
    const startDateTime = `${dateStr}T${time24}:00`;

    const durationHours = { interior: 4, exterior: 6, full: 8, ceramic: 10, unsure: 2 };
    const dur = durationHours[booking.service] || 4;
    const [startHour, startMin] = time24.split(':').map(Number);
    const totalStartMins = startHour * 60 + startMin;
    const totalEndMins = totalStartMins + dur * 60;
    const endHour = Math.floor(totalEndMins / 60) % 24;
    const endMin = totalEndMins % 60;
    const endTime24 = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;
    const endDateTime = `${dateStr}T${endTime24}:00`;

    const description = [
      `Customer: ${booking.name}`,
      `Phone: ${booking.phone}`,
      booking.email ? `Email: ${booking.email}` : null,
      `Vehicle: ${vehicleStr}`,
      `Service: ${serviceLabel}`,
      booking.notes ? `Notes: ${booking.notes}` : null,
    ].filter(Boolean).join('\n');

    // 1. Create the appointment event
    const appointmentEvent = {
      summary: `${serviceLabel} - ${booking.name} (${vehicleStr})`,
      description,
      start: { dateTime: startDateTime, timeZone: 'America/Chicago' },
      end: { dateTime: endDateTime, timeZone: 'America/Chicago' },
      colorId: '2',
    };

    const calRes = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentEvent),
    });

    if (!calRes.ok) {
      const err = await calRes.text();
      console.error('Google Calendar appointment error:', err);
      return Response.json({ success: false, error: err }, { status: 500 });
    }

    const created = await calRes.json();

    // 2. Create an all-day block event to mark the day as fully booked
    // All-day events require end date to be the next day
    const nextDay = new Date(dateStr + 'T12:00:00');
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayStr = nextDay.toISOString().split('T')[0];

    const blockEvent = {
      summary: '🔒 FULLY BOOKED — No Availability',
      description: `This day is fully booked. Appointment: ${serviceLabel} for ${booking.name}.`,
      start: { date: dateStr },
      end: { date: nextDayStr },
      colorId: '11',
      transparency: 'opaque',
    };

    const blockRes = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blockEvent),
    });

    let blockEventId = null;
    if (blockRes.ok) {
      const blockCreated = await blockRes.json();
      blockEventId = blockCreated.id;
    } else {
      console.error('Google Calendar block event error:', await blockRes.text());
    }

    // 3. Save event IDs back to the booking for future cancellation
    await base44.asServiceRole.entities.Booking.update(bookingId, {
      calendarEventId: created.id,
      ...(blockEventId ? { calendarBlockEventId: blockEventId } : {}),
    });

    return Response.json({ success: true, eventId: created.id });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});