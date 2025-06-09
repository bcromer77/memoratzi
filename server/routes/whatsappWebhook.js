const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { transcribeAudio } = require('../services/whisperService');
const { analyzeChunk } = require('../../prism/analyzeTranscript');
const { insertTranscript } = require('../db/mongoService');
const router = express.Router();

// Helper to download voice file
const downloadAudio = async (mediaUrl, filename) => {
  const audioPath = path.join(__dirname, `../../tmp/audio/${filename}`);
  const writer = fs.createWriteStream(audioPath);
  const response = await axios({ url: mediaUrl, method: 'GET', responseType: 'stream' });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(audioPath));
    writer.on('error', reject);
  });
};

// POST /api/whatsapp-webhook
router.post('/whatsapp-webhook', async (req, res) => {
  try {
    const { MediaUrl0, From } = req.body;
    if (!MediaUrl0) return res.status(400).send('No media file.');

    const filename = `${Date.now()}_whatsapp.ogg`;
    const audioPath = await downloadAudio(MediaUrl0, filename);

    const transcript = await transcribeAudio(audioPath);
    const analyzedChunks = await analyzeChunk(transcript);

    await insertTranscript({
      source: 'whatsapp',
      from: From,
      transcript,
      analysis: analyzedChunks,
      createdAt: new Date(),
    });

    res.status(200).send('Voice note received and processed.');
  } catch (err) {
    console.error('Error handling WhatsApp voice note:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;

