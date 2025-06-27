const express = require('express');
const { VoiceResponse } = require('twilio').twiml;
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Health check route
app.get('/', (req, res) => {
  res.send('Voxlify AI Agent is running!');
});

// ✅ Twilio webhook for voice call
app.post('/call', (req, res) => {
  const twiml = new VoiceResponse();

  twiml.say('Hold on a moment while we connect you to our AI agent.');

  twiml.connect().stream({
    url: 'wss://voxlify-voice-agent-production-e3bf.up.railway.app/media'
  });

  res.type('text/xml');
  res.send(twiml.toString());
});

// Server listener
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ AI voice agent running on port ${PORT}`);
});
