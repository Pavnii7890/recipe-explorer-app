import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import RecipeCard from '../components/RecipeCard';
import { AuthContext } from '../context/AuthContext';
import './Home.css'; // Reusing Home styles for the grid

const Favorites = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchSavedRecipes = async () => {
      try {
        const { data } = await api.get('/recipes/saved');
        setSavedRecipes(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching saved recipes:', error);
        setLoading(false);
      }
    };

    fetchSavedRecipes();
  }, [user, navigate]);

  const handleSaveToggle = async (recipeId, isSaved) => {
    try {
      if (isSaved) {
        await api.post(`/recipes/${recipeId}/unsave`);
        // Remove from the list visually
        setSavedRecipes(savedRecipes.filter(recipe => recipe._id !== recipeId));
      } else {
        await api.post(`/recipes/${recipeId}/save`);
        // In a real app we might fetch the recipe and add it back, but
        // for favorites view, usually we just unsave and it disappears.
      }
    } catch (error) {
      console.error('Error toggling save status:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading your favorite recipes...</div>;
  }

  return (
    <div className="home-container animate-fade-in">
      <header className="home-header">
        <h1 className="page-title">Your Favorite Recipes</h1>
        <p className="home-subtitle">All the recipes you've saved for later.</p>
      </header>

      <div className="recipes-grid">
        {savedRecipes.length > 0 ? (
          savedRecipes.map((recipe) => (
            <RecipeCard 
              key={recipe._id} 
              recipe={recipe} 
              isSaved={true} // In this view, they are all saved initially
              onSaveToggle={handleSaveToggle}
            />
          ))
        ) : (
          <div className="no-recipes">
            You haven't saved any recipes yet. Explore the home page to find some!
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
