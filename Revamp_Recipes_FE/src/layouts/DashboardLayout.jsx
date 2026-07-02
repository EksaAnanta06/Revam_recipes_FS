import React, { useState } from 'react';
import { Box, AppBar, Container, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Profile from '../components/dashboard/Profile';
import SearchBar from '../components/dashboard/SearchBar';
import MobileDrawer from '../components/dashboard/MobileDrawer';
import menu from '../data/menuItems.jsx';
import { useUser } from '../hooks/useProfileUser.jsx';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import ModernPagination from '../components/dashboard/Paginations.jsx';
import HeroSection from '../components/dashboard/HeroSection.jsx';
import { useRecipes } from '../hooks/useRecipe.jsx';
import NavTabs from '../components/dashboard/NavTabs.jsx';

const DashboardLayout = () => {
    const user = useUser();
    const location = useLocation();
    const isMyRecipesPage = location.pathname === '/myRecipes';
    const { recipes, loading, search, setSearch, setPage } = useRecipes({
        isMyRecipes: isMyRecipesPage
    });

    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsOpen(open);
    };

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    return (
        <Box sx={{ bgcolor: '#fff', minHeight: '100vh', position: "relative" }}>
            {/* NAVBAR */}
            <AppBar position="sticky" elevation={0} sx={{
                bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #f1f5f9'
            }}>
                <Container maxWidth="lg">
                    <Toolbar sx={{ py: { xs: 0.5, sm: 1 }, gap: { xs: 1, sm: 2 } }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', display: { xs: 'none', md: 'block' } }}>
                            Revamp<span style={{ color: '#3b82f6' }}>Recipes</span>
                        </Typography>

                        <Profile avatar={user?.avatar || ''} />
                        <SearchBar search={search} setSearch={setSearch} />

                        <div className="hidden md:flex space-x-8">
                            {menu.map((item) => (
                                <a key={item.text} href={item.href} className="text-gray-600 font-mono hover:text-blue-600 transition">
                                    {item.text}
                                </a>
                            ))}
                        </div>

                        <div className="md:hidden">
                            <IconButton onClick={toggleDrawer(true)} edge="start">
                                <MenuIcon className="text-gray-900" />
                            </IconButton>
                        </div>
                        <MobileDrawer methode={{ isOpen, toggleDrawer }} user={user} />
                    </Toolbar>
                </Container>
            </AppBar>

            {/* KONTEN UTAMA */}
            <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 5 } }}>
                <HeroSection />

                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 1000, color: '#1e293b', display: 'inline-block', position: 'relative' }}>
                        {isMyRecipesPage ? "Resep Saya" : "Semua Resep"}
                        <Box sx={{ position: 'absolute', bottom: -8, left: 0, width: 100, height: 4, bgcolor: '#3b82f6', borderRadius: 10 }} />
                    </Typography>
                </Box>

                {/* Nav Tabs */}
                <NavTabs />

                {/* Child Routing Component */}
                <Outlet context={{ recipes, loading }} />

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <ModernPagination
                        totalPage={recipes?.pagination?.totalPage || 1}
                        onChange={handleChangePage}
                    />
                </Box>
            </Container>
        </Box>
    );
};

export default DashboardLayout;