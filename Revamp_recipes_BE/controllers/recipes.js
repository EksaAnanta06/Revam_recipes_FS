import db from "../config/connect.js";

const getAllRecipes = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;
    const searchValue = `%${search}%`;
    try {
        const [[{ total }]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM recipes r
            JOIN users u ON r.user_id = u.id
            WHERE r.title LIKE ? 
               OR r.description LIKE ?
               OR u.username LIKE ?
        `, [searchValue, searchValue, searchValue]);

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
            WHERE r.title LIKE ? 
               OR r.description LIKE ?
               OR u.username LIKE ?
            ORDER BY r.created_at DESC
            LIMIT ? OFFSET ?
        `, [searchValue, searchValue, searchValue, limit, offset]);

        // Looping untuk ambil detail tambahan per resep
        const finalData = await Promise.all(rows.map(async (recipe) => {
            // 1. Ambil Data Komentar
            const [comments] = await db.query(`
                SELECT c.id, c.content, c.created_at, u.username 
                FROM comments c
                JOIN users u ON c.user_id = u.id
                WHERE c.recipe_id = ?
            `, [recipe.id]);

            // 2. Ambil Total Like
            const [[{ totalLikes }]] = await db.query(`
                SELECT COUNT(*) AS totalLikes FROM recipe_likes WHERE recipe_id = ?
            `, [recipe.id]);

            // 3. Cek apakah user yang lagi login sudah LIKE resep ini (Opsional)
            // Anggaplah lo simpan id user di req.user.id dari middleware auth
            const currentUserId = req.user ? req.user.id : null;
            let isLiked = false;
            if (currentUserId) {
                const [[likeCheck]] = await db.query(
                    `SELECT id FROM recipe_likes WHERE recipe_id = ? AND user_id = ?`,
                    [recipe.id, currentUserId]
                );
                isLiked = !!likeCheck;
            }

            return {
                ...recipe,
                comments,
                totalLikes: totalLikes || 0,
                isLiked: isLiked
            };
        }));

        return res.status(200).json({
            success: true,
            message: "resep berhasil ditampilkan",
            pagination: {
                totalData: total,
                totalPage: Math.ceil(total / limit),
                currentPage: page,
                limit,
            },
            data: finalData
        });

    } catch (err) {
        console.error("getAllRecipes error:", err);
        return res.status(500).json({
            success: false,
            message: "server error",
            data: null
        });
    }
}

const addRecipe = async (req, res) => {
    const { title, description } = req.body;
    const ingredients = JSON.parse(req.body.ingredients || "[]");
    const steps = JSON.parse(req.body.steps || "[]");
    const userId = req.user.id;
    const imageUrl = req.file ? `/uploads/recipes/${req.file.filename}` : null;

    let conn;

    try {

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "kolom input tidak boleh kosong"
            })
        }

        if (!Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({
                success: false,
                message: "ingredients minimal 1"
            })
        }

        if (!Array.isArray(steps) || steps.length === 0) {
            return res.status(400).json({
                success: false,
                message: "ingredients minimal 1"
            })
        }

        // ambil conection 
        conn = await db.getConnection();
        await conn.beginTransaction();

        // insert recipes PARENT
        const [recipeResult] = await conn.query(
            "INSERT INTO recipes (user_id, title, description, image_url) VALUES (?, ?, ?, ?)",
            [userId, title.trim(), description.trim(), imageUrl]
        )

        const recipeId = recipeResult.insertId;

        // insert ingredients
        for (const item of ingredients) {
            if (!item.name) {
                throw new Error("ingredients name tidak boleh kosong")
            }

            await conn.query(
                "INSERT INTO ingredients (recipe_id, name, quantity) VALUES (?, ?, ?)",
                [recipeId, item.name.trim(), item.quantity || null]
            )
        }

        // insert steps
        for (const step of steps) {
            if (!step.instruction || !step.step_order) {
                throw new Error("step tidak valid")
            }

            await conn.query(
                "INSERT INTO steps (recipe_id, step_order, instruction) VALUES (?, ?, ?)",
                [recipeId, step.step_order, step.instruction.trim()]
            )
        }

        await conn.commit();

        return res.status(201).json({
            success: true,
            message: "recipe berhasil dibuat",
            data: {
                recipeId
            }
        })

    } catch (err) {
        if (conn) await conn.rollback();
        console.log("addRecipe transaction error:", err.message);
        return res.status(500).json({
            success: false,
            message: err.message || "Gagal membuat recipe"
        });
    } finally {
        if (conn) conn.release();
    }
}

