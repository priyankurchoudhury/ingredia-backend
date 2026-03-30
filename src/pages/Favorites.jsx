import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFavorites } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import { Link } from 'react-router-dom';
import './Favorites.css';

const Favorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data } = await getFavorites();
        setFavorites(data);
      } catch (err) {
        console.error('Failed to fetch favorites:', err);
      }
      setLoading(false);
    };

    if (user) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleToggleFavorite = (id, isNowFavorite) => {
    if (!isNowFavorite) {
      setFavorites(favorites.filter((f) => f._id !== id));
    }
  };

  if (!user) {
    return (
      <div className="favorites-page">
        <div className="empty-state">
          <h2>Log in to see your favorites</h2>
          <p>Save recipes you love and find them here anytime.</p>
          <Link to="/login" className="empty-btn">Log in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-container">
        <h1 className="favorites-title">Your saved recipes</h1>

        {loading && <p className="favorites-loading">Loading...</p>}

        {!loading && favorites.length === 0 && (
          <div className="empty-state">
            <h2>No saved recipes yet</h2>
            <p>Go find some recipes and tap the heart to save them!</p>
            <Link to="/" className="empty-btn">Find recipes</Link>
          </div>
        )}

        {favorites.map((recipe) => (
          <RecipeCard
            key={recipe._id}
            recipe={recipe}
            isSaved={true}
            favoriteId={recipe._id}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default Favorites;