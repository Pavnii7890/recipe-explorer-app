const express = require('express');
const router = express.Router();
const {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  saveRecipe,
  unsaveRecipe,
  getSavedRecipes,
} = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getRecipes).post(protect, createRecipe);
router.route('/saved').get(protect, getSavedRecipes);
router
  .route('/:id')
  .get(getRecipeById)
  .put(protect, updateRecipe)
  .delete(protect, deleteRecipe);
router.route('/:id/save').post(protect, saveRecipe);
router.route('/:id/unsave').post(protect, unsaveRecipe);

module.exports = router;
