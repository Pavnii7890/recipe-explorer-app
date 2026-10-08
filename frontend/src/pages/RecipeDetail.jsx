import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import './RecipeDetail.css';

const CATEGORY_EMOJI = {
  Breakfast: '🍳',
  'Main Course': '🍛',
  Snack: '🥪',
  Dessert: '🍰',
  Drink: '🥤',
  Other: '🍽️',
};

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [checked, setChecked] = useState([]);
  const [copied, setCopied] = useState(false);
  const [cookMode, setCookMode] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchRecipeAndStatus = async () => {
      try {
        const { data } = await api.get(`/recipes/${id}`);
        setRecipe(data);

        if (user) {
          const savedData = await api.get('/recipes/saved');
          setIsSaved(savedData.data.some((r) => r._id === id));
        }
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching recipe');
        setLoading(false);
      }
    };

    fetchRecipeAndStatus();
  }, [id, user]);

  const steps = recipe
    ? (recipe.instructions || '')
        .split('\n')
        .map((s) => s.trim().replace(/^\d+[.)]\s*/, ''))
        .filter(Boolean)
    : [];

  useEffect(() => {
    if (!cookMode) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setCookMode(false);
      if (e.key === 'ArrowRight') setStepIndex((i) => Math.min(i + 1, steps.length - 1));
      if (e.key === 'ArrowLeft') setStepIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cookMode, steps.length]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await api.delete(`/recipes/${id}`);
        navigate('/');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete recipe');
      }
    }
  };

  const handleSaveToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      if (isSaved) {
        await api.post(`/recipes/${id}/unsave`);
        setIsSaved(false);
      } else {
        await api.post(`/recipes/${id}/save`);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Error toggling save status:', err);
    }
  };

  const toggleChecked = (index) => {
    setChecked((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const copyList = async () => {
    try {
      await navigator.clipboard.writeText(
        `${recipe.title}\n\n${recipe.ingredients.join('\n')}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Could not copy:', err);
    }
  };

  const startCooking = () => {
    setStepIndex(0);
    setCookMode(true);
  };

  if (loading) return <div className="loading">Loading recipe details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!recipe) return <div className="error-message">Recipe not found</div>;

  const ownerId = recipe.createdBy?._id || recipe.createdBy;
  const isOwner = Boolean(user && ownerId && user._id === ownerId);
  const category = recipe.category || 'Other';
  const ingredients = recipe.ingredients || [];

  return (
    <div className="recipe-detail-container animate-fade-in">
      <div className="card detail-card">
        {recipe.imageUrl ? (
          <div
            className="detail-image"
            style={{ backgroundImage: `url(${recipe.imageUrl})` }}
          />
        ) : (
          <div className="detail-image detail-image-placeholder">
            {CATEGORY_EMOJI[category] || '🍽️'}
          </div>
        )}

        <div className="detail-content">
          <div className="detail-header">
            <div>
              <span className="detail-badge">{category}</span>
              <h1 className="detail-title">{recipe.title}</h1>
            </div>
            <div className="detail-actions">
              <button
                className={`btn-icon large ${isSaved ? 'saved' : ''}`}
                onClick={handleSaveToggle}
                title={isSaved ? 'Remove from Favorites' : 'Save to Favorites'}
              >
                ❤️
              </button>
              {isOwner && (
                <>
                  <Link to={`/recipes/${id}/edit`} className="btn btn-secondary">
                    Edit
                  </Link>
                  <button className="btn btn-secondary btn-delete" onClick={handleDelete}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="detail-meta">
            <span>
              By <strong>{recipe.createdBy?.username || 'Unknown Chef'}</strong>
            </span>
            <span>Published on {new Date(recipe.createdAt).toLocaleDateString()}</span>
            <span>
              {ingredients.length} ingredients · {steps.length} steps
            </span>
          </div>

          <p className="detail-description">{recipe.description}</p>

          {steps.length > 0 && (
            <button className="cook-start-btn" onClick={startCooking}>
              👩‍🍳 Start cooking mode
            </button>
          )}

          <div className="detail-grid">
            <div className="detail-section ingredients">
              <h2>Ingredients</h2>
              <p className="check-progress">
                {checked.length} of {ingredients.length} ready
              </p>
              <ul className="check-list">
                {ingredients.map((ingredient, index) => (
                  <li key={index}>
                    <label className={checked.includes(index) ? 'is-checked' : ''}>
                      <input
                        type="checkbox"
                        checked={checked.includes(index)}
                        onChange={() => toggleChecked(index)}
                      />
                      <span>{ingredient}</span>
                    </label>
                  </li>
                ))}
              </ul>
              <button className="copy-btn" onClick={copyList}>
                {copied ? 'Copied!' : 'Copy shopping list'}
              </button>
            </div>

            <div className="detail-section instructions">
              <h2>Instructions</h2>
              <ol className="steps-list">
                {steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      {cookMode && (
        <div className="cook-overlay" role="dialog" aria-label="Cooking mode">
          <div className="cook-top">
            <span className="cook-title">{recipe.title}</span>
            <button className="cook-exit" onClick={() => setCookMode(false)}>
              Exit ✕
            </button>
          </div>

          <div className="cook-progress">
            <div
              className="cook-progress-fill"
              style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>

          <div className="cook-body">
            <p className="cook-count">
              Step {stepIndex + 1} of {steps.length}
            </p>
            <p className="cook-step">{steps[stepIndex]}</p>
          </div>

          <div className="cook-nav">
            <button
              className="cook-btn"
              disabled={stepIndex === 0}
              onClick={() => setStepIndex(stepIndex - 1)}
            >
              ← Back
            </button>
            {stepIndex < steps.length - 1 ? (
              <button
                className="cook-btn cook-btn-primary"
                onClick={() => setStepIndex(stepIndex + 1)}
              >
                Next →
              </button>
            ) : (
              <button
                className="cook-btn cook-btn-primary"
                onClick={() => setCookMode(false)}
              >
                Done 🎉
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;
