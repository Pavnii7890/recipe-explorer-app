import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import './CreateRecipe.css';

const CATEGORIES = ['Breakfast', 'Main Course', 'Snack', 'Dessert', 'Drink', 'Other'];

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    imageUrl: '',
    instructions: '',
    category: 'Other',
  });
  const [ingredients, setIngredients] = useState(['']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const load = async () => {
      try {
        const { data } = await api.get(`/recipes/${id}`);
        setRecipe({
          title: data.title || '',
          description: data.description || '',
          imageUrl: data.imageUrl || '',
          instructions: data.instructions || '',
          category: data.category || 'Other',
        });
        setIngredients(data.ingredients?.length ? data.ingredients : ['']);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load recipe');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleIngredientChange = (index, value) => {
    const next = [...ingredients];
    next[index] = value;
    setIngredients(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleaned = ingredients.filter((i) => i.trim() !== '');
    if (cleaned.length === 0) {
      return setError('Please add at least one ingredient');
    }
    try {
      await api.put(`/recipes/${id}`, { ...recipe, ingredients: cleaned });
      navigate(`/recipes/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update recipe');
    }
  };

  if (loading) return <div className="loading">Loading recipe...</div>;

  return (
    <div className="create-container animate-fade-in">
      <div className="card create-card">
        <h2 className="page-title">Edit Recipe</h2>
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Recipe Title</label>
            <input type="text" name="title" value={recipe.title} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category" value={recipe.category} onChange={handleChange}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={recipe.description} onChange={handleChange} required rows="3" />
          </div>

          <div className="form-group">
            <label>Image URL (Optional)</label>
            <input type="text" name="imageUrl" value={recipe.imageUrl} onChange={handleChange} />
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
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => setIngredients(ingredients.filter((_, i) => i !== index))}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary btn-add"
              onClick={() => setIngredients([...ingredients, ''])}
            >
              + Add Ingredient
            </button>
          </div>

          <div className="form-group">
            <label>Instructions (one step per line)</label>
            <textarea name="instructions" value={recipe.instructions} onChange={handleChange} required rows="8" />
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-submit">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditRecipe;
