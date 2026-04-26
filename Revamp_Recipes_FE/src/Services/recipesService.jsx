const fetchAllRecipes = async ({ params, setLoading, setRecipes }) => {
    console.log({params, setLoading, setRecipes})
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${URL}/api/recipes?${params.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Gagal mengambil data dari server");
        }

        const result = await response.json();
        console.log(result)

        if (result.success) {
            setRecipes(result);
        }

    } catch (error) {
        console.error("Error Fetching:", error.message);
    } finally {
        setLoading(false);
    }
};

export default fetchAllRecipes;