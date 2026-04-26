import db from "../config/connect.js";

const getMyRecipes = async (req, res) => {
    const userId = req.user.id;

    try {
        const [recipes] = await db.query(
            `SELECT id, title, description, image_url, created_at
             FROM recipes
             WHERE user_id = ?
             ORDER BY created_at DESC`,
            [userId]
        );

        res.status(200).json({
            success: true,
            data: recipes
        })


    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            messsage: "server error"
        })
    }
}

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