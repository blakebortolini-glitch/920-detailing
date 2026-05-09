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

    let bookingId, type;
    if (payload.event) {
      bookingId = payload.event.entity_id;
      type = payload.data?.status;
    } else {
      bookingId = payload.bookingId;
      type = payload.type;
    }

    const booking = await base44.asServiceRole.entities.Booking.get(bookingId);
    if (!booking || !booking.phone) {
      return Response.json({ success: false, reason: 'No phone on booking' });
    }

    const serviceLabel = SERVICE_LABELS[booking.service] || booking.service;
    const vehicleStr = `${booking.year ? booking.year + ' ' : ''}${booking.vehicle}`;

    let smsBody;

    if (type === 'submitted') {
      smsBody = `Hi ${booking.name}! Thanks for reaching out to 920 Detailing. We've received your request and will get back to you within 24 hours to confirm your appointment.\n\nService: ${serviceLabel}\nVehicle: ${vehicleStr}\nDate: ${booking.date} @ ${booking.time}\n\nQuestions? Call or text us at (920) 255-3123.`;
    } else if (type === 'confirmed') {
      smsBody = `Great news, ${booking.name}! Your appointment with 920 Detailing is confirmed.\n\nService: ${serviceLabel}\nVehicle: ${vehicleStr}\nDate: ${booking.date} @ ${booking.time}\n\nSee you then! Questions? Call or text (920) 255-3123.`;
    } else if (type === 'cancelled') {
      smsBody = `Hi ${booking.name}, we're sorry to let you know that your appointment with 920 Detailing has been cancelled.\n\nService: ${serviceLabel}\nVehicle: ${vehicleStr}\nDate: ${booking.date} @ ${booking.time}\n\nWe'd be happy to get another appointment set up for you. If you have any questions, please call or text us at (920) 255-3123.`;
    } else if (type === 'reminder') {
      smsBody = `Hi ${booking.name}! Just a reminder that your 920 Detailing appointment is TOMORROW.\n\nService: ${serviceLabel}\nVehicle: ${vehicleStr}\nDate: ${booking.date} @ ${booking.time}\n\nSee you then! Questions? Call or text (920) 255-3123.`;
    } else {
      return Response.json({ success: false, reason: 'Unknown type' });
    }

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromPhone = Deno.env.get('TWILIO_PHONE_NUMBER');

    const twilioRes = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: booking.phone,
          From: fromPhone,
          Body: smsBody,
        }),
      }
    );

    if (!twilioRes.ok) {
      const err = await twilioRes.text();
      console.error('Twilio SMS error:', err);
      return Response.json({ success: false, error: err }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});