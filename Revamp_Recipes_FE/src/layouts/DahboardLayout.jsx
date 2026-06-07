import React from 'react';
import { Box, AppBar, Container, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import menu from '../utils/hamburgerMenu.jsx';
import Profile from '../components/dashboard/Profile';
import SearchBar from '../components/dashboard/SearchBar';
import MobileDrawer from '../components/dashboard/MobileDrawer';

const DashboardLayout = ({ children, search, setSearch, user, isOpen, toggleDrawer }) => {
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
                        <MobileDrawer methode={{ isOpen, toggleDrawer, menu }} user={user} />
                    </Toolbar>
                </Container>
            </AppBar>

            {/* KONTEN DINAMIS */}
            <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 5 } }}>
                {children}
            </Container>
        </Box>
    );
};

export default DashboardLayout;