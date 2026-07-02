import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box, Container, Typography, Chip, Divider, 
     Stack, Paper, CircularProgress,
    Grid
} from '@mui/material';
import { Restaurant, MenuBook, ChatBubbleOutline } from '@mui/icons-material';
import { BASE_URL } from '../../constants/index.js';
import HeroImage from '../../components/detailComponents/HeroImage';
import CommentCard from '../../components/detailComponents/CommentsCard';
import IngredientCard from '../../components/detailComponents/IngredientCard';
import MetaRow from '../../components/detailComponents/MetaRow';
import SectionHeader from '../../components/detailComponents/SectionHeader';
import StepCard from '../../components/detailComponents/StepCard';
import { AccessTime } from '@mui/icons-material';

const DetailRecipe = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/recipe/${id}`);
                const result = await response.json();
                console.log(result)
                if (result.success) setRecipe(result.data);
            } catch (error) {
                console.error('Gagal ambil detail:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="80vh" gap={2}>
            <CircularProgress size={48} thickness={4} sx={{ color: '#3b82f6' }} />
            <Typography variant="body2" color="#94a3b8" fontWeight={500}>
                Memuat resep...
            </Typography>
        </Box>
    );

    if (!recipe) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <Typography align="center" color="#94a3b8">Resep tidak ditemukan.</Typography>
        </Box>
    );

    return (
        <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 8 }}>
            <Container maxWidth="md" sx={{ pt: 4 }}>

                {/* Hero Image */}
                <HeroImage imageUrl={recipe.imageUrl} title={recipe.title} />

                {/* Meta */}
                <MetaRow author={recipe.author} id={recipe.id} />

                {/* Description */}
                <Paper
                    elevation={0}
                    sx={{ p: 3, borderRadius: 4, bgcolor: '#fff', mb: 4, border: '1px solid #e2e8f0' }}
                >
                    <Typography variant="body1" sx={{ lineHeight: 1.85, color: '#475569', textAlign: 'justify' }}>
                        {recipe.description}
                    </Typography>
                </Paper>

                {/* Ingredients + Steps */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={5}>
                        <SectionHeader icon={<Restaurant />} label="Bahan-bahan" />
                        <IngredientCard ingredients={recipe.ingredients} />
                    </Grid>

                    <Grid item xs={12} md={7}>
                        <SectionHeader icon={<MenuBook />} label="Langkah Memasak" />
                        <Box>
                            {recipe.steps.map((step) => (
                                <StepCard key={step.step_order} step={step} />
                            ))}
                        </Box>
                    </Grid>
                </Grid>

                {/* Divider */}
                <Divider sx={{ borderColor: '#e2e8f0', mb: 4 }} />

                {/* Comments */}
                <Box>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                        <SectionHeader icon={<ChatBubbleOutline />} label={`Komentar`} />
                        <Chip
                            label={recipe.comments.length}
                            size="small"
                            sx={{ bgcolor: '#3b82f6', color: '#fff', fontWeight: 700, height: 22, fontSize: '0.75rem', mb: 2 }}
                        />
                    </Stack>

                    {recipe.comments.length > 0 ? (
                        recipe.comments.map((comment) => (
                            <Box key={comment.id} sx={{ mb: 2 }}>
                                <CommentCard comment={comment} />
                                {/* Menampilkan waktu pembuatan di bawah kartu komentar */}
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: '#94a3b8',
                                        ml: 2,
                                        mt: 0.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5
                                    }}
                                >
                                    <AccessTime sx={{ fontSize: 12 }} />
                                    {new Date(comment.createdAt).toLocaleString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </Typography>
                            </Box>
                        ))
                    ) : (
                        <Paper
                            elevation={0}
                            sx={{ p: 4, borderRadius: 3, bgcolor: '#f1f5f9', textAlign: 'center', border: '1px dashed #cbd5e1' }}
                        >
                            <ChatBubbleOutline sx={{ color: '#cbd5e1', fontSize: 36, mb: 1 }} />
                            <Typography color="#94a3b8" variant="body2">
                                Belum ada komentar. Jadilah yang pertama berkomentar!
                            </Typography>
                        </Paper>
                    )}
                </Box>

            </Container>
        </Box>
    );
};

export default DetailRecipe;