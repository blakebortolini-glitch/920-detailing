import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const OWNER_PHONE = '+19202553123';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { name, phone, email, vehicle, year, service, date, time, notes } = body;

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

    const smsBody = `📅 New Booking!\n${name} | ${phone}\n${year ? year + ' ' : ''}${vehicle}\n${serviceLabel}\n${date} @ ${time}${notes ? '\nNotes: ' + notes : ''}`;

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

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});