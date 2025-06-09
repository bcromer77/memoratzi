const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

async function transcribeAudio(audioPath) {
  return new Promise((resolve, reject) => {
    const outputPath = audioPath.replace(/\.[^/.]+$/, '.txt');
    const command = `whisper "${audioPath}" --language English --model base --output_format txt --output_dir ${path.dirname(audioPath)}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Whisper error:', stderr);
        return reject(error);
      }
      fs.readFile(outputPath, 'utf-8', (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  });
}

module.exports = { transcribeAudio };

