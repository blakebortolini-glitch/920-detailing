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

    // Find bookings marked 'completed' between 29 and 31 days ago
    const now = new Date();
    const windowStart = new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000);
    const windowEnd = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);

    const allCompleted = await base44.asServiceRole.entities.Booking.filter({ status: 'completed' });

    const toNotify = allCompleted.filter((b) => {
      const updated = new Date(b.updated_date);
      return updated >= windowStart && updated <= windowEnd;
    });

    if (toNotify.length === 0) {
      return Response.json({ success: true, sent: 0, message: 'No bookings in window' });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    const sendEmail = async (to, subject, body) => {
      const mime = [
        `To: ${to}`,
        `Subject: ${subject}`,
        `Content-Type: text/plain; charset=utf-8`,
        `MIME-Version: 1.0`,
        ``,
        body,
      ].join('\r\n');
      const encoded = btoa(unescape(encodeURIComponent(mime)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw: encoded }),
      });
      if (!res.ok) console.error(`Gmail send error to ${to}:`, await res.text());
    };

    let sent = 0;
    for (const booking of toNotify) {
      if (!booking.email) continue;

      const serviceLabel = SERVICE_LABELS[booking.service] || booking.service;
      const vehicleStr = `${booking.year ? booking.year + ' ' : ''}${booking.vehicle}`;

      const subject = `Time for another detail? — 920 Detailing`;
      const body = `Hi ${booking.name},

It's been about a month since we detailed your ${vehicleStr} — hope it's still looking sharp!

Regular detailing helps protect your paint, preserve your interior, and keep your vehicle looking its best year-round. Whether you're due for another ${serviceLabel} or want to try something different, we'd love to have you back.

Book your next appointment here:
https://920detailing.com/booking

Or call or text us directly at (920) 255-3123 and we'll get you squared away.

Thanks again for choosing 920 Detailing — we appreciate your business!

— Blake
920 Detailing
Kewaunee, Wisconsin
(920) 255-3123`;

      await sendEmail(booking.email, subject, body);
      sent++;
    }

    return Response.json({ success: true, sent });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});