import { useState, useEffect, useCallback } from "react";
import { getRecipesService } from "../Services/recipeService.jsx";

export const useRecipes = ({ isMyRecipes = false } = {}) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    // fetchRecipes dibuat murni menerima parameter fresh dari useEffect
    const fetchRecipes = useCallback(async (targetPage, targetSearch) => {
        setLoading(true);
        try {
            const result = await getRecipesService({
                search: targetSearch,
                page: targetPage,
                limit: 8,
                isMyRecipes
            });

            if (result.success) {
                // Pastikan format dari API beneran result.data adalah Array
                setRecipes(result || []);
            }
        } catch (error) {
            console.error("Error dari service:", error.message);
        } finally {
            setLoading(false);
        }
    }, [isMyRecipes]);

    // SATU-SATUNYA useEffect untuk mengontrol kapan data harus di-ambil
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchRecipes(page, search);
        }, 500); // Efek debounce berjalan untuk search maupun perpindahan halaman

        return () => clearTimeout(timeoutId);
    }, [page, search, fetchRecipes]);

    // Helper khusus: Kalau user mengetik sesuatu, otomatis balik ke halaman 1
    const handleSearchChange = (value) => {
        setSearch(value);
        setPage(1);
    };

    return {
        recipes,
        loading,
        search,
        setSearch: handleSearchChange, // Kita oper helper ini ke komponen luar
        setPage
    };
};