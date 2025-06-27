const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/media' });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Optional health check route
app.get('/', (req, res) => {
  res.send('🧠 Streaming AI Agent is live');
});

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('🔗 WebSocket client connected');

  let audioChunks = [];

  ws.on('message', async (data) => {
    // Collect binary audio chunks
    audioChunks.push(data);
  });

  ws.on('close', async () => {
    console.log('❌ WebSocket connection closed, processing audio...');
    const audioBuffer = Buffer.concat(audioChunks);

    try {
      // Transcribe with Whisper
      const transcription = await openai.audio.transcriptions.create({
        file: audioBuffer,
        model: 'whisper-1'
      });

      console.log('📝 Transcribed Text:', transcription.text);

      // Respond with GPT-4o
      const chatResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are Michelle, a friendly AI appointment setter for Voxlify AI.'
          },
          {
            role: 'user',
            content: transcription.text
          }
        ]
      });

      const reply = chatResponse.choices[0].message.content;
      console.log('💬 GPT-4o Reply:', reply);

      ws.send(reply);
    } catch (error) {
      console.error('Error:', error.message);
      ws.send('Sorry, something went wrong.');
    }
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`✅ Streaming server listening on port ${PORT}`);
});
