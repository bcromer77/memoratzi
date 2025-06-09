const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db('memoratzi');
  }
  return db;
}

async function insertTranscript(memory) {
  const db = await connectDB();
  return db.collection('memories').insertOne(memory);
}

async function searchMemoriesByFilter(filter = {}) {
  const db = await connectDB();
  return db.collection('memories').find(filter).sort({ createdAt: -1 }).toArray();
}

module.exports = { insertTranscript, searchMemoriesByFilter };

