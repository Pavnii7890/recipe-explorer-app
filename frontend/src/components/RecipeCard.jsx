import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './RecipeCard.css';

const RecipeCard = ({ recipe, onSaveToggle, isSaved }) => {
  const { user } = useContext(AuthContext);

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
        <div className="recipe-image recipe-image-placeholder">
          🍽️ Recipe
        </div>
      )}
      
      <div className="recipe-content">
        <h3 className="recipe-title">{recipe.title}</h3>
        <p className="recipe-description">{recipe.description.substring(0, 100)}...</p>
        
        <div className="recipe-footer">
          <span className="recipe-author">By {recipe.createdBy.username}</span>
          {user && (
            <button 
              className={`btn-icon ${isSaved ? 'saved' : ''}`}
              onClick={handleSaveClick}
              title={isSaved ? "Remove from Favorites" : "Save to Favorites"}
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
