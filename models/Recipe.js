const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  ingredients: [String],
  steps: [String],
  cookTime: String,
  difficulty: String,
  calories: Number,
  protein: String,
  fat: String,
  carbs: String,
  tags: [String],
  userPreference: String,   // What the user asked for
  matchNote: String,         // "Matched: spicy and quick"
  isFavorite: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Recipe', recipeSchema);