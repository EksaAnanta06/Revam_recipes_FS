/**
 * src/hooks/useRecipe.jsx
 *
 * Custom hook untuk fetching resep dengan pagination, search, dan debounce.
 *
 * ─── BUG FIX ─────────────────────────────────────────────────────────────────
 * Sebelum: setRecipes(result || [])
 *   → menyimpan SELURUH response object { success, data, pagination } ke state
 *   → komponen bekerja karena akses via recipes.data, tapi state tidak akurat
 *
 * Sesudah: setRecipes(result)
 *   → tetap menyimpan seluruh response — ini yang benar karena DashboardLayout
 *     mengakses recipes.data DAN recipes.pagination. State shape-nya memang
 *     seluruh response object, bukan hanya array data-nya.
 *   → fallback `|| []` dihapus karena jika success=true, result pasti ada
 */

import { useState, useEffect, useCallback } from "react";
import { getRecipesService } from "../api/recipeApi.js";

export const useRecipes = ({ isMyRecipes = false } = {}) => {
    const [recipes, setRecipes]   = useState(null);
    const [loading, setLoading]   = useState(true);
    const [search,  setSearch]    = useState("");
    const [page,    setPage]      = useState(1);

    const fetchRecipes = useCallback(async (targetPage, targetSearch) => {
        setLoading(true);
        try {
            const result = await getRecipesService({
                search: targetSearch,
                page: targetPage,
                limit: 8,
                isMyRecipes,
            });

            if (result.success) {
                setRecipes(result);
            }
        } catch (error) {
            console.error("[useRecipes] Gagal mengambil resep:", error.message);
        } finally {
            setLoading(false);
        }
    }, [isMyRecipes]);

    // Debounce: tunggu 500ms setelah perubahan search atau page sebelum fetch
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchRecipes(page, search);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [page, search, fetchRecipes]);

    // Reset ke halaman 1 setiap kali user mengetik search baru
    const handleSearchChange = (value) => {
        setSearch(value);
        setPage(1);
    };

    return {
        recipes,
        loading,
        search,
        setSearch: handleSearchChange,
        setPage,
    };
};