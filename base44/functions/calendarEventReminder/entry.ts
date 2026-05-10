import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    // Acknowledge sync ping
    const state = body.data?._provider_meta?.['x-goog-resource-state'];
    if (state === 'sync') return Response.json({ status: 'sync_ack' });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    // Fetch recently updated events from the last 30 days
    const timeMin = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const eventsRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10&orderBy=updated&timeMin=${timeMin}&singleEvents=true`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!eventsRes.ok) {
      console.error('Calendar fetch error:', await eventsRes.text());
      return Response.json({ status: 'api_error' });
    }

    const { items = [] } = await eventsRes.json();

    // Find the most recently updated event (within last 2 minutes)
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const recentEvents = items.filter(e => e.updated && new Date(e.updated) > twoMinutesAgo);

    for (const event of recentEvents) {
      // Extract booking info from event description
      const desc = event.description || '';
      const phoneMatch = desc.match(/Phone:\s*(.+)/);
      const emailMatch = desc.match(/Email:\s*(.+)/);
      const nameMatch = event.summary?.match(/^.+?—\s*(.+?)\s*\(/);

      const phone = phoneMatch?.[1]?.trim();
      const email = emailMatch?.[1]?.trim();
      const name = nameMatch?.[1]?.trim() || 'there';

      // Update booking status based on calendar event status
      // Match booking by phone number stored in description
      if (phone) {
        const bookings = await base44.asServiceRole.entities.Booking.filter({ phone });
        const booking = bookings?.[0];
        if (booking) {
          let newStatus = null;
          if (event.status === 'cancelled') {
            newStatus = 'cancelled';
          } else if (event.status === 'confirmed' && booking.status === 'new') {
            newStatus = 'confirmed';
          }
          if (newStatus && booking.status !== newStatus) {
            await base44.asServiceRole.entities.Booking.update(booking.id, { status: newStatus });
            console.log(`Booking ${booking.id} status updated to ${newStatus}`);
          }
        }
      }

      const startTime = event.start?.dateTime || event.start?.date || '';
      const startDate = startTime ? new Date(startTime) : null;
      const formattedDate = startDate
        ? startDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/Chicago' })
        : 'your scheduled date';
      const formattedTime = startDate
        ? startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Chicago' })
        : '';

      // Send SMS reminder via Twilio
      if (phone) {
        const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
        const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
        const fromPhone = Deno.env.get('TWILIO_PHONE_NUMBER');

        const smsBody = `Hi ${name}! Your 920 Detailing appointment has been updated.\n\nNew time: ${formattedDate}${formattedTime ? ' at ' + formattedTime : ''}\n\nQuestions? Call/text (920) 255-3123.`;

        const smsRes = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
          {
            method: 'POST',
            headers: {
              Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ To: phone, From: fromPhone, Body: smsBody }),
          }
        );
        if (!smsRes.ok) console.error('SMS error:', await smsRes.text());
      }

    }

    return Response.json({ success: true, processed: recentEvents.length });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});