// Netlify Function example to send SMS via Twilio when a form is submitted.
// Requires environment variables: TWILIO_SID, TWILIO_TOKEN, TWILIO_FROM, TO_NUMBER

const twilio = require('twilio');

exports.handler = async function(event, context) {
  try {
    const body = JSON.parse(event.body);
    const formData = body.payload || body; // depends on how webhook posts
    const message = `New enquiry from ${formData.name || 'unknown'} - ${formData.service || ''} - ${formData.phone || ''}`;

    const accountSid = process.env.TWILIO_SID;
    const authToken = process.env.TWILIO_TOKEN;
    const from = process.env.TWILIO_FROM;
    const to = process.env.TO_NUMBER; // your mobile in E.164 format

    if(!accountSid || !authToken || !from || !to) {
      return { statusCode: 500, body: 'Twilio credentials not configured' };
    }

    const client = twilio(accountSid, authToken);
    await client.messages.create({ body: message, from, to });

    return { statusCode: 200, body: 'SMS sent' };
  } catch (err) {
    return { statusCode: 500, body: String(err) };
  }
};
