const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const ingredientRoutes = require('./routes/ingredientRoutes');

const app = express();

// CORS — allow frontend URLs
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, '');
    const isAllowed = allowedOrigins.some(
      (allowed) => cleanOrigin === allowed.replace(/\/$/, '')
    );
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true);
    }
  },
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/ingredients', ingredientRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Ingredia API is running!' });
});

const PORT = process.env.PORT || 5000;

// ─── Keep alive: ping self every 14 minutes to prevent Render free tier sleep ───
function keepAlive() {
  const url = process.env.RENDER_EXTERNAL_URL;
  if (!url) {
    console.log('Keep-alive skipped (no RENDER_EXTERNAL_URL — running locally)');
    return;
  }

  setInterval(async () => {
    try {
      const response = await fetch(`${url}/`);
      console.log(`Keep-alive ping: ${response.status} at ${new Date().toISOString()}`);
    } catch (err) {
      console.log('Keep-alive ping failed:', err.message);
    }
  }, 14 * 60 * 1000); // Every 14 minutes

  console.log(`Keep-alive started — pinging ${url} every 14 minutes`);
}

// Connect to MongoDB, then start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB!');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      keepAlive();
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
