/**
 * src/api/recipeApi.js
 *
 * Semua HTTP request untuk domain recipe.
 *
 * Dipindah dari Services/recipeService.jsx → api/recipeApi.js
 *
 * Alasan:
 * - Ekstensi .jsx tidak tepat — tidak ada JSX di file ini
 * - Folder "Services" (kapital) tidak konsisten dengan konvensi React
 * - Folder "api/" lebih eksplisit untuk file yang berisi HTTP calls
 *
 * Tidak ada perubahan pada logic — hanya pindah lokasi dan rename.
 */

import { BASE_URL } from "../constants/index.js";

/**
 * Ambil daftar resep dengan pagination dan search.
 * Mendukung halaman "Semua Resep" dan "Resep Saya" via flag isMyRecipes.
 */
export const getRecipesService = async ({ search = "", page = 1, limit = 8, isMyRecipes = false }) => {
    const params   = new URLSearchParams({ search, page: String(page), limit: String(limit) });
    const token    = localStorage.getItem("token");
    const endpoint = isMyRecipes ? "/api/myRecipes" : "/api/recipes";

    const response = await fetch(`${BASE_URL}${endpoint}?${params}`, {
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
        },
    });

    if (!response.ok) {
        throw new Error("Gagal mengambil data resep");
    }

    return response.json();
};
