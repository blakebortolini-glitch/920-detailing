import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { name, phone, email, vehicle, year, service, notes, photoUrls, recaptchaToken } = await req.json();

    // Verify reCAPTCHA token
    const secretKey = Deno.env.get('reCAPTCHA_secret_key');
    const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: secretKey, response: recaptchaToken || '' }),
    });
    const verifyData = await verifyRes.json();
    if (!verifyData.success || verifyData.score < 0.5) {
      return Response.json({ error: 'reCAPTCHA verification failed. Please try again.' }, { status: 400 });
    }

    const OWNER_EMAIL = Deno.env.get('OWNER_EMAIL');

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    const subject = `New Inquiry from ${name || 'a customer'}`;
    const body = [
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      `Vehicle: ${year ? year + ' ' : ''}${vehicle}`,
      `Service: ${service}`,
      `Notes: ${notes}`,
      photoUrls?.length ? `\nAttached Photos:\n${photoUrls.join('\n')}` : '',
    ].filter(Boolean).join('\n');

    const mime = [
      `To: ${OWNER_EMAIL}`,
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
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: encoded }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Gmail send error:', err);
      return Response.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});