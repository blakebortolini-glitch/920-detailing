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

    const OWNER_EMAIL = Deno.env.get('OWNER_EMAIL');

    // Use the data already in the automation payload if available (avoids fetch on deleted records)
    let booking = payload.data || null;

    if (!booking) {
      let bookingRecord;
      try {
        bookingRecord = await base44.asServiceRole.entities.Booking.get(bookingId);
      } catch (e) {
        return Response.json({ success: false, reason: 'Booking not found' });
      }
      if (!bookingRecord) {
        return Response.json({ success: false, reason: 'Booking not found' });
      }
      booking = bookingRecord.data || bookingRecord;
    }

    const serviceLabel = SERVICE_LABELS[booking.service] || booking.service;
    const vehicleStr = `${booking.year ? booking.year + ' ' : ''}${booking.vehicle}`;
    const addOnsStr = booking.add_ons && booking.add_ons.length > 0
      ? booking.add_ons.join(', ')
      : null;

    let subject, body;

    if (type === 'submitted') {
      subject = `We received your request - 920 Detailing`;
      body = `Hi ${booking.name},

Thanks for reaching out to 920 Detailing! We've received your booking request and will get back to you within 24 hours to confirm your appointment.

Here's a summary of your request:

  Vehicle:    ${vehicleStr}
  Service:    ${serviceLabel}
${addOnsStr ? `  Add-Ons:    ${addOnsStr}\n` : ''}  Date:       ${booking.date}
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
${addOnsStr ? `  Add-Ons:    ${addOnsStr}\n` : ''}  Date:       ${booking.date}
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
${addOnsStr ? `  Add-Ons:    ${addOnsStr}\n` : ''}  Date:       ${booking.date}
  Time:       ${booking.time}

If you'd like to reschedule or have any questions, please call or text us at (920) 255-3123 and we'd be happy to get you set up.

Sorry for any inconvenience,
- 920 Detailing
Kewaunee, Wisconsin`;
    } else if (type === 'reminder') {
      subject = `Reminder: Your appointment is tomorrow - 920 Detailing`;
      body = `Hi ${booking.name},

This is a friendly reminder that your 920 Detailing appointment is TOMORROW!

  Vehicle:    ${vehicleStr}
  Service:    ${serviceLabel}
${addOnsStr ? `  Add-Ons:    ${addOnsStr}\n` : ''}  Date:       ${booking.date}
  Time:       ${booking.time}

ARRIVAL INSTRUCTIONS:
- Please have your vehicle accessible and ready at the scheduled time.
- Remove any personal items from the areas being detailed.
- If you have a garage or prefer a specific location, just let us know in advance.
- We are appointment-only — located in Kewaunee, Wisconsin. Address will be confirmed upon booking.

Need to confirm or reschedule? Visit your bookings page:
https://920detailing.com/my-bookings

If anything comes up, call or text us at (920) 255-3123 and we'll work something out.

See you tomorrow,
— Blake
920 Detailing
Kewaunee, Wisconsin`;
    } else {
      return Response.json({ success: false, reason: 'Unknown type' });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    const sendEmail = async (to, emailSubject, emailBody) => {
      const mime = [
        `To: ${to}`,
        `Subject: ${emailSubject}`,
        `Content-Type: text/plain; charset=utf-8`,
        `MIME-Version: 1.0`,
        ``,
        emailBody,
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

    // Send customer email (only if they have an email)
    if (booking.email) {
      await sendEmail(booking.email, subject, body);
    }

    // Send owner notification
    let ownerSubject, ownerBody;
    if (type === 'submitted') {
      ownerSubject = `NEW booking request — ${booking.name} (${vehicleStr})`;
      ownerBody = `A new booking request needs your confirmation.

  Customer:   ${booking.name}
  Phone:      ${booking.phone}
${booking.email ? `  Email:      ${booking.email}\n` : ''}  Vehicle:    ${vehicleStr}
  Service:    ${serviceLabel}
${addOnsStr ? `  Add-Ons:    ${addOnsStr}\n` : ''}  Date:       ${booking.date}
  Time:       ${booking.time}
${booking.notes ? `  Notes:      ${booking.notes}\n` : ''}
Log in to the admin panel to confirm or cancel this booking.`;
    } else if (type === 'confirmed') {
      ownerSubject = `Booking CONFIRMED — ${booking.name} (${vehicleStr})`;
      ownerBody = `You have confirmed the following appointment:

  Customer:   ${booking.name}
  Phone:      ${booking.phone}
${booking.email ? `  Email:      ${booking.email}\n` : ''}  Vehicle:    ${vehicleStr}
  Service:    ${serviceLabel}
${addOnsStr ? `  Add-Ons:    ${addOnsStr}\n` : ''}  Date:       ${booking.date}
  Time:       ${booking.time}
${booking.notes ? `  Notes:      ${booking.notes}\n` : ''}
A confirmation email has been sent to the customer.`;
    } else if (type === 'cancelled') {
      ownerSubject = `Booking CANCELLED — ${booking.name} (${vehicleStr})`;
      ownerBody = `The following booking has been cancelled:

  Customer:   ${booking.name}
  Phone:      ${booking.phone}
  Vehicle:    ${vehicleStr}
  Service:    ${serviceLabel}
${addOnsStr ? `  Add-Ons:    ${addOnsStr}\n` : ''}  Date:       ${booking.date}
  Time:       ${booking.time}`;
    }

    if (ownerSubject) {
      await sendEmail(OWNER_EMAIL, ownerSubject, ownerBody);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});