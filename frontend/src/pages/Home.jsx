import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import RecipeCard from '../components/RecipeCard';
import { AuthContext } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipeIds, setSavedRecipeIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const { data } = await api.get('/recipes');
        setRecipes(data);
        
        if (user) {
          const savedData = await api.get('/recipes/saved');
          // savedData.data contains array of populated recipe objects, we need array of IDs
          const ids = savedData.data.map(recipe => recipe._id);
          setSavedRecipeIds(ids);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [user]);

  const handleSaveToggle = async (recipeId, isSaved) => {
    if (!user) return; // Only logged in users can save

    try {
      if (isSaved) {
        await api.post(`/recipes/${recipeId}/unsave`);
        setSavedRecipeIds(savedRecipeIds.filter(id => id !== recipeId));
      } else {
        await api.post(`/recipes/${recipeId}/save`);
        setSavedRecipeIds([...savedRecipeIds, recipeId]);
      }
    } catch (error) {
      console.error('Error toggling save status:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading recipes...</div>;
  }

  return (
    <div className="home-container animate-fade-in">
      <header className="home-header">
        <h1 className="page-title">Discover Delicious Recipes</h1>
        <p className="home-subtitle">Find and share the best recipes from around the world.</p>
      </header>

      <div className="recipes-grid">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard 
              key={recipe._id} 
              recipe={recipe} 
              isSaved={savedRecipeIds.includes(recipe._id)}
              onSaveToggle={handleSaveToggle}
            />
          ))
        ) : (
          <div className="no-recipes">
            No recipes found. Be the first to add one!
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
