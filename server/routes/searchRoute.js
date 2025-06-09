const express = require('express');
const router = express.Router();
const { searchMemoriesByFilter } = require('../db/mongoService');

router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    const results = await searchMemoriesByFilter({
      transcript: { $regex: query, $options: 'i' }
    });
    res.status(200).json(results);
  } catch (err) {
    console.error('Search failed:', err);
    res.status(500).send('Search error');
  }
});

module.exports = router;

