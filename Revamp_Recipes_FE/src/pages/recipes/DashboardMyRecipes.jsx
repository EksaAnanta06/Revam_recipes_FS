import React, { useState } from 'react'
import { useUser } from '../../hooks/useProfileUser';
import { useRecipes } from '../../hooks/useRecipe';
import ModernPagination from '../../components/dashboard/Paginations';
import DashboardLayout from '../../layouts/DahboardLayout';
import HeroSection from '../../components/dashboard/HeroSection';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import RecipeCard from '../../components/dashboard/RecipeCard';

const DashboardMyRecipes = () => {
    const userProfile = useUser();
    const { recipes, loading, search, setSearch, setPage, fetchRecipes } = useRecipes({ isMyRecipes: true });
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
        <>
            <div className='all-recipes'>
                <DashboardLayout search={search} setSearch={setSearch} user={userProfile} isOpen={isOpen} toggleDrawer={toggleDrawer}>
                    {/* 2. HERO SECTION - Padding lebih kecil di mobile */}
                    <HeroSection />

                    {/* 3. RECIPE GRID */}
                    <Typography className='font-extrabold text-2xl' variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1e293b' }}>Resep Raya</Typography>

                    {/* refacttor disini */}
                    {loading ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
                            <CircularProgress size={30} sx={{ mb: 2 }} />
                            <Typography variant="body2" color="textSecondary">Memuat resep...</Typography>
                        </Box>
                    ) : (
                        <Grid container >
                            {recipes?.data?.length > 0 ? recipes?.data.map((recipe) => (
                                <RecipeCard key={recipe.id} id={recipe.id} recipe={recipe} api={fetchRecipes} />
                            )) : (
                                <Box sx={{ width: '100%', textAlign: 'center', py: 10 }}>
                                    <Typography variant="body1" color="textSecondary">Resep tidak ditemukan.</Typography>
                                </Box>
                            )}
                        </Grid>
                    )}
                </DashboardLayout>

                <ModernPagination
                    totalPage={recipes.pagination?.totalPage}
                    onChange={handleChangePage}
                />
            </div>
        </>
    )
}

export default DashboardMyRecipes;
