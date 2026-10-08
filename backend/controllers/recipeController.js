const Recipe = require('../models/Recipe');
const User = require('../models/User');

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Public
const getRecipes = async (req, res) => {
  const recipes = await Recipe.find({}).populate('createdBy', 'username');
  res.json(recipes);
};

// @desc    Get recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
const getRecipeById = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).populate(
    'createdBy',
    'username'
  );

  if (recipe) {
    res.json(recipe);
  } else {
    res.status(404).json({ message: 'Recipe not found' });
  }
};

// @desc    Create a recipe
// @route   POST /api/recipes
// @access  Private
const createRecipe = async (req, res) => {
  const { title, description, ingredients, instructions, imageUrl, category} = req.body;

  const recipe = new Recipe({
    title,
    description,
    ingredients,
    instructions,
    imageUrl,
    category,
    createdBy: req.user._id,
  });

  const createdRecipe = await recipe.save();
  res.status(201).json(createdRecipe);
};

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
// @access  Private
const updateRecipe = async (req, res) => {
  const { title, description, ingredients, instructions, imageUrl, category } = req.body;

  const recipe = await Recipe.findById(req.params.id);

  if (recipe) {
    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'User not authorized' });
      return;
    }

    recipe.title = title || recipe.title;
    recipe.description = description || recipe.description;
    recipe.ingredients = ingredients || recipe.ingredients;
    recipe.instructions = instructions || recipe.instructions;
    recipe.imageUrl = imageUrl || recipe.imageUrl;
    recipe.category = category || recipe.category;
    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } else {
    res.status(404).json({ message: 'Recipe not found' });
  }
};

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
// @access  Private
const deleteRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (recipe) {
    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'User not authorized' });
      return;
    }

    await Recipe.deleteOne({ _id: req.params.id });
    res.json({ message: 'Recipe removed' });
  } else {
    res.status(404).json({ message: 'Recipe not found' });
  }
};

// @desc    Save recipe to favorites
// @route   POST /api/recipes/:id/save
// @access  Private
const saveRecipe = async (req, res) => {
  const user = await User.findById(req.user._id);
  const recipe = await Recipe.findById(req.params.id);

  if (user && recipe) {
    if (user.savedRecipes.includes(recipe._id)) {
      res.status(400).json({ message: 'Recipe already saved' });
      return;
    }

    user.savedRecipes.push(recipe._id);
    await user.save();
    res.json({ message: 'Recipe saved to favorites' });
  } else {
    res.status(404).json({ message: 'User or Recipe not found' });
  }
};

// @desc    Unsave recipe from favorites
// @route   POST /api/recipes/:id/unsave
// @access  Private
const unsaveRecipe = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.savedRecipes = user.savedRecipes.filter(
      (id) => id.toString() !== req.params.id.toString()
    );
    await user.save();
    res.json({ message: 'Recipe removed from favorites' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Get user's saved recipes
// @route   GET /api/recipes/saved
// @access  Private
const getSavedRecipes = async (req, res) => {
  const user = await User.findById(req.user._id).populate('savedRecipes');

  if (user) {
    res.json(user.savedRecipes);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  saveRecipe,
  unsaveRecipe,
  getSavedRecipes,
};
