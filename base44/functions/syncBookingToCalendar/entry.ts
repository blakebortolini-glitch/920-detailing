import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SERVICE_LABELS = {
  interior: 'Interior Detailing',
  exterior: 'Exterior Detailing & Paint Correction',
  ceramic: 'Ceramic Coating',
  full: 'Interior + Exterior Bundle',
  unsure: 'Not Sure — Need a Quote',
};

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

const buildTimes = (dateStr, timeStr, service) => {
  const time24 = parseTime(timeStr || '09:00');
  const startDateTime = `${dateStr}T${time24}:00`;
  const durationHours = { interior: 4, exterior: 6, full: 8, ceramic: 10, unsure: 2 };
  const dur = durationHours[service] || 4;
  const [startHour, startMin] = time24.split(':').map(Number);
  const totalEndMins = startHour * 60 + startMin + dur * 60;
  const endHour = Math.floor(totalEndMins / 60) % 24;
  const endMin = totalEndMins % 60;
  const endDateTime = `${dateStr}T${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}:00`;
  return { startDateTime, endDateTime };
};

const deleteCalendarEvent = async (accessToken, eventId) => {
  if (!eventId) return;
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok && res.status !== 404) {
    console.error(`Failed to delete calendar event ${eventId}:`, await res.text());
  }
};

const createBlockEvent = async (accessToken, dateStr, serviceLabel, bookingName) => {
  const nextDay = new Date(dateStr + 'T12:00:00');
  nextDay.setDate(nextDay.getDate() + 1);
  const nextDayStr = nextDay.toISOString().split('T')[0];

  const blockRes = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      summary: '🔒 FULLY BOOKED — No Availability',
      description: `This day is fully booked. Appointment: ${serviceLabel} for ${bookingName}.`,
      start: { date: dateStr },
      end: { date: nextDayStr },
      colorId: '11',
      transparency: 'opaque',
    }),
  });

  if (blockRes.ok) {
    const blockCreated = await blockRes.json();
    return blockCreated.id;
  } else {
    console.error('Google Calendar block event error:', await blockRes.text());
    return null;
  }
};

// Check if any OTHER confirmed bookings exist on a given date (excluding the current booking)
const hasOtherConfirmedBookingsOnDate = async (base44, dateStr, excludeBookingId) => {
  const allConfirmed = await base44.asServiceRole.entities.Booking.filter({ status: 'confirmed' });
  return allConfirmed.some((b) => {
    if (b.id === excludeBookingId) return false;
    const bDate = (b.date || b.data?.date || '').slice(0, 10);
    return bDate === dateStr;
  });
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const bookingId = payload.event?.entity_id || payload.bookingId;

    let booking = payload.data || null;
    if (!booking) {
      const bookingRecord = await base44.asServiceRole.entities.Booking.get(bookingId);
      if (!bookingRecord) return Response.json({ success: false, reason: 'Booking not found' });
      booking = bookingRecord.data || bookingRecord;
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    const serviceLabel = SERVICE_LABELS[booking.service] || booking.service;
    const vehicleStr = `${booking.year ? booking.year + ' ' : ''}${booking.vehicle}`;
    const newDateStr = booking.date ? booking.date.split('T')[0] : null;

    // --- CANCELLATION ---
    if (booking.status === 'cancelled') {
      const oldDateStr = (payload.old_data?.date || '').slice(0, 10) || newDateStr;

      await Promise.all([
        deleteCalendarEvent(accessToken, booking.calendarEventId),
        deleteCalendarEvent(accessToken, booking.calendarBlockEventId),
      ]);

      // Re-block old date if other confirmed bookings still exist there
      if (oldDateStr) {
        const othersOnOldDate = await hasOtherConfirmedBookingsOnDate(base44, oldDateStr, bookingId);
        if (othersOnOldDate) {
          await createBlockEvent(accessToken, oldDateStr, 'Other Appointment', 'another customer');
        }
      }

      return Response.json({ success: true, action: 'deleted' });
    }

    if (!newDateStr) return Response.json({ success: false, reason: 'Booking has no date' });

    const description = [
      `Customer: ${booking.name}`,
      `Phone: ${booking.phone}`,
      booking.email ? `Email: ${booking.email}` : null,
      `Vehicle: ${vehicleStr}`,
      `Service: ${serviceLabel}`,
      booking.add_ons && booking.add_ons.length > 0 ? `Add-Ons: ${booking.add_ons.join(', ')}` : null,
      booking.notes ? `Notes: ${booking.notes}` : null,
    ].filter(Boolean).join('\n');

    const { startDateTime, endDateTime } = buildTimes(newDateStr, booking.time, booking.service);

    // --- UPDATE: patch existing calendar event ---
    if (booking.calendarEventId && payload.event?.type === 'update') {
      const oldDateStr = (payload.old_data?.date || '').slice(0, 10);
      const dateChanged = oldDateStr && oldDateStr !== newDateStr;

      // Patch the appointment event to the new date/time
      const patchRes = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${booking.calendarEventId}`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            summary: `${serviceLabel} - ${booking.name} (${vehicleStr})`,
            description,
            start: { dateTime: startDateTime, timeZone: 'America/Chicago' },
            end: { dateTime: endDateTime, timeZone: 'America/Chicago' },
          }),
        }
      );
      if (!patchRes.ok) console.error('Calendar patch error:', await patchRes.text());

      if (dateChanged) {
        // Remove the old block event for the old date
        await deleteCalendarEvent(accessToken, booking.calendarBlockEventId);

        // Check if other confirmed bookings remain on the OLD date
        const othersOnOldDate = await hasOtherConfirmedBookingsOnDate(base44, oldDateStr, bookingId);
        if (othersOnOldDate) {
          // Re-create a generic block for the old date since others still have it booked
          await createBlockEvent(accessToken, oldDateStr, 'Other Appointment', 'another customer');
        }

        // Create a new block event for the NEW date
        const newBlockEventId = await createBlockEvent(accessToken, newDateStr, serviceLabel, booking.name);
        await base44.asServiceRole.entities.Booking.update(bookingId, {
          calendarBlockEventId: newBlockEventId || null,
        });
      } else if (booking.status === 'confirmed' && !booking.calendarBlockEventId) {
        // Confirmed for the first time — create block
        const blockEventId = await createBlockEvent(accessToken, newDateStr, serviceLabel, booking.name);
        if (blockEventId) {
          await base44.asServiceRole.entities.Booking.update(bookingId, { calendarBlockEventId: blockEventId });
        }
      }

      return Response.json({ success: true, action: 'updated' });
    }

    // --- CREATION: new booking ---
    const calRes = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        summary: `${serviceLabel} - ${booking.name} (${vehicleStr})`,
        description,
        start: { dateTime: startDateTime, timeZone: 'America/Chicago' },
        end: { dateTime: endDateTime, timeZone: 'America/Chicago' },
        colorId: '2',
      }),
    });

    if (!calRes.ok) {
      const err = await calRes.text();
      console.error('Google Calendar appointment error:', err);
      return Response.json({ success: false, error: err }, { status: 500 });
    }

    const created = await calRes.json();
    const blockEventId = await createBlockEvent(accessToken, newDateStr, serviceLabel, booking.name);

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