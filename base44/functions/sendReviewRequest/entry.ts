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

    // Find bookings marked 'completed' between 23 and 25 hours ago
    const now = new Date();
    const windowStart = new Date(now.getTime() - 25 * 60 * 60 * 1000);
    const windowEnd = new Date(now.getTime() - 23 * 60 * 60 * 1000);

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
      const subjBytes = new TextEncoder().encode(subject);
      let subjBin = '';
      for (let i = 0; i < subjBytes.length; i++) subjBin += String.fromCharCode(subjBytes[i]);
      const encodedSubject = `=?UTF-8?B?${btoa(subjBin)}?=`;
      const mime = [
        `To: ${to}`,
        `Subject: ${encodedSubject}`,
        `Content-Type: text/plain; charset=utf-8`,
        `MIME-Version: 1.0`,
        ``,
        body,
      ].join('\r\n');
      const mimeBytes = new TextEncoder().encode(mime);
      let binaryStr = '';
      for (let i = 0; i < mimeBytes.length; i++) {
        binaryStr += String.fromCharCode(mimeBytes[i]);
      }
      const encoded = btoa(binaryStr)
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

      const subject = `How did we do? — 920 Detailing`;
      const body = `Hi ${booking.name},

We hope your ${serviceLabel} went exactly as expected — or better!

Your ${vehicleStr} is looking sharp, and we'd love to hear what you thought. It only takes a minute and it means a lot to a small local business like ours.

Leave us a review here:
https://dot.cards/920detailing

Thanks again for choosing 920 Detailing — we appreciate your trust and look forward to seeing you next time!

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