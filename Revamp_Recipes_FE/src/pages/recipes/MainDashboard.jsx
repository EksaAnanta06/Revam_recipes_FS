import { useState, useEffect } from 'react';
import {
    Box, AppBar, Toolbar, Typography,
    Container, Grid, IconButton, CircularProgress,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { BASE_URL } from '../../utils/constants.jsx';
import RecipeCard from '../../components/dashboard/RecipeCard.jsx';
import MobileDrawer from '../../components/dashboard/MobileDrawer.jsx';
import HeroSection from '../../components/dashboard/HeroSection.jsx';
import Profile from '../../components/dashboard/Profile.jsx';
import SearchBar from '../../components/dashboard/SearchBar.jsx';
import menu from '../../utils/hamburgerMenu.jsx';
import { jwtDecode } from "jwt-decode";
import ModernPagination from '../../components/dashboard/Paginations.jsx';
const MainDashboard = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsOpen(open);
    };
    const fetchRecipes = async () => {

        const params = new URLSearchParams({
            search: search,
            page: page,
            limit: 8
        });
        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/api/recipes?${params.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    headers: new Headers({
                        "ngrok-skip-browser-warning": "true",
                    }),
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

    const handleChangePage = (event, value) => {
        console.log(value)
        setPage(value);
    };

    useEffect(() => {
        let token = localStorage.getItem("token");
        const user = token ? jwtDecode(localStorage.getItem("token")) : null;

        if (!user) {
            setUser(null)
        } else {
            setUser(user)
        }
    }, [])

    useEffect(() => {
        // Reset ke halaman 1 setiap kali user mulai mengetik/mencari
        setPage(1);

        const timeoutId = setTimeout(() => {
            fetchRecipes();
        }, 500);

        return () => clearTimeout(timeoutId);

        // Gunakan 'search' sebagai pemicu utama
    }, [search]);

    useEffect(() => {
        // Gunakan useEffect terpisah khusus untuk perpindahan halaman
        fetchRecipes();
    }, [page]);

    return (
        <Box sx={{ bgcolor: '#fff', minHeight: '100vh', position: "relative" }}>
            {/* 1. NAVBAR - Lebih ramping di mobile */}
            <AppBar position="sticky" elevation={0} sx={{
                bgcolor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid #f1f5f9'
            }}>
                <Container maxWidth="lg">
                    <Toolbar sx={{ py: { xs: 0.5, sm: 1 }, gap: { xs: 1, sm: 2 } }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', display: { xs: 'none', md: 'block' } }}>
                            Eksa<span style={{ color: '#3b82f6' }}>Recipes</span>
                        </Typography>

                        {/* PROFILE */}
                        <Profile avatar={user?.avatar ? user.avatar : ''} />

                        {/* SEARCH BAR - Melar maksimal di mobile */}
                        <SearchBar
                            search={search}
                            setSearch={setSearch} />

                        {/* Desktop Menu (Hidden on Mobile) */}
                        <div className="hidden md:flex space-x-8">
                            {menu.map((item) => (
                                <a key={item.text} href={item.href} className="text-gray-600 font-mono hover:text-blue-600 transition">
                                    {item.text}
                                </a>
                            ))}
                        </div>

                        {/* Hamburger Icon (Visible on Mobile Only) */}
                        <div className="md:hidden">
                            <IconButton
                                onClick={toggleDrawer(true)}
                                edge="start"
                                className="hover:bg-gray-100"
                            >
                                <MenuIcon className="text-gray-900" />
                            </IconButton>
                        </div>

                        {/* MUI Drawer (Mobile Menu) */}
                        <MobileDrawer methode={{ isOpen, toggleDrawer, menu }}  user={user} />

                    </Toolbar>
                </Container>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 5 } }} >
                {/* 2. HERO SECTION - Padding lebih kecil di mobile */}
                <HeroSection />

                {/* 3. RECIPE GRID */}
                <Typography className='font-extrabold text-2xl' variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1e293b' }}>Resep Terbaru</Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
                        <CircularProgress size={30} sx={{ mb: 2 }} />
                        <Typography variant="body2" color="textSecondary">Memuat resep...</Typography>
                    </Box>
                ) : (
                    <Grid container >
                        {recipes?.data?.length > 0 ? recipes.data.map((recipe) => (
                            <RecipeCard key={recipe.id} id={recipe.id} recipe={recipe} api={fetchRecipes} />
                        )) : (
                            <Box sx={{ width: '100%', textAlign: 'center', py: 10 }}>
                                <Typography variant="body1" color="textSecondary">Resep tidak ditemukan.</Typography>
                            </Box>
                        )}
                    </Grid>
                )}
            </Container>

            {/* Pagination */}
            <ModernPagination
                totalPage={recipes.pagination?.totalPage}
                onChange={handleChangePage}
            />
        </Box>
    );
};

export default MainDashboard;