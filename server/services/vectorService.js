const axios = require('axios');

async function getEmbedding(text) {
  const apiKey = process.env.OPENAI_API_KEY;

  const response = await axios.post(
    'https://api.openai.com/v1/embeddings',
    {
      input: text,
      model: 'text-embedding-ada-002'
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.data[0].embedding;
}

module.exports = { getEmbedding };

