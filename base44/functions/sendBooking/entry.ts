import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const OWNER_PHONE = Deno.env.get('OWNER_PHONE');
const OWNER_EMAIL = Deno.env.get('OWNER_EMAIL');

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { name, phone, email, vehicle, year, vehicleType, service, date, time, notes, addOns, add_ons, recaptchaToken } = body;

    // Verify reCAPTCHA token (skip if token not provided, e.g. domain restriction in preview)
    if (recaptchaToken) {
      const secretKey = Deno.env.get('reCAPTCHA_secret_key');
      const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret: secretKey, response: recaptchaToken }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        return Response.json({ error: 'reCAPTCHA verification failed. Please try again.' }, { status: 400 });
      }
    }

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
      name, phone, email, vehicle, year, service, date, time, notes, status: 'new',
      ...(add_ons && add_ons.length > 0 ? { add_ons } : {})
    });

    // 2. Send confirmation email to customer (if email provided)
    if (email) {
      await base44.asServiceRole.functions.invoke('sendConfirmation', {
        bookingId: newBooking.id,
        type: 'submitted',
      });
    }

    // 3. Send owner notification email via Gmail
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

      const subjBytes = new TextEncoder().encode(emailSubject);
      let subjBin = '';
      for (let i = 0; i < subjBytes.length; i++) subjBin += String.fromCharCode(subjBytes[i]);
      const encodedSubject = `=?UTF-8?B?${btoa(subjBin)}?=`;
      const mimeMessage = [
        `To: ${ownerEmail}`,
        `Subject: ${encodedSubject}`,
        `Content-Type: text/plain; charset=utf-8`,
        `MIME-Version: 1.0`,
        ``,
        emailBody,
      ].join('\r\n');

      const mimeBytes = new TextEncoder().encode(mimeMessage);
      let binaryStr = '';
      for (let i = 0; i < mimeBytes.length; i++) {
        binaryStr += String.fromCharCode(mimeBytes[i]);
      }
      const encoded = btoa(binaryStr)
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