const express = require('express');
const protect = require('../middleware/authMiddleware');
const Recipe = require('../models/Recipe');
const { generateRecipes } = require('../services/aiService');

const router = express.Router();

// GENERATE RECIPES — send ingredients + preference to AI
router.post('/generate', async (req, res) => {
  try {
    const { ingredients, userPreference } = req.body;

    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ message: 'Please add at least one ingredient' });
    }

    const recipes = await generateRecipes(ingredients, userPreference);
    res.json({ recipes });
  } catch (err) {
    console.error('AI ERROR:', err.message);
    console.error('Full error:', err);
    res.status(500).json({ message: 'AI generation failed', error: err.message });
  }
});

// SAVE RECIPE — requires login
router.post('/save', protect, async (req, res) => {
  try {
    const recipe = await Recipe.create({
      ...req.body,
      userId: req.userId,
      isFavorite: true,
    });
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save recipe', error: err.message });
  }
});

// GET FAVORITES — requires login
router.get('/favorites', protect, async (req, res) => {
  try {
    const recipes = await Recipe.find({
      userId: req.userId,
      isFavorite: true,
    }).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch favorites', error: err.message });
  }
});

// DELETE FAVORITE — requires login
router.delete('/favorites/:id', protect, async (req, res) => {
  try {
    await Recipe.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    res.json({ message: 'Recipe removed from favorites' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete recipe', error: err.message });
  }
});

module.exports = router;