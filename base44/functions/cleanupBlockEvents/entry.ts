import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    // Get all bookings that have a legacy block event
    const allBookings = await base44.asServiceRole.entities.Booking.list('-created_date', 500);
    const withBlocks = allBookings.filter((b) => b.calendarBlockEventId);

    let deleted = 0;
    let failed = 0;
    for (const b of withBlocks) {
      try {
        const res = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events/${b.calendarBlockEventId}`,
          { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (res.ok || res.status === 404 || res.status === 410) {
          await base44.asServiceRole.entities.Booking.update(b.id, { calendarBlockEventId: null });
          deleted++;
        } else {
          console.error(`Failed to delete block ${b.calendarBlockEventId}:`, await res.text());
          failed++;
        }
      } catch (err) {
        console.error(`Error deleting block for booking ${b.id}:`, err);
        failed++;
      }
    }

    return Response.json({ success: true, found: withBlocks.length, deleted, failed });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});