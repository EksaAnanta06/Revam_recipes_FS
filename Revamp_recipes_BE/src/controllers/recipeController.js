/**
 * src/controllers/recipeController.js
 *
 * Tanggung jawab: menerima HTTP request, mendelegasikan ke recipeService,
 * mengirimkan HTTP response.
 *
 * Bandingkan dengan sebelumnya:
 * - recipes.js      (342 baris) + recipes_user.js (250 baris) = 592 baris
 * - Controller baru ini: ~100 baris
 *
 * Semua fungsi mengikuti pola yang sama:
 *   1. Ekstrak data dari req
 *   2. Panggil service
 *   3. Kirim response sukses
 *   4. Tangkap error → next(err) → errorHandler
 */

import * as recipeService from "../services/recipeService.js";
import { HTTP } from "../constants/index.js";

// ─── Public Routes ────────────────────────────────────────────────────────────

const getAllRecipes = async (req, res, next) => {
    try {
        const currentUserId = req.user?.id ?? null;
        const result = await recipeService.getAllRecipes(req.query, currentUserId);
        return res.status(HTTP.OK).json({
            success: true,
            message: "Resep berhasil ditampilkan",
            ...result,
        });
    } catch (err) {
        next(err);
    }
};

const getRecipeDetail = async (req, res, next) => {
    try {
        const data = await recipeService.getRecipeDetail(req.params.id);
        return res.status(HTTP.OK).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

const addRecipe = async (req, res, next) => {
    try {
        const ingredients = JSON.parse(req.body.ingredients || "[]");
        const steps       = JSON.parse(req.body.steps       || "[]");
        const imageUrl    = req.file ? `/uploads/recipes/${req.file.filename}` : null;

        const recipeId = await recipeService.addRecipe({
            userId: req.user.id,
            title: req.body.title,
            description: req.body.description,
            imageUrl,
            ingredients,
            steps,
        });

        return res.status(HTTP.CREATED).json({
            success: true,
            message: "Recipe berhasil dibuat",
            data: { recipeId },
        });
    } catch (err) {
        next(err);
    }
};

const addComment = async (req, res, next) => {
    try {
        await recipeService.addComment({
            recipeId: req.params.id,
            userId: req.user.id,
            message: req.body.message,
        });
        return res.status(HTTP.CREATED).json({
            success: true,
            message: "Komentar berhasil ditambahkan",
        });
    } catch (err) {
        next(err);
    }
};

const toggleLike = async (req, res, next) => {
    try {
        const result = await recipeService.toggleLike(req.params.id, req.user.id);
        return res.status(HTTP.OK).json({ success: true, ...result });
    } catch (err) {
        next(err);
    }
};

// ─── Protected Routes (My Recipes) ───────────────────────────────────────────

const getMyRecipes = async (req, res, next) => {
    try {
        const result = await recipeService.getMyRecipes(req.query, req.user.id);
        return res.status(HTTP.OK).json({
            success: true,
            message: "Resep milik Anda berhasil ditampilkan",
            ...result,
        });
    } catch (err) {
        next(err);
    }
};

const updateMyRecipe = async (req, res, next) => {
    try {
        await recipeService.updateMyRecipe(req.params.id, req.user.id, req.body);
        return res.status(HTTP.OK).json({
            success: true,
            message: "Recipe berhasil diupdate",
        });
    } catch (err) {
        next(err);
    }
};

const deleteMyRecipe = async (req, res, next) => {
    try {
        await recipeService.deleteMyRecipe(req.params.id, req.user.id);
        return res.status(HTTP.OK).json({
            success: true,
            message: "Recipe berhasil dihapus",
        });
    } catch (err) {
        next(err);
    }
};

const updateMyRecipeDetail = async (req, res, next) => {
    try {
        await recipeService.updateMyRecipeDetail(
            req.params.id,
            req.user.id,
            req.body
        );
        return res.status(HTTP.OK).json({
            success: true,
            message: "Recipe berhasil diupdate",
        });
    } catch (err) {
        next(err);
    }
};

export {
    getAllRecipes,
    getRecipeDetail,
    addRecipe,
    addComment,
    toggleLike,
    getMyRecipes,
    updateMyRecipe,
    deleteMyRecipe,
    updateMyRecipeDetail,
};
