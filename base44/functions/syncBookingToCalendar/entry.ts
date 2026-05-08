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
    const booking = await base44.asServiceRole.entities.Booking.get(bookingId);

    if (!booking) {
      return Response.json({ success: false, reason: 'Booking not found' });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    const serviceLabel = SERVICE_LABELS[booking.service] || booking.service;
    const vehicleStr = `${booking.year ? booking.year + ' ' : ''}${booking.vehicle}`;

    // Parse date and time — default to 9am–5pm if no time given
    const dateStr = booking.date; // e.g. "2026-05-15"
    const timeStr = booking.time || '09:00';

    // Build start datetime (assume time is like "10:00 AM" or "14:00")
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
      return t; // already 24h
    };

    const time24 = parseTime(timeStr);
    const startDateTime = `${dateStr}T${time24}:00`;

    // Estimate end time based on service duration (hours)
    const durationHours = { interior: 4, exterior: 6, full: 8, ceramic: 10, unsure: 2 };
    const dur = durationHours[booking.service] || 4;
    // Parse start hour/minute and compute end by adding duration
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

    const event = {
      summary: `${serviceLabel} - ${booking.name} (${vehicleStr})`,
      description,
      start: { dateTime: `${startDateTime}`, timeZone: 'America/Chicago' },
      end: { dateTime: `${endDateTime}`, timeZone: 'America/Chicago' },
      colorId: '2',
    };

    const calRes = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!calRes.ok) {
      const err = await calRes.text();
      console.error('Google Calendar error:', err);
      return Response.json({ success: false, error: err }, { status: 500 });
    }

    const created = await calRes.json();
    return Response.json({ success: true, eventId: created.id });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});