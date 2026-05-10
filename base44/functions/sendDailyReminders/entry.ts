import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Allow only admin users or internal service-role calls
    const user = await base44.auth.me().catch(() => null);
    if (user && user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get tomorrow's date in America/Chicago timezone
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toLocaleDateString('en-CA', { timeZone: 'America/Chicago' }); // YYYY-MM-DD

    // Find all confirmed bookings for tomorrow
    const bookings = await base44.asServiceRole.entities.Booking.filter({
      status: 'confirmed',
      date: tomorrowStr,
    });

    if (!bookings || bookings.length === 0) {
      return Response.json({ success: true, sent: 0, message: 'No bookings tomorrow' });
    }

    let sent = 0;
    for (const booking of bookings) {
      // Send email reminder
      await base44.asServiceRole.functions.invoke('sendConfirmation', {
        bookingId: booking.id,
        type: 'reminder',
      });

      // Send SMS reminder (if phone exists)
      if (booking.phone) {
        await base44.asServiceRole.functions.invoke('sendSMS', {
          bookingId: booking.id,
          type: 'reminder',
        });
      }

      sent++;
    }

    return Response.json({ success: true, sent, date: tomorrowStr });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});