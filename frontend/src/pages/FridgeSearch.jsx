import React, { useState, useEffect, useContext, useMemo } from 'react';
import api from '../utils/api';
import RecipeCard from '../components/RecipeCard';
import { AuthContext } from '../context/AuthContext';
import './Home.css';
import './FridgeSearch.css';

const STAPLES = ['salt', 'oil', 'water', 'pepper', 'sugar'];
const SUGGESTIONS = ['chicken', 'paneer', 'tomato', 'potato', 'rice', 'egg', 'onion'];

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const hasWord = (line, term) =>
  new RegExp(`\\b${escapeRegex(term)}`, 'i').test(line);

const FridgeSearch = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [input, setInput] = useState('');
  const [terms, setTerms] = useState([]);
  const [assumeStaples, setAssumeStaples] = useState(true);
  const [savedRecipeIds, setSavedRecipeIds] = useState([]);
  const { user } = useContext(AuthContext);

  const loadRecipes = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/recipes');
      setRecipes(data);
    } catch (err) {
      console.error(err);
      setError('Could not load recipes. The server may be waking up, so please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  useEffect(() => {
    const loadSaved = async () => {
      if (!user) {
        setSavedRecipeIds([]);
        return;
      }
      try {
        const { data } = await api.get('/recipes/saved');
        setSavedRecipeIds(data.map((r) => r._id));
      } catch (err) {
        console.error(err);
      }
    };
    loadSaved();
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
      console.error(err);
    }
  };

  const addTerms = (raw) => {
    const incoming = raw
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    if (incoming.length === 0) return;
    setTerms((prev) => [...new Set([...prev, ...incoming])]);
    setInput('');
  };

  const removeTerm = (term) => setTerms(terms.filter((t) => t !== term));

  const results = useMemo(() => {
    if (terms.length === 0) return [];

    return recipes
      .map((recipe) => {
        const lines = recipe.ingredients || [];
        const needed = assumeStaples
          ? lines.filter((line) => !STAPLES.some((s) => hasWord(line, s)))
          : lines;
        const matched = needed.filter((line) => terms.some((t) => hasWord(line, t)));
        const missing = needed.filter((line) => !terms.some((t) => hasWord(line, t)));
        const percent = needed.length
          ? Math.round((matched.length / needed.length) * 100)
          : 0;
        return { recipe, matched, missing, percent };
      })
      .filter((r) => r.matched.length > 0)
      .sort((a, b) => b.percent - a.percent || b.matched.length - a.matched.length);
  }, [recipes, terms, assumeStaples]);

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
        <h1 className="page-title">What can I cook?</h1>
        <p className="home-subtitle">
          Enter the ingredients you have and we will rank recipes by how much you already have.
        </p>
      </header>

      {error ? (
        <div className="error-box">
          <p>{error}</p>
          <button className="retry-btn" onClick={loadRecipes}>
            Try again
          </button>
        </div>
      ) : (
        <>
          <div className="home-toolbar">
            <input
              type="text"
              className="search-input"
              placeholder="Type an ingredient and press Enter (e.g. paneer, tomato)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addTerms(input);
              }}
            />
            <button className="retry-btn fridge-add" onClick={() => addTerms(input)}>
              Add
            </button>
          </div>

          <div className="category-chips">
            {SUGGESTIONS.map((s) => (
              <button key={s} className="chip" onClick={() => addTerms(s)}>
                + {s}
              </button>
            ))}
          </div>

          {terms.length > 0 && (
            <div className="category-chips">
              {terms.map((t) => (
                <button key={t} className="chip chip-active" onClick={() => removeTerm(t)}>
                  {t} ✕
                </button>
              ))}
              <button className="clear-btn" onClick={() => setTerms([])}>
                Clear all
              </button>
            </div>
          )}

          <label className="staples-toggle">
            <input
              type="checkbox"
              checked={assumeStaples}
              onChange={(e) => setAssumeStaples(e.target.checked)}
            />
            I already have basics (salt, oil, water, pepper, sugar)
          </label>

          {terms.length === 0 ? (
            <p className="results-count">Add a few ingredients to see matching recipes.</p>
          ) : (
            <p className="results-count">
              {results.length} recipe{results.length === 1 ? '' : 's'} you can make or nearly make
            </p>
          )}

          <div className="recipes-grid">
            {results.map(({ recipe, matched, missing, percent }) => (
              <div key={recipe._id} className="fridge-result">
                <RecipeCard
                  recipe={recipe}
                  isSaved={savedRecipeIds.includes(recipe._id)}
                  onSaveToggle={handleSaveToggle}
                />
                <div className="match-info">
                  <div className="match-bar">
                    <div className="match-fill" style={{ width: `${percent}%` }} />
                  </div>
                  <p className="match-text">
                    <strong>{percent}% match</strong> · you have {matched.length} of{' '}
                    {matched.length + missing.length} ingredients
                  </p>
                  {missing.length > 0 ? (
                    <p className="match-missing">
                      Missing: {missing.slice(0, 4).join('; ')}
                      {missing.length > 4 ? ` +${missing.length - 4} more` : ''}
                    </p>
                  ) : (
                    <p className="match-ready">You can cook this right now!</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FridgeSearch;
