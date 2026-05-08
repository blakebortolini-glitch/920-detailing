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
    // Called directly: { bookingId, type }
    // Called from entity automation: { event, data }
    let bookingId, type;
    if (payload.event) {
      bookingId = payload.event.entity_id;
      type = payload.data?.status === 'cancelled' ? 'cancelled' : 'confirmed';
    } else {
      bookingId = payload.bookingId;
      type = payload.type;
    }

    const booking = await base44.asServiceRole.entities.Booking.get(bookingId);
    if (!booking || !booking.email) {
      return Response.json({ success: false, reason: 'No email on booking' });
    }

    const serviceLabel = SERVICE_LABELS[booking.service] || booking.service;
    const vehicleStr = `${booking.year ? booking.year + ' ' : ''}${booking.vehicle}`;

    let subject, body;

    if (type === 'submitted') {
      subject = `We received your request - 920 Detailing`;
      body = `Hi ${booking.name},

Thanks for reaching out to 920 Detailing! We've received your booking request and will get back to you within 24 hours to confirm your appointment.

Here's a summary of your request:

  Vehicle:    ${vehicleStr}
  Service:    ${serviceLabel}
  Date:       ${booking.date}
  Time:       ${booking.time}
${booking.notes ? `  Notes:      ${booking.notes}\n` : ''}
If you need to reach us sooner, call or text: (920) 255-3123

— 920 Detailing
Kewaunee, Wisconsin`;
    } else if (type === 'confirmed') {
      subject = `Your appointment is confirmed - 920 Detailing`;
      body = `Hi ${booking.name},

Great news — your appointment with 920 Detailing has been confirmed!

  Vehicle:    ${vehicleStr}
  Service:    ${serviceLabel}
  Date:       ${booking.date}
  Time:       ${booking.time}

Please arrive at the scheduled time. If anything comes up, call or text us at (920) 255-3123 and we'll work something out.

See you soon,
— 920 Detailing
Kewaunee, Wisconsin`;
    } else if (type === 'cancelled') {
      subject = `Your appointment has been cancelled - 920 Detailing`;
      body = `Hi ${booking.name},

We're sorry to let you know that your upcoming appointment with 920 Detailing has been cancelled.

  Vehicle:    ${vehicleStr}
  Service:    ${serviceLabel}
  Date:       ${booking.date}
  Time:       ${booking.time}

If you'd like to reschedule or have any questions, please call or text us at (920) 255-3123 and we'd be happy to get you set up.

Sorry for any inconvenience,
- 920 Detailing
Kewaunee, Wisconsin`;
    } else {
      return Response.json({ success: false, reason: 'Unknown type' });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    const mimeMessage = [
      `To: ${booking.email}`,
      `Subject: ${subject}`,
      `Content-Type: text/plain; charset=utf-8`,
      `MIME-Version: 1.0`,
      ``,
      body,
    ].join('\r\n');

    const encoded = btoa(unescape(encodeURIComponent(mimeMessage)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const gmailRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: encoded }),
    });

    if (!gmailRes.ok) {
      const err = await gmailRes.text();
      console.error('Gmail send error:', err);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});