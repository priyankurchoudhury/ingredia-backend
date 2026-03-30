import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveRecipe, deleteFavorite } from '../services/api';
import Modal from './Modal';
import './RecipeCard.css';

const RecipeCard = ({ recipe, isSaved, favoriteId, onToggleFavorite }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(isSaved || false);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleFavorite = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setSaving(true);
    try {
      if (liked && favoriteId) {
        await deleteFavorite(favoriteId);
        setLiked(false);
        if (onToggleFavorite) onToggleFavorite(favoriteId, false);
      } else {
        const { data } = await saveRecipe(recipe);
        setLiked(true);
        if (onToggleFavorite) onToggleFavorite(data._id, true);
      }
    } catch (err) {
      console.error('Failed to save recipe:', err);
      setShowErrorModal(true);
    }
    setSaving(false);
  };

  return (
    <div className="recipe-card">
      {/* Login required modal */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Log in to save recipes"
        message="Create a free account to save your favorite recipes and access them anytime."
        actions={[
          {
            label: 'Not now',
            primary: false,
            onClick: () => setShowLoginModal(false),
          },
          {
            label: 'Log in',
            primary: true,
            onClick: () => {
              setShowLoginModal(false);
              navigate('/login');
            },
          },
        ]}
      />

      {/* Error modal */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Something went wrong"
        message="We couldn't save this recipe. Please check your connection and try again."
      />

      <div className="recipe-header">
        <div>
          <h3 className="recipe-name">{recipe.name}</h3>
          {recipe.matchNote && (
            <p className="match-note">{recipe.matchNote}</p>
          )}
        </div>
        <button
          className={`heart-btn ${liked ? 'liked' : ''}`}
          onClick={handleFavorite}
          disabled={saving}
        >
          {liked ? '♥' : '♡'}
        </button>
      </div>

      <div className="recipe-stats">
        <span className="stat">
          <strong>{recipe.cookTime}</strong> cook
        </span>
        <span className="stat">
          <strong>{recipe.calories}</strong> kcal
        </span>
        <span className="stat">
          <strong>{recipe.difficulty}</strong>
        </span>
      </div>

      {recipe.tags && (
        <div className="recipe-tags">
          {recipe.tags.map((tag, i) => (
            <span key={i} className="recipe-tag">{tag}</span>
          ))}
        </div>
      )}

      {/* Expandable details */}
      <button
        className="expand-btn"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'Hide details ▲' : 'View full recipe ▼'}
      </button>

      {expanded && (
        <div className="recipe-details">
          {/* Nutrition */}
          <div className="nutrition-grid">
            <div className="nut-box">
              <div className="nut-val">{recipe.calories}</div>
              <div className="nut-label">Calories</div>
            </div>
            <div className="nut-box">
              <div className="nut-val">{recipe.protein}</div>
              <div className="nut-label">Protein</div>
            </div>
            <div className="nut-box">
              <div className="nut-val">{recipe.fat}</div>
              <div className="nut-label">Fat</div>
            </div>
            <div className="nut-box">
              <div className="nut-val">{recipe.carbs}</div>
              <div className="nut-label">Carbs</div>
            </div>
          </div>

          {/* Ingredients */}
          <h4 className="detail-heading">Ingredients</h4>
          <ul className="detail-list">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>

          {/* Steps */}
          <h4 className="detail-heading">Steps</h4>
          <ol className="steps-list">
            {recipe.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default RecipeCard;