/**
 * src/routes/recipe.js
 *
 * Tanggung jawab: URL mapping untuk domain recipe.
 *
 * Perubahan dari routes/recipes_routes.js lama:
 * - Import middleware dari src/middlewares/ (bukan Middleware/ lama)
 * - Komentar "done" dihapus
 * - Route dikelompokkan secara logis: Public → Protected → My Recipes
 */

import express from "express";
import auth from "../middlewares/auth.js";
import optionalAuth from "../middlewares/optionalAuth.js";
import { uploadRecipeImage } from "../middlewares/upload.js";
import {
    getAllRecipes,
    getRecipeDetail,
    addRecipe,
    addComment,
    toggleLike,
    getMyRecipes,
    updateMyRecipe,
    deleteMyRecipe,
    updateMyRecipeDetail,
} from "../controllers/recipeController.js";

const router = express.Router();

// ─── Public Routes ────────────────────────────────────────────────────────────
// optionalAuth: login tidak wajib, tapi jika ada token maka isLiked akan dicek
router.get("/recipes",      optionalAuth, getAllRecipes);
router.get("/recipe/:id",   getRecipeDetail);

// ─── Protected Routes (login wajib) ──────────────────────────────────────────
router.post("/addRecipe",              auth, uploadRecipeImage.single("image"), addRecipe);
router.post("/recipes/:id/comments",   auth, addComment);
router.post("/recipes/:id/like",       auth, toggleLike);

// ─── My Recipes Routes ────────────────────────────────────────────────────────
router.get("/myRecipes",            auth, getMyRecipes);
router.put("/myRecipe/:id",         auth, updateMyRecipe);
router.put("/myRecipeDetail/:id",   auth, updateMyRecipeDetail);
router.delete("/myRecipe/:id",      auth, deleteMyRecipe);

export default router;
