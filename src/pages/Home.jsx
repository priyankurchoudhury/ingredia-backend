import { useState } from 'react';
import IngredientInput from '../components/IngredientInput';
import RecipeCard from '../components/RecipeCard';
import Modal from '../components/Modal';
import { generateRecipes } from '../services/api';
import './Home.css';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleGenerate = async (ingredients, userPreference) => {
    setLoading(true);
    setError('');
    setRecipes([]);

    try {
      const { data } = await generateRecipes(ingredients, userPreference);
      setRecipes(data.recipes);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Something went wrong. Please try again.';
      setError(msg);
      setShowErrorModal(true);
    }
    setLoading(false);
  };

  return (
    <div className="home-page">
      {/* Error modal */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Couldn't generate recipes"
        message={error || 'Something went wrong. Please check your ingredients and try again.'}
        actions={[
          {
            label: 'Try again',
            primary: true,
            onClick: () => setShowErrorModal(false),
          },
        ]}
      />

      <IngredientInput onSubmit={handleGenerate} loading={loading} />

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">
            AI is finding the perfect recipes for you...
          </p>
        </div>
      )}

      {recipes.length > 0 && (
        <div className="recipes-section">
          <h2 className="section-title">AI suggested recipes</h2>
          {recipes.map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;