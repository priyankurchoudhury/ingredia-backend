const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
});


module.exports = mongoose.model('Ingredient', ingredientSchema);