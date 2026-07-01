import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const to = payload.to || 'blakebortolini@gmail.com';

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    const subject = `Test email — 920 Detailing`;
    const body = `Hi Blake,

This is a test email to verify that special characters render correctly.

Here are some test characters:
  - Em-dash: —
  - En-dash: –
  - Curly quotes: "smart quotes"
  - Apostrophe: Blake's
  - Bullet: •
  - Copyright: ©

If everything above looks clean (no garbled text like Ã¢Â€Â), the encoding fix is working!

— 920 Detailing
Kewaunee, Wisconsin
(920) 255-3123`;

    const subjectBytes = new TextEncoder().encode(subject);
    let subjectBin = '';
    for (let i = 0; i < subjectBytes.length; i++) subjectBin += String.fromCharCode(subjectBytes[i]);
    const encodedSubject = `=?UTF-8?B?${btoa(subjectBin)}?=`;

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

    if (!res.ok) {
      const err = await res.text();
      return Response.json({ success: false, error: err }, { status: 500 });
    }

    const data = await res.json();
    return Response.json({ success: true, messageId: data.id });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});