import db from "../config/connect.js";

const getMyRecipes = async (req, res) => {
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const search = req.query.search || "";

    const offset = (page - 1) * limit;
    const searchValue = `%${search}%`;

    try {
        // Hitung total data
        const [[{ total }]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM recipes
            WHERE user_id = ?
            AND (
                title LIKE ?
                OR description LIKE ?
            )
        `, [userId, searchValue, searchValue]);

        // Ambil resep user
        const [rows] = await db.query(`
            SELECT
                r.id,
                r.title,
                r.description,
                r.created_at,
                r.image_url,
                u.id AS user_id,
                u.username
            FROM recipes r
            JOIN users u ON r.user_id = u.id
            WHERE r.user_id = ?
            AND (
                r.title LIKE ?
                OR r.description LIKE ?
            )
            ORDER BY r.created_at DESC
            LIMIT ? OFFSET ?
        `, [userId, searchValue, searchValue, limit, offset]);

        const finalData = await Promise.all(
            rows.map(async (recipe) => {

                // komentar
                const [comments] = await db.query(`
                    SELECT
                        c.id,
                        c.content,
                        c.created_at,
                        u.username
                    FROM comments c
                    JOIN users u ON c.user_id = u.id
                    WHERE c.recipe_id = ?
                `, [recipe.id]);

                // total like
                const [[{ totalLikes }]] = await db.query(`
                    SELECT COUNT(*) AS totalLikes
                    FROM recipe_likes
                    WHERE recipe_id = ?
                `, [recipe.id]);

                // cek like user
                const [[likeCheck]] = await db.query(`
                    SELECT id
                    FROM recipe_likes
                    WHERE recipe_id = ?
                    AND user_id = ?
                `, [recipe.id, userId]);

                return {
                    ...recipe,
                    comments,
                    totalLikes: totalLikes || 0,
                    isLiked: !!likeCheck
                };
            })
        );

        return res.status(200).json({
            success: true,
            message: "resep milik user berhasil ditampilkan",
            pagination: {
                totalData: total,
                totalPage: Math.ceil(total / limit),
                currentPage: page,
                limit
            },
            data: finalData
        });

    } catch (err) {
        console.error("getMyRecipes error:", err);

        return res.status(500).json({
            success: false,
            message: "server error",
            data: null
        });
    }
};

const updateMyRecipe = async (req, res) => {
    const userId = req.user.id;
    const recipeId = req.params.id;
    const { title, description } = req.body;

    try {
        const [result] = await db.query(
            `UPDATE recipes
             SET title = ?, description = ?
             WHERE id = ? AND user_id = ?`,
            [title, description, recipeId, userId]
        )

        if (result.affectedRows === 0) {
            return res.status(403).json({
                message: "Anda tidak berhak merubah recipe ini"
            })
        }

        res.json({ success: true, message: "Recipe berhasil update" })
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

const deleteMyRecipe = async (req, res) => {
    const userId = req.user.id;
    const recipeId = req.params.id;

    try {
        const [result] = await db.query(
            "DELETE FROM recipes WHERE id = ? AND user_id = ?",
            [recipeId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(403).json({
                message: "Anda tidak berhak menghapus recipe ini"
            })
        }

        res.json({
            success: true,
            message: "recipe berhasil dihapus"
        })
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

const updateMyRecipeDetail = async (req, res) => {
    const userId = req.user.id;
    const recipeId = req.params.id;
    const { title, description, ingredients, steps } = req.body;

    let conn;

    try {

        if (!title || !description) {
            return res.status(400).json({
                message: "title dan description wajib diisi"
            })
        }

        if (!Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({
                message: "ingredients minilam 1"
            })
        }

        conn = await db.getConnection();
        await conn.beginTransaction();

        // cek pemilik
        const [recipes] = await conn.query(
            "SELECT id FROM recipes WHERE id = ? AND user_id = ?",
            [recipeId, userId]
        );

        if (recipes.length === 0) {
            await conn.rollback();
            return res.status(403).json({
                message: "Anda tidak berhak mengubah recipe ini"
            })
        }

        // update recipe utama
        await conn.query(
            "UPDATE recipes SET title = ?, description = ? WHERE id = ?",
            [title.trim(), description.trim(), recipeId]
        );

        // hapus data lama
        await conn.query("DELETE FROM ingredients WHERE recipe_id = ?", [recipeId]);
        await conn.query("DELETE FROM steps WHERE recipe_id = ?", [recipeId]);

        // insert ingredients baru
        for (const item of ingredients) {
            if (!item.name) {
                throw new Error("ingredients tidak boleh kosong");
            }

            await conn.query(
                "INSERT INTO ingredients (recipe_id, name, quantity) VALUES (?, ?, ?)",
                [recipeId, item.name.trim(), item.quantity || null]
            )
        }

        // insert steps baru
        for (const step of steps) {
            if (!step.instruction || !step.step_order) {
                throw new Error("step tidak valid");
            }

            await conn.query(
                "INSERT INTO steps (recipe_id, step_order, instruction) VALUES (?, ?, ?)",
                [recipeId, step.step_order, step.instruction.trim()]
            );
        }

        // commit
        await conn.commit();

        res.json({
            success: true,
            message: "recipe berhasil diupdate"
        });

    } catch (err) {
        if (conn) await conn.rollback();

        console.log("updateMyRecipe error:", err.message);

        res.status(500).json({
            message: err.message || "Gagal update recipe"
        });
    } finally {
        if (conn) conn.release();
    }
}

export { getMyRecipes, updateMyRecipe, deleteMyRecipe, updateMyRecipeDetail }