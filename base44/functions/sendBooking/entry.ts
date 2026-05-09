import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const OWNER_PHONE = Deno.env.get('OWNER_PHONE');
const OWNER_EMAIL = Deno.env.get('OWNER_EMAIL');

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { name, phone, email, vehicle, year, vehicleType, service, date, time, notes, addOns } = body;

    const serviceLabels = {
      interior: 'Interior Detailing',
      exterior: 'Exterior Detailing & Paint Correction',
      ceramic: 'Ceramic Coating',
      full: 'Interior + Exterior Bundle',
      unsure: 'Not Sure — Need a Quote',
    };
    const serviceLabel = serviceLabels[service] || service;

    // 1. Save booking to database
    const newBooking = await base44.asServiceRole.entities.Booking.create({
      name, phone, email, vehicle, year, service, date, time, notes, status: 'new'
    });

    // 2. Send confirmation email to customer (if email provided)
    if (email) {
      await base44.asServiceRole.functions.invoke('sendConfirmation', {
        bookingId: newBooking.id,
        type: 'submitted',
      });
    }

    // 2. Send SMS via Twilio
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromPhone = Deno.env.get('TWILIO_PHONE_NUMBER');

    const smsBody = `📅 New Booking!\n${name} | ${phone}\n${year ? year + ' ' : ''}${vehicle}${vehicleType ? ' (' + vehicleType + ')' : ''}\n${serviceLabel}${addOns ? '\nAdd-ons: ' + addOns : ''}\n${date} @ ${time}${notes ? '\nNotes: ' + notes : ''}`;

    const twilioRes = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: OWNER_PHONE,
          From: fromPhone,
          Body: smsBody,
        }),
      }
    );

    if (!twilioRes.ok) {
      const err = await twilioRes.text();
      console.error('Twilio owner SMS error:', err);
    }

    // 4. Send confirmation SMS to customer (if phone provided)
    if (phone) {
      const customerSmsBody = `Hi ${name}! Your booking request with 920 Detailing has been received.\n\nService: ${serviceLabel}\nVehicle: ${year ? year + ' ' : ''}${vehicle}\nDate: ${date} @ ${time}\n\nWe'll confirm your appointment within 24 hrs. Questions? Call/text (920) 255-3123.`;

      const customerSmsRes = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: phone,
            From: fromPhone,
            Body: customerSmsBody,
          }),
        }
      );

      if (!customerSmsRes.ok) {
        const err = await customerSmsRes.text();
        console.error('Twilio customer SMS error:', err);
      }
    }

    // 5. Send owner notification email via Gmail
    try {
      const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

      // Get authorized Gmail profile to use as sender/recipient
      const profileRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const profile = await profileRes.json();
      const ownerEmail = profile.emailAddress;

      const emailSubject = `New Booking: ${name} — ${serviceLabel}`;
      const emailBody = [
        `New booking request received.\n`,
        `Customer: ${name}`,
        `Phone: ${phone}`,
        email ? `Email: ${email}` : null,
        `Vehicle: ${year ? year + ' ' : ''}${vehicle}${vehicleType ? ' (' + vehicleType + ')' : ''}`,
        `Service: ${serviceLabel}`,
        addOns ? `Add-ons: ${addOns}` : null,
        `Date: ${date}${time ? ' @ ' + time : ''}`,
        notes ? `Notes: ${notes}` : null,
      ].filter(Boolean).join('\n');

      const mimeMessage = [
        `To: ${ownerEmail}`,
        `Subject: ${emailSubject}`,
        `Content-Type: text/plain; charset=utf-8`,
        `MIME-Version: 1.0`,
        ``,
        emailBody,
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
    } catch (emailErr) {
      console.error('Gmail owner email error:', emailErr);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});