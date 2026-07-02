/**
 * src/validations/recipe.js
 *
 * Tanggung jawab: validasi input untuk semua operasi recipe.
 *
 * Sebelum refactor, validasi tersebar dan campur dengan logic di controller:
 * - addRecipe: cek title/desc + cek array ingredients + cek array steps
 * - updateMyRecipeDetail: validasi yang hampir identik diulang lagi
 *
 * Sekarang satu tempat, satu kebenaran, mudah diubah.
 */

import { BadRequestError } from "../errors/index.js";

/**
 * Validasi input untuk membuat atau mengupdate recipe.
 * Digunakan oleh addRecipe DAN updateMyRecipeDetail (menghilangkan duplikasi).
 *
 * @param {{ title, description, ingredients, steps }} data
 * @param {{ requireSteps }} options - steps opsional di beberapa operasi
 */
const validateRecipeInput = ({ title, description, ingredients, steps }, { requireSteps = true } = {}) => {
    if (!title || !description) {
        throw new BadRequestError("Title dan description wajib diisi");
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
        throw new BadRequestError("Ingredients minimal 1 item");
    }

    for (const item of ingredients) {
        if (!item.name) {
            throw new BadRequestError("Nama ingredient tidak boleh kosong");
        }
    }

    if (requireSteps) {
        if (!Array.isArray(steps) || steps.length === 0) {
            throw new BadRequestError("Steps minimal 1 item");
        }

        for (const step of steps) {
            if (!step.instruction || !step.step_order) {
                throw new BadRequestError("Setiap step wajib memiliki instruction dan step_order");
            }
        }
    }
};

/**
 * Validasi input untuk menambah komentar.
 */
const validateCommentInput = ({ message }) => {
    if (!message || !message.trim()) {
        throw new BadRequestError("Komentar tidak boleh kosong");
    }
};

export { validateRecipeInput, validateCommentInput };
