import axios from 'axios';

// Create an axios instance with the backend URL
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// This runs BEFORE every request — attaches the login token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth API calls
export const signup = (formData) => API.post('/auth/signup', formData);
export const login = (formData) => API.post('/auth/login', formData);

// Recipe API calls
export const generateRecipes = (ingredients, userPreference) =>
  API.post('/recipes/generate', { ingredients, userPreference });

export const saveRecipe = (recipeData) =>
  API.post('/recipes/save', recipeData);

export const getFavorites = () => API.get('/recipes/favorites');

export const deleteFavorite = (id) =>
  API.delete(`/recipes/favorites/${id}`);

export const searchIngredients = (query) =>
    API.get(`/ingredients/search?q=${encodeURIComponent(query)}`);