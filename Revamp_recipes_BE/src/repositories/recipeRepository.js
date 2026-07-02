/**
 * src/repositories/recipeRepository.js
 *
 * Tanggung jawab: SEMUA operasi database untuk domain recipe.
 *
 * ─── DUPLIKASI YANG DIHILANGKAN ─────────────────────────────────────────────
 *
 * Sebelum refactor, kode berikut IDENTIK di recipes.js DAN recipes_user.js:
 *
 * 1. Query komentar per resep          → findCommentsByRecipeId()
 * 2. Query total likes per resep       → countLikesByRecipeId()
 * 3. Query cek isLiked per user        → findUserLike()
 * 4. Query insert ingredients          → insertIngredients()  [via conn]
 * 5. Query insert steps                → insertSteps()        [via conn]
 *
 * Sekarang semua ada di satu tempat — ubah sekali, berlaku di mana-mana.
 *
 * ─── CATATAN ARSITEKTUR ──────────────────────────────────────────────────────
 *
 * Beberapa fungsi menerima parameter `conn` (DB connection) opsional.
 * Ini untuk mendukung DB transaction — jika `conn` diberikan, query
 * berjalan di dalam transaction yang sama; jika tidak, pakai pool biasa.
 */

import db from "../config/database.js";

// ═══════════════════════════════════════════════════════════════════
// READ — Queries untuk mengambil data
// ═══════════════════════════════════════════════════════════════════

/**
 * Hitung total resep yang cocok dengan search (untuk semua user).
 */
const countAllRecipes = async (searchValue) => {
    const [[{ total }]] = await db.query(
        `SELECT COUNT(*) AS total
         FROM recipes r
         JOIN users u ON r.user_id = u.id
         WHERE r.title LIKE ? OR r.description LIKE ? OR u.username LIKE ?`,
        [searchValue, searchValue, searchValue]
    );
    return total;
};

/**
 * Ambil daftar resep dengan pagination dan search (untuk semua user).
 */
const findAllRecipes = async (searchValue, limit, offset) => {
    const [rows] = await db.query(
        `SELECT
            r.id, r.title, r.description, r.created_at, r.image_url,
            u.id AS user_id, u.username
         FROM recipes r
         JOIN users u ON r.user_id = u.id
         WHERE r.title LIKE ? OR r.description LIKE ? OR u.username LIKE ?
         ORDER BY r.created_at DESC
         LIMIT ? OFFSET ?`,
        [searchValue, searchValue, searchValue, limit, offset]
    );
    return rows;
};

/**
 * Hitung total resep milik satu user (untuk halaman My Recipes).
 */
const countMyRecipes = async (userId, searchValue) => {
    const [[{ total }]] = await db.query(
        `SELECT COUNT(*) AS total
         FROM recipes
         WHERE user_id = ?
         AND (title LIKE ? OR description LIKE ?)`,
        [userId, searchValue, searchValue]
    );
    return total;
};

/**
 * Ambil daftar resep milik satu user dengan pagination dan search.
 */
const findMyRecipes = async (userId, searchValue, limit, offset) => {
    const [rows] = await db.query(
        `SELECT
            r.id, r.title, r.description, r.created_at, r.image_url,
            u.id AS user_id, u.username
         FROM recipes r
         JOIN users u ON r.user_id = u.id
         WHERE r.user_id = ?
         AND (r.title LIKE ? OR r.description LIKE ?)
         ORDER BY r.created_at DESC
         LIMIT ? OFFSET ?`,
        [userId, searchValue, searchValue, limit, offset]
    );
    return rows;
};

/**
 * Ambil satu resep beserta author-nya berdasarkan ID.
 * @returns {Object|null}
 */
const findRecipeById = async (recipeId) => {
    const [rows] = await db.query(
        `SELECT r.id, r.title, r.image_url, r.description,
                u.id AS user_id, u.username
         FROM recipes r
         JOIN users u ON r.user_id = u.id
         WHERE r.id = ?`,
        [recipeId]
    );
    return rows[0] ?? null;
};

/**
 * Cek kepemilikan resep — apakah recipeId dimiliki userId.
 * @returns {boolean}
 */
const isRecipeOwner = async (recipeId, userId) => {
    const [rows] = await db.query(
        "SELECT id FROM recipes WHERE id = ? AND user_id = ?",
        [recipeId, userId]
    );
    return rows.length > 0;
};

/**
 * Ambil komentar beserta username pembuat untuk satu resep.
 * (Digunakan di getAllRecipes DAN getMyRecipes — sebelumnya duplikat)
 */
const findCommentsByRecipeId = async (recipeId) => {
    const [rows] = await db.query(
        `SELECT c.id, c.content, c.created_at, u.username
         FROM comments c
         JOIN users u ON c.user_id = u.id
         WHERE c.recipe_id = ?`,
        [recipeId]
    );
    return rows;
};

/**
 * Ambil komentar detail (dengan user_id) untuk halaman detail resep.
 */
const findDetailCommentsByRecipeId = async (recipeId) => {
    const [rows] = await db.query(
        `SELECT c.id, c.content, c.created_at, u.id AS user_id, u.username
         FROM comments c
         JOIN users u ON c.user_id = u.id
         WHERE c.recipe_id = ?
         ORDER BY c.id DESC`,
        [recipeId]
    );
    return rows;
};

/**
 * Hitung total likes untuk satu resep.
 * (Digunakan di getAllRecipes DAN getMyRecipes — sebelumnya duplikat)
 */
const countLikesByRecipeId = async (recipeId) => {
    const [[{ totalLikes }]] = await db.query(
        "SELECT COUNT(*) AS totalLikes FROM recipe_likes WHERE recipe_id = ?",
        [recipeId]
    );
    return totalLikes || 0;
};

/**
 * Cek apakah seorang user sudah menyukai resep tertentu.
 * (Digunakan di getAllRecipes DAN getMyRecipes — sebelumnya duplikat)
 * @returns {boolean}
 */
const findUserLike = async (recipeId, userId) => {
    const [[like]] = await db.query(
        "SELECT id FROM recipe_likes WHERE recipe_id = ? AND user_id = ?",
        [recipeId, userId]
    );
    return !!like;
};

/**
 * Ambil ingredients untuk satu resep.
 */
const findIngredientsByRecipeId = async (recipeId) => {
    const [rows] = await db.query(
        "SELECT id, name, quantity FROM ingredients WHERE recipe_id = ?",
        [recipeId]
    );
    return rows;
};

/**
 * Ambil steps untuk satu resep, diurutkan naik.
 */
const findStepsByRecipeId = async (recipeId) => {
    const [rows] = await db.query(
        "SELECT step_order, instruction FROM steps WHERE recipe_id = ? ORDER BY step_order ASC",
        [recipeId]
    );
    return rows;
};

// ═══════════════════════════════════════════════════════════════════
// WRITE — Queries untuk mengubah data (dengan dukungan transaction)
// ═══════════════════════════════════════════════════════════════════

/**
 * Buat resep baru (parent record).
 * @param {Object} conn - DB connection dari transaction
 * @returns {number} insertId resep baru
 */
const createRecipe = async (conn, { userId, title, description, imageUrl }) => {
    const [result] = await conn.query(
        "INSERT INTO recipes (user_id, title, description, image_url) VALUES (?, ?, ?, ?)",
        [userId, title.trim(), description.trim(), imageUrl]
    );
    return result.insertId;
};

/**
 * Insert banyak ingredients sekaligus untuk satu resep.
 * (Digunakan di addRecipe DAN updateMyRecipeDetail — sebelumnya duplikat)
 * @param {Object} conn - DB connection dari transaction
 */
const insertIngredients = async (conn, recipeId, ingredients) => {
    for (const item of ingredients) {
        await conn.query(
            "INSERT INTO ingredients (recipe_id, name, quantity) VALUES (?, ?, ?)",
            [recipeId, item.name.trim(), item.quantity || null]
        );
    }
};

/**
 * Insert banyak steps sekaligus untuk satu resep.
 * (Digunakan di addRecipe DAN updateMyRecipeDetail — sebelumnya duplikat)
 * @param {Object} conn - DB connection dari transaction
 */
const insertSteps = async (conn, recipeId, steps) => {
    for (const step of steps) {
        await conn.query(
            "INSERT INTO steps (recipe_id, step_order, instruction) VALUES (?, ?, ?)",
            [recipeId, step.step_order, step.instruction.trim()]
        );
    }
};

/**
 * Tambah komentar baru ke resep.
 */
const createComment = async (recipeId, userId, content) => {
    await db.query(
        "INSERT INTO comments (recipe_id, user_id, content) VALUES (?, ?, ?)",
        [recipeId, userId, content.trim()]
    );
};

/**
 * Toggle like: insert jika belum ada, delete jika sudah ada.
 * @returns {{ isLiked: boolean, message: string }}
 */
const toggleLike = async (recipeId, userId) => {
    const isCurrentlyLiked = await findUserLike(recipeId, userId);

    if (isCurrentlyLiked) {
        await db.query(
            "DELETE FROM recipe_likes WHERE user_id = ? AND recipe_id = ?",
            [userId, recipeId]
        );
        return { isLiked: false, message: "Like berhasil dihapus (Unlike)" };
    }

    await db.query(
        "INSERT INTO recipe_likes (user_id, recipe_id) VALUES (?, ?)",
        [userId, recipeId]
    );
    return { isLiked: true, message: "Resep berhasil disukai (Like)" };
};

/**
 * Update title dan description resep.
 * @returns {boolean} true jika ada baris yang terupdate
 */
const updateRecipe = async (recipeId, userId, { title, description }) => {
    const [result] = await db.query(
        "UPDATE recipes SET title = ?, description = ? WHERE id = ? AND user_id = ?",
        [title, description, recipeId, userId]
    );
    return result.affectedRows > 0;
};

/**
 * Hapus resep milik user (beserta cascade delete ke ingredients, steps, comments via FK).
 * @returns {boolean} true jika ada baris yang terhapus
 */
const deleteRecipe = async (recipeId, userId) => {
    const [result] = await db.query(
        "DELETE FROM recipes WHERE id = ? AND user_id = ?",
        [recipeId, userId]
    );
    return result.affectedRows > 0;
};

/**
 * Hapus semua ingredients dan steps lama (untuk replace saat update detail).
 * @param {Object} conn - DB connection dari transaction
 */
const clearRecipeDetails = async (conn, recipeId) => {
    await conn.query("DELETE FROM ingredients WHERE recipe_id = ?", [recipeId]);
    await conn.query("DELETE FROM steps WHERE recipe_id = ?", [recipeId]);
};

export {
    // Read
    countAllRecipes,
    findAllRecipes,
    countMyRecipes,
    findMyRecipes,
    findRecipeById,
    isRecipeOwner,
    findCommentsByRecipeId,
    findDetailCommentsByRecipeId,
    countLikesByRecipeId,
    findUserLike,
    findIngredientsByRecipeId,
    findStepsByRecipeId,
    // Write
    createRecipe,
    insertIngredients,
    insertSteps,
    createComment,
    toggleLike,
    updateRecipe,
    deleteRecipe,
    clearRecipeDetails,
};
