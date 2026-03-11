import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import './CreateRecipe.css';

const CreateRecipe = () => {
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    imageUrl: '',
    instructions: '',
  });
  const [ingredients, setIngredients] = useState(['']);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredientField = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredientField = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Filter out empty ingredients
    const filteredIngredients = ingredients.filter(i => i.trim() !== '');
    
    if (filteredIngredients.length === 0) {
      return setError('Please add at least one ingredient');
    }

    try {
      await api.post('/recipes', {
        ...recipe,
        ingredients: filteredIngredients
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create recipe');
    }
  };

  return (
    <div className="create-container animate-fade-in">
      <div className="card create-card">
        <h2 className="page-title">Create New Recipe</h2>
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Recipe Title</label>
            <input
              type="text"
              name="title"
              value={recipe.title}
              onChange={handleChange}
              required
              placeholder="e.g., Authentic Spaghetti Carbonara"
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={recipe.description}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Brief description of the recipe..."
            />
          </div>

          <div className="form-group">
            <label>Image URL (Optional)</label>
            <input
              type="url"
              name="imageUrl"
              value={recipe.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-group ingredients-section">
            <label>Ingredients</label>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-row">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  placeholder={`Ingredient ${index + 1}`}
                  required={index === 0}
                />
                {ingredients.length > 1 && (
                  <button 
                    type="button" 
                    className="btn-remove"
                    onClick={() => removeIngredientField(index)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              className="btn btn-secondary btn-add"
              onClick={addIngredientField}
            >
              + Add Ingredient
            </button>
          </div>

          <div className="form-group">
            <label>Instructions</label>
            <textarea
              name="instructions"
              value={recipe.instructions}
              onChange={handleChange}
              required
              rows="6"
              placeholder="Step-by-step instructions..."
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-submit">
            Publish Recipe
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipe;
