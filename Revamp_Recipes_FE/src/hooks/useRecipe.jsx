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

import { useState, useEffect, useCallback, useMemo } from "react";
import { getRecipesService } from "../api/recipeApi.js";

// Nilai sortBy yang valid — digunakan sebagai konstanta agar tidak typo
export const SORT_OPTIONS = {
    DEFAULT:       "default",       // Urutan dari server (terbaru)
    MOST_LIKES:    "most_likes",    // Terbanyak likes
    MOST_COMMENTS: "most_comments", // Terbanyak komentar
};

export const useRecipes = ({ isMyRecipes = false } = {}) => {
    const [recipes, setRecipes]   = useState(null);
    const [loading, setLoading]   = useState(true);
    const [search,  setSearch]    = useState("");
    const [page,    setPage]      = useState(1);
    const [sortBy,  setSortBy]    = useState(SORT_OPTIONS.DEFAULT);

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

    // Sort data di frontend — tidak perlu fetch ulang ke server
    // useMemo agar tidak re-sort setiap render kecuali recipes atau sortBy berubah
    const sortedRecipes = useMemo(() => {
        if (!recipes?.data) return recipes;

        // Jika default, kembalikan apa adanya dari server
        if (sortBy === SORT_OPTIONS.DEFAULT) return recipes;

        const sorted = [...recipes.data].sort((a, b) => {
            if (sortBy === SORT_OPTIONS.MOST_LIKES) {
                return (b.totalLikes || 0) - (a.totalLikes || 0);
            }
            if (sortBy === SORT_OPTIONS.MOST_COMMENTS) {
                return (b.comments?.length || 0) - (a.comments?.length || 0);
            }
            return 0;
        });

        return { ...recipes, data: sorted };
    }, [recipes, sortBy]);

    return {
        recipes: sortedRecipes,
        loading,
        search,
        sortBy,
        setSortBy,
        setSearch: handleSearchChange,
        setPage,
    };
};