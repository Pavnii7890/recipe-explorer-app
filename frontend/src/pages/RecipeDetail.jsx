import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import './RecipeDetail.css';

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
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
          const isUserSaved = savedData.data.some(r => r._id === id);
          setIsSaved(isUserSaved);
        }

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching recipe');
        setLoading(false);
      }
    };

    fetchRecipeAndStatus();
  }, [id, user]);

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

  if (loading) return <div className="loading">Loading recipe details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!recipe) return <div className="error-message">Recipe not found</div>;

  const isOwner = user && user._id === (recipe.createdBy._id || recipe.createdBy);

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
            🍽️
          </div>
        )}
        
        <div className="detail-content">
          <div className="detail-header">
            <h1 className="detail-title">{recipe.title}</h1>
            <div className="detail-actions">
              <button 
                className={`btn-icon large ${isSaved ? 'saved' : ''}`}
                onClick={handleSaveToggle}
                title={isSaved ? "Remove from Favorites" : "Save to Favorites"}
              >
                ❤️
              </button>
              {isOwner && (
                <button 
                  className="btn btn-secondary btn-delete"
                  onClick={handleDelete}
                >
                  Delete Recipe
                </button>
              )}
            </div>
          </div>
          
          <div className="detail-meta">
            <span>By <strong>{recipe.createdBy?.username || 'Unknown Chef'}</strong></span>
            <span>Published on {new Date(recipe.createdAt).toLocaleDateString()}</span>
          </div>

          <p className="detail-description">{recipe.description}</p>

          <div className="detail-grid">
            <div className="detail-section ingredients">
              <h2>Ingredients</h2>
              <ul className="ingredients-list">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div className="detail-section instructions">
              <h2>Instructions</h2>
              <div className="instructions-content">
                {recipe.instructions.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
