const express = require('express');
const { VoiceResponse } = require('twilio').twiml;
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_CALENDAR_ID = process.env.GHL_CALENDAR_ID;

// Health check route (lets Railway know the app is running)
app.get('/', (req, res) => {
  res.send('Voxlify AI Agent is running!');
});

// Voice call handler
app.post('/call', async (req, res) => {
  const response = new VoiceResponse();

  response.say({ voice: 'Polly.Salli-Neural' }, "Hi there, this is Michelle with Voxlify AI. We help real estate agents close more deals with less effort by connecting them with qualified buyers and sellers. I’m calling to schedule a quick 15-minute demo. Is now a good time for a 2-minute chat?");
  response.pause({ length: 2 });
  response.say({ voice: 'Polly.Salli-Neural' }, "Let’s say you said yes. I’ll now look at our next available time slots.");

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

    response.say({ voice: 'Polly.Salli-Neural' }, "You’re all set! You’ll get an email and SMS confirmation shortly. Looking forward to helping you close more deals!");
  } catch (err) {
    console.error('Booking failed:', err?.response?.data || err.message);
    response.say({ voice: 'Polly.Salli-Neural' }, "Oops, something went wrong while booking. We’ll follow up by email.");
  }

  res.type('text/xml');
  res.send(response.toString());
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ AI voice agent running on port ${PORT}`));
