import { BASE_URL } from "../utils/constants";

export const getRecipesService = async ({ search = "", page = 1, limit = 8, isMyRecipes = false }) => {
    const params = new URLSearchParams({ search, page: String(page), limit: String(limit) });
    const token = localStorage.getItem("token");
    const endpoint = isMyRecipes ? `/api/myRecipes`: `/api/recipes`;
    

    const response = await fetch(`${BASE_URL}${endpoint}?${params}`, {
        headers: {
            Authorization: token ? `Bearer ${token}` : ""
        }
    });

    if (!response.ok) {
        throw new Error("Gagal mengambil data resep");
    }

    return response.json(); // Mengembalikan data hasil resolve json
};