import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './RecipeCard.css';

const CATEGORY_EMOJI = {
  Breakfast: '🍳',
  'Main Course': '🍛',
  Snack: '🥪',
  Dessert: '🍰',
  Drink: '🥤',
  Other: '🍽️',
};

const RecipeCard = ({ recipe, onSaveToggle, isSaved }) => {
  const { user } = useContext(AuthContext);
  const category = recipe.category || 'Other';
  const description = recipe.description || '';
  const shortDescription =
    description.length > 100 ? `${description.substring(0, 100)}...` : description;

  const handleSaveClick = (e) => {
    e.preventDefault();
    if (onSaveToggle) {
      onSaveToggle(recipe._id, isSaved);
    }
  };

  return (
    <Link to={`/recipes/${recipe._id}`} className="recipe-card card animate-fade-in">
      {recipe.imageUrl ? (
        <div
          className="recipe-image"
          style={{ backgroundImage: `url(${recipe.imageUrl})` }}
        />
      ) : (
                <div
          className={`recipe-image recipe-image-placeholder cat-${category
            .toLowerCase()
            .replace(/\s+/g, '-')}`}
        >
          {CATEGORY_EMOJI[category] || '🍽️'} {category}
        </div>
      )}

      <div className="recipe-content">
        <span className="category-badge">{category}</span>
        <h3 className="recipe-title">{recipe.title}</h3>
        <p className="recipe-description">{shortDescription}</p>

        <div className="recipe-footer">
          <span className="recipe-author">
            By {recipe.createdBy?.username || 'Unknown'}
            {recipe.ingredients?.length
              ? ` · ${recipe.ingredients.length} ingredients`
              : ''}
          </span>
          {user && (
            <button
              className={`btn-icon ${isSaved ? 'saved' : ''}`}
              onClick={handleSaveClick}
              title={isSaved ? 'Remove from Favorites' : 'Save to Favorites'}
            >
              ❤️
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
