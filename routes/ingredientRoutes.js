const express = require('express');
const Ingredient = require('../models/Ingredient');

const router = express.Router();

// SEARCH ingredients — returns matches as user types
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 1) {
      return res.json([]);
    }

    // Find ingredients that START with the search query (fast + relevant)
    const results = await Ingredient.find({
      name: { $regex: `^${q.toLowerCase()}`, $options: 'i' },
    })
      .limit(10)
      .select('name category -_id')
      .lean();

    // If fewer than 10 results, also search for CONTAINS (broader match)
    if (results.length < 10) {
      const containsResults = await Ingredient.find({
        name: {
          $regex: q.toLowerCase(),
          $options: 'i',
        },
        // Exclude already found items
        name: {
          $regex: q.toLowerCase(),
          $options: 'i',
          $nin: results.map((r) => r.name),
        },
      })
        .limit(10 - results.length)
        .select('name category -_id')
        .lean();

      results.push(
        ...containsResults.filter(
          (cr) => !results.some((r) => r.name === cr.name)
        )
      );
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
});

module.exports = router;