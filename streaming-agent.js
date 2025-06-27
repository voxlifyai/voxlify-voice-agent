const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (ws) => {
  console.log('🟢 WebSocket connected.');

  ws.on('message', async (msg) => {
    const data = JSON.parse(msg);

    // Only handle audio data
    if (data.event === 'media') {
      const base64Audio = data.media.payload;
      // Decode & process with Whisper (coming soon)
    }

    if (data.event === 'start') {
      console.log('🚀 Stream started');
    }

    if (data.event === 'stop') {
      console.log('🛑 Stream ended');
    }
  });

  ws.on('close', () => console.log('🔌 WebSocket closed'));
});
