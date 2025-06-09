function analyzeChunk(text) {
  const chunks = text.split(/\n|\.\s+/).filter(c => c.trim().length > 10);
  return chunks.map(chunk => ({
    text: chunk,
    emotion: detectEmotion(chunk),
    topic: extractTopic(chunk),
    createdAt: new Date()
  }));
}

function detectEmotion(chunk) {
  const emotionalKeywords = {
    happy: ['excited', 'love', 'grateful'],
    sad: ['tired', 'stuck', 'lost'],
    angry: ['frustrated', 'annoyed'],
    inspired: ['idea', 'plan', 'project']
  };

  for (const [emotion, words] of Object.entries(emotionalKeywords)) {
    if (words.some(w => chunk.toLowerCase().includes(w))) {
      return emotion;
    }
  }

  return 'neutral';
}

function extractTopic(chunk) {
  if (chunk.toLowerCase().includes('retreat')) return 'retreats';
  if (chunk.toLowerCase().includes('startup')) return 'startups';
  if (chunk.toLowerCase().includes('burnout')) return 'mental health';
  return 'misc';
}

module.exports = { analyzeChunk };

