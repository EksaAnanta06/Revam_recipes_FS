import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import RecipeCard from '../../components/dashboard/RecipeCard.jsx';
import { useOutletContext } from 'react-router-dom';

const DashboardAllRecipes = () => {
    const { recipes, loading } = useOutletContext();

    if (loading) return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
            <CircularProgress size={30} sx={{ mb: 2 }} />
            <Typography variant="body2" color="textSecondary">Memuat resep...</Typography>
        </Box>
    );

    return (
        <Grid container>
            {recipes?.data?.length > 0 ? recipes.data.map((recipe) => (
                <RecipeCard key={recipe.id} id={recipe.id} recipe={recipe} />
            )) : (
                <Box sx={{ width: '100%', textAlign: 'center', py: 10 }}>
                    <Typography variant="body1" color="textSecondary">Resep tidak ditemukan.</Typography>
                </Box>
            )}
        </Grid>
    );
};

export default DashboardAllRecipes;