import React, { useState, useEffect, useContext, useMemo } from 'react';
import api from '../utils/api';
import RecipeCard from '../components/RecipeCard';
import { AuthContext } from '../context/AuthContext';
import './Home.css';

const CATEGORIES = ['All', 'Breakfast', 'Main Course', 'Snack', 'Dessert', 'Drink'];

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipeIds, setSavedRecipeIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [category, setCategory] = useState('All');
  const { user } = useContext(AuthContext);

  const fetchRecipes = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/recipes');
      setRecipes(data);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError(
        'Could not load recipes. The server may be waking up, so please try again in a few seconds.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    const fetchSaved = async () => {
      if (!user) {
        setSavedRecipeIds([]);
        return;
      }
      try {
        const { data } = await api.get('/recipes/saved');
        setSavedRecipeIds(data.map((recipe) => recipe._id));
      } catch (err) {
        console.error('Error fetching saved recipes:', err);
      }
    };
    fetchSaved();
  }, [user]);

  const handleSaveToggle = async (recipeId, isSaved) => {
    if (!user) return;

    try {
      if (isSaved) {
        await api.post(`/recipes/${recipeId}/unsave`);
        setSavedRecipeIds(savedRecipeIds.filter((id) => id !== recipeId));
      } else {
        await api.post(`/recipes/${recipeId}/save`);
        setSavedRecipeIds([...savedRecipeIds, recipeId]);
      }
    } catch (err) {
      console.error('Error toggling save status:', err);
    }
  };

  const visibleRecipes = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = recipes.filter((r) => {
      if (category !== 'All' && (r.category || 'Other') !== category) return false;
      if (!term) return true;
      return (
        (r.title || '').toLowerCase().includes(term) ||
        (r.description || '').toLowerCase().includes(term) ||
        (r.ingredients || []).some((i) => i.toLowerCase().includes(term))
      );
    });

    const sorted = [...filtered];
    if (sortBy === 'az') {
      sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (sortBy === 'oldest') {
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return sorted;
  }, [recipes, search, sortBy, category]);

  if (loading) {
    return (
      <div className="loading">
        Loading recipes...
        <p className="loading-note">
          The first load can take up to a minute while the server wakes up.
        </p>
      </div>
    );
  }

  return (
    <div className="home-container animate-fade-in">
      <header className="home-header">
        <h1 className="page-title">Discover Delicious Recipes</h1>
        <p className="home-subtitle">
          Find and share the best recipes from around the world.
        </p>
      </header>

      {error ? (
        <div className="error-box">
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchRecipes}>
            Try again
          </button>
        </div>
      ) : (
        <>
          <div className="home-toolbar">
            <input
              type="text"
              className="search-input"
              placeholder="Search by recipe, ingredient or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="az">A to Z</option>
            </select>
          </div>

          <div className="category-chips">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`chip ${category === c ? 'chip-active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

                   <p className="results-count">
            {visibleRecipes.length} recipe{visibleRecipes.length === 1 ? '' : 's'}
            {search.trim() ? ` for "${search.trim()}"` : ''}
            {(search.trim() || category !== 'All') && (
              <button
                className="clear-btn"
                onClick={() => {
                  setSearch('');
                  setCategory('All');
                }}
              >
                Clear filters
              </button>
            )}
          </p>

          <div className="recipes-grid">
            {visibleRecipes.length > 0 ? (
              visibleRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  isSaved={savedRecipeIds.includes(recipe._id)}
                  onSaveToggle={handleSaveToggle}
                />
              ))
            ) : (
              <div className="no-recipes">
                {recipes.length === 0
                  ? 'No recipes yet. Be the first to add one!'
                  : 'No recipes match your search. Try a different word or category.'}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
