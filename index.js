require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { twiml: { VoiceResponse } } = require('twilio');

const app = express();
app.use(express.urlencoded({ extended: true }));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_CALENDAR_ID = process.env.GHL_CALENDAR_ID;

app.post('/call', async (req, res) => {
  const response = new VoiceResponse();
  response.say({ voice: 'Polly.Joanna' }, "Hi there, this is Michelle with Voxlify AI. We help real estate agents close more deals with less effort by connecting them with qualified buyers and sellers. I’m calling to schedule a quick 15-minute demo. Is now a good time for a 2-minute chat?");
response.pause({ length: 2 });
response.say({ voice: 'Polly.Joanna' }, "Let’s say you said yes. I’ll now look at our next available time slots.");


  say.say("Hi there, this is Michelle with Voxlify AI. We help real estate agents close more deals with less effort by connecting them with qualified buyers and sellers. I’m calling to schedule a quick 15-minute demo. Is now a good time for a 2-minute chat?");
  say.pause({ length: 2 });
  say.say("Let’s say you said yes. I’ll now look at our next available time slots.");

  const slot = 'tomorrow at 10 AM';
  say.say(`Perfect, we have an opening ${slot}. I’ll go ahead and book that for you.`);

  try {
    await axios.post(
      'https://rest.gohighlevel.com/v1/appointments/',
      {
        calendarId: GHL_CALENDAR_ID,
        contact: {
          email: 'test@example.com',
          phone: req.body.To,
          name: 'Demo Prospect'
        },
        startTime: new Date(Date.now() + 86400000).toISOString(),
        endTime: new Date(Date.now() + 86400000 + 15 * 60000).toISOString()
      },
      {
        headers: {
          Authorization: `Bearer ${GHL_API_KEY}`
        }
      }
    );
    say.say('You’re all set! You’ll get an email and SMS confirmation shortly. Looking forward to helping you close more deals!');
  } catch (err) {
    console.error('Booking failed:', err?.response?.data || err.message);
    say.say('Oops, something went wrong while booking. We’ll follow up by email.');
  }

  res.type('text/xml');
  res.send(response.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ AI voice agent running on port ${PORT}`));
