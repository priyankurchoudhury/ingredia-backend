import { useState, useEffect, useRef } from 'react';
import { searchIngredients } from '../services/api';
import './IngredientInput.css';

const quickTags = [
  'Spicy', 'Quick meal', 'Low carb', 'Kid-friendly',
  'High protein', 'Budget', 'Comfort food', 'Healthy',
];

const IngredientInput = ({ onSubmit, loading }) => {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [preference, setPreference] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  // Autocomplete state
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [searching, setSearching] = useState(false);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);

  // Fetch suggestions as user types (with debounce)
  useEffect(() => {
    if (inputValue.trim().length < 1) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    // Debounce: wait 250ms after user stops typing
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await searchIngredients(inputValue.trim());
        // Filter out already-added ingredients
        const filtered = data.filter(
          (item) => !ingredients.includes(item.name)
        );
        setSuggestions(filtered);
        setShowDropdown(filtered.length > 0);
        setHighlightIndex(-1);
      } catch (err) {
        console.error('Search failed:', err);
        setSuggestions([]);
      }
      setSearching(false);
    }, 250);

    return () => clearTimeout(debounceRef.current);
  }, [inputValue, ingredients]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const addIngredient = (name) => {
    const trimmed = (name || inputValue).trim().toLowerCase();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
    }
    setInputValue('');
    setSuggestions([]);
    setShowDropdown(false);
    setHighlightIndex(-1);
    inputRef.current?.focus();
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const toggleQuickTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (ingredients.length === 0) return;
    const fullPreference = [
      preference,
      ...selectedTags.map((t) => t.toLowerCase()),
    ]
      .filter(Boolean)
      .join(', ');
    onSubmit(ingredients, fullPreference);
  };

  const handleKeyDown = (e) => {
    if (showDropdown && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightIndex >= 0) {
          addIngredient(suggestions[highlightIndex].name);
        } else {
          addIngredient();
        }
      } else if (e.key === 'Escape') {
        setShowDropdown(false);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  // Capitalize first letter for display
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="ingredient-input">
      <h1 className="hero-title">What's in your fridge?</h1>
      <p className="hero-subtitle">
        Add ingredients and tell AI what you're craving
      </p>

      {/* Ingredient tags */}
      <div className="tags-container">
        {ingredients.map((ing, index) => (
          <span key={index} className="ingredient-tag">
            {capitalize(ing)}
            <button
              className="tag-remove"
              onClick={() => removeIngredient(index)}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Add ingredient input with autocomplete */}
      <div className="input-row">
        <div className="autocomplete-wrapper">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type an ingredient..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) setShowDropdown(true);
            }}
            className="ingredient-field"
            autoComplete="off"
          />

          {/* Autocomplete dropdown */}
          {showDropdown && (
            <div className="autocomplete-dropdown" ref={dropdownRef}>
              {suggestions.map((item, i) => (
                <div
                  key={item.name}
                  className={`autocomplete-item ${
                    i === highlightIndex ? 'highlighted' : ''
                  }`}
                  onClick={() => addIngredient(item.name)}
                  onMouseEnter={() => setHighlightIndex(i)}
                >
                  <span className="autocomplete-name">
                    {capitalize(item.name)}
                  </span>
                  <span className="autocomplete-category">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Loading indicator inside input */}
          {searching && inputValue.length > 0 && (
            <div className="autocomplete-loading">
              <div className="mini-spinner"></div>
            </div>
          )}
        </div>

        <button onClick={() => addIngredient()} className="add-btn">
          Add
        </button>
      </div>

      {/* AI preference text box */}
      <div className="preference-section">
        <label className="pref-label">Tell the AI what you'd like</label>
        <textarea
          className="pref-textarea"
          placeholder="e.g. Something spicy and quick, under 20 minutes. I'm on a low-carb diet..."
          value={preference}
          onChange={(e) => setPreference(e.target.value)}
        />
        <div className="quick-tags">
          {quickTags.map((tag) => (
            <button
              key={tag}
              className={`quick-tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
              onClick={() => toggleQuickTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        className="cook-btn"
        disabled={ingredients.length === 0 || loading}
      >
        {loading ? 'Ingredia is cooking...' : 'Find recipes with Ingredia'}
      </button>
    </div>
  );
};

export default IngredientInput;