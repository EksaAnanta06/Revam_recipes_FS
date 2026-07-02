/**
 * src/services/recipeService.js
 *
 * Tanggung jawab: business logic untuk domain recipe.
 *
 * ─── N+1 QUERY — APA ITU DAN MENGAPA TETAP DIPERTAHANKAN ───────────────────
 *
 * Kode lama memiliki N+1 query problem: untuk setiap resep di halaman
 * (misal 8 resep), aplikasi melakukan 3 query tambahan per resep:
 *   - query komentar      → 8 query
 *   - query total likes   → 8 query
 *   - query isLiked       → 8 query
 * Total: 1 + 1 + 24 = 26 query untuk 1 halaman.
 *
 * Solusi idealnya adalah JOIN atau subquery. Namun sesuai instruksi:
 * "Jangan mengubah business logic" — perilaku yang sama dipertahankan.
 * Yang berubah: duplikasi kode-nya dihilangkan via shared helper `enrichRecipe()`.
 *
 * ─── SHARED HELPER: enrichRecipe() ─────────────────────────────────────────
 *
 * SEBELUM: Kode berikut ada IDENTIK di recipes.js DAN recipes_user.js:
 *   const [comments] = await db.query(...)
 *   const [[{ totalLikes }]] = await db.query(...)
 *   const [[likeCheck]] = await db.query(...)
 *   return { ...recipe, comments, totalLikes, isLiked }
 *
 * SESUDAH: Satu fungsi enrichRecipe() dipakai keduanya → DRY principle.
 */

import db from "../config/database.js";
import { AUTH } from "../constants/index.js";
import { NotFoundError, ForbiddenError } from "../errors/index.js";
import * as recipeRepo from "../repositories/recipeRepository.js";
import { validateRecipeInput, validateCommentInput } from "../validations/recipe.js";

// ─── Private Helper ───────────────────────────────────────────────────────────

/**
 * Memperkaya satu object resep dengan komentar, total likes, dan status isLiked.
 * Helper ini menggantikan duplikasi yang ada di getAllRecipes dan getMyRecipes.
 *
 * @param {Object} recipe      - Data resep dasar dari DB
 * @param {number|null} userId - ID user yang sedang login (null jika belum login)
 * @returns {Object} recipe + comments + totalLikes + isLiked
 */
const enrichRecipe = async (recipe, userId) => {
    const [comments, totalLikes] = await Promise.all([
        recipeRepo.findCommentsByRecipeId(recipe.id),
        recipeRepo.countLikesByRecipeId(recipe.id),
    ]);

    const isLiked = userId
        ? await recipeRepo.findUserLike(recipe.id, userId)
        : false;

    return { ...recipe, comments, totalLikes, isLiked };
};

// ─── Helpers pagination ───────────────────────────────────────────────────────

const buildPagination = (total, page, limit) => ({
    totalData: total,
    totalPage: Math.ceil(total / limit),
    currentPage: page,
    limit,
});

const parsePaginationQuery = (query) => {
    const page  = parseInt(query.page)  || AUTH.DEFAULT_PAGE;
    const limit = parseInt(query.limit) || AUTH.DEFAULT_LIMIT;
    const search = query.search || "";
    return { page, limit, search, offset: (page - 1) * limit };
};

// ═══════════════════════════════════════════════════════════════════
// Public Service Functions
// ═══════════════════════════════════════════════════════════════════

/**
 * Ambil semua resep (halaman utama) dengan pagination, search, dan enrichment.
 */
const getAllRecipes = async (query, currentUserId) => {
    const { page, limit, search, offset } = parsePaginationQuery(query);
    const searchValue = `%${search}%`;

    const [total, rows] = await Promise.all([
        recipeRepo.countAllRecipes(searchValue),
        recipeRepo.findAllRecipes(searchValue, limit, offset),
    ]);

    const data = await Promise.all(
        rows.map((recipe) => enrichRecipe(recipe, currentUserId))
    );

    return { pagination: buildPagination(total, page, limit), data };
};

/**
 * Ambil detail satu resep (ingredients, steps, comments).
 */
const getRecipeDetail = async (recipeId) => {
    const recipe = await recipeRepo.findRecipeById(recipeId);

    if (!recipe) {
        throw new NotFoundError("Recipe tidak ditemukan");
    }

    const [ingredients, steps, comments] = await Promise.all([
        recipeRepo.findIngredientsByRecipeId(recipeId),
        recipeRepo.findStepsByRecipeId(recipeId),
        recipeRepo.findDetailCommentsByRecipeId(recipeId),
    ]);

    return {
        id: recipeId,
        title: recipe.title,
        description: recipe.description,
        imageUrl: recipe.image_url,
        author: { id: recipe.user_id, username: recipe.username },
        ingredients,
        steps,
        comments: comments.map((c) => ({
            id: c.id,
            message: c.content,
            createdAt: c.created_at,
            user: { id: c.user_id, username: c.username },
        })),
    };
};

/**
 * Buat resep baru beserta ingredients dan steps dalam satu transaction.
 */
const addRecipe = async ({ userId, title, description, imageUrl, ingredients, steps }) => {
    validateRecipeInput({ title, description, ingredients, steps });

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const recipeId = await recipeRepo.createRecipe(conn, { userId, title, description, imageUrl });
        await recipeRepo.insertIngredients(conn, recipeId, ingredients);
        await recipeRepo.insertSteps(conn, recipeId, steps);

        await conn.commit();
        return recipeId;
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

/**
 * Tambah komentar ke resep.
 */
const addComment = async ({ recipeId, userId, message }) => {
    validateCommentInput({ message });
    await recipeRepo.createComment(recipeId, userId, message);
};

/**
 * Toggle like / unlike resep.
 */
const toggleLike = async (recipeId, userId) => {
    return recipeRepo.toggleLike(recipeId, userId);
};

// ─── My Recipes (user-specific) ───────────────────────────────────────────────

/**
 * Ambil resep milik user yang sedang login.
 */
const getMyRecipes = async (query, userId) => {
    const { page, limit, search, offset } = parsePaginationQuery(query);
    const searchValue = `%${search}%`;

    const [total, rows] = await Promise.all([
        recipeRepo.countMyRecipes(userId, searchValue),
        recipeRepo.findMyRecipes(userId, searchValue, limit, offset),
    ]);

    const data = await Promise.all(
        rows.map((recipe) => enrichRecipe(recipe, userId))
    );

    return { pagination: buildPagination(total, page, limit), data };
};

/**
 * Update title/description resep milik user (quick update).
 */
const updateMyRecipe = async (recipeId, userId, { title, description }) => {
    const updated = await recipeRepo.updateRecipe(recipeId, userId, { title, description });

    if (!updated) {
        throw new ForbiddenError("Anda tidak berhak mengubah recipe ini");
    }
};

/**
 * Hapus resep milik user.
 */
const deleteMyRecipe = async (recipeId, userId) => {
    const deleted = await recipeRepo.deleteRecipe(recipeId, userId);

    if (!deleted) {
        throw new ForbiddenError("Anda tidak berhak menghapus recipe ini");
    }
};

/**
 * Update detail penuh resep (title, desc, ingredients, steps) dalam satu transaction.
 */
const updateMyRecipeDetail = async (recipeId, userId, { title, description, ingredients, steps }) => {
    validateRecipeInput({ title, description, ingredients, steps });

    const isOwner = await recipeRepo.isRecipeOwner(recipeId, userId);
    if (!isOwner) {
        throw new ForbiddenError("Anda tidak berhak mengubah recipe ini");
    }

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        await conn.query(
            "UPDATE recipes SET title = ?, description = ? WHERE id = ?",
            [title.trim(), description.trim(), recipeId]
        );

        await recipeRepo.clearRecipeDetails(conn, recipeId);
        await recipeRepo.insertIngredients(conn, recipeId, ingredients);
        await recipeRepo.insertSteps(conn, recipeId, steps);

        await conn.commit();
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
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