const addComment = async (req, res) => {
    const userId = req.user.id;
    const recipeId = req.params.id;
    const { message } = req.body;

    try {

        if (!message) {
            return res.status(400).json({
                message: "komentar tidak boleh kosong"
            });
        }

        await db.query(
            "INSERT INTO comments (recipe_id, user_id, content) VALUES (?, ?, ?)",
            [recipeId, userId, message.trim()]
        );

        res.status(201).json({
            success: true,
            message: "komentar berhail ditambahkan"
        });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

const detailRecipe = async (req, res) => {
    const recipeId = req.params.id;

    try {
        // recipe dan author
        const [recipes] = await db.query(`
            SELECT 
                r.id,
                r.title,
                r.image_url,
                r.description,
                u.id AS user_id,
                u.username
            FROM recipes r
            JOIN users u ON r.user_id = u.id
            WHERE r.id = ?`,
            [recipeId]);

        if (recipes.length === 0) {
            return res.status(404).json({
                success: false,
                message: "recipe tidak ditemukan"
            })
        }

        const recipe = recipes[0];

        // ambil ingredients
        const [ingredients] = await db.query(
            "SELECT id, name, quantity FROM ingredients WHERE recipe_id = ?",
            [recipeId]
        );

        // ambil steps
        const [steps] = await db.query(
            "SELECT step_order, instruction FROM steps WHERE recipe_id = ? ORDER BY step_order ASC",
            [recipeId]
        )

        // ambil comments dan user
        const [comments] = await db.query(`
            SELECT 
                c.id,
                c.content,
                c.created_at,
                u.id AS user_id,
                u.username
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.recipe_id = ?
            ORDER BY c.id DESC
        `, [recipeId]);

        return res.status(200).json({
            success: true,
            data: {
                id: recipeId,
                title: recipe.title,
                description: recipe.description,
                imageUrl: recipe.image_url,
                author: {
                    id: recipe.user_id,
                    username: recipe.username
                },
                ingredients,
                steps,
                comments: comments.map(c => ({
                    id: c.id,
                    message: c.content,
                    createdAt: c.created_at,
                    user: {
                        id: c.user_id,
                        username: c.username
                    }
                }))
            }
        })
    } catch (err) {
        console.log("getRecipeDetail: ", err);
        res.status(500).json({
            success: false,
            message: "server error"
        })
    }
}

const toggleLike = async (req, res) => {
    const recipeId = req.params.id || req.params.recipeId;
    const userId = req.user.id;      // Ambil ID user dari token/session

    try {
        // 1. Cek apakah user ini sudah pernah like resep ini
        const [existingLike] = await db.query(
            "SELECT * FROM recipe_likes WHERE user_id = ? AND recipe_id = ?",
            [userId, recipeId]
        );

        if (existingLike.length > 0) {
            // 2. Jika SUDAH ADA, maka UNLIKE (Delete)
            await db.query(
                "DELETE FROM recipe_likes WHERE user_id = ? AND recipe_id = ?",
                [userId, recipeId]
            );

            return res.status(200).json({
                success: true,
                message: "Like berhasil dihapus (Unlike)",
                isLiked: false
            });
        } else {
            // 3. Jika BELUM ADA, maka LIKE (Insert)
            await db.query(
                "INSERT INTO recipe_likes (user_id, recipe_id) VALUES (?, ?)",
                [userId, recipeId]
            );

            return res.status(200).json({
                success: true,
                message: "Resep berhasil disukai (Like)",
                isLiked: true
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Gagal memproses Like"
        });
    }
};

export { getAllRecipes, addRecipe, addComment, detailRecipe, toggleLike }