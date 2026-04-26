import express from "express";
import { getAllRecipes, addRecipe, addComment, detailRecipe, toggleLike } from "../controllers/recipes.js";
import { getMyRecipes, updateMyRecipe, deleteMyRecipe, updateMyRecipeDetail } from "../controllers/recipes_user.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";
import { uploadRecipeImage } from "../Middleware/imgMiddleware.js";
import { optionalAuth } from "../Middleware/optionalAuth.js";

const router = express.Router()

// Untuk Halaman Utama
router.get("/recipes", optionalAuth, getAllRecipes); //done
router.get("/recipe/:id", detailRecipe); // done
router.post("/addRecipe", authMiddleware, uploadRecipeImage.single("image"), addRecipe); //done
router.post("/recipes/:id/comments", authMiddleware, addComment); //done
router.post("/recipes/:id/like", authMiddleware, toggleLike); //done

// Untuk Halaman Recipe User
router.get("/myRecipes", authMiddleware, getMyRecipes);
router.put("/myRecipe/:id", authMiddleware, updateMyRecipe);
router.put("/myRecipeDetail/:id", authMiddleware, updateMyRecipeDetail);
router.delete("/myRecipe/:id", authMiddleware, deleteMyRecipe);

export default router