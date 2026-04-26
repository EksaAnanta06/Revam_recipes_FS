import React, { useState } from 'react';
import {
    Box, Container, TextField, Typography, Button, IconButton,
    Stack, Paper, Divider
} from '@mui/material';
import { Add, Delete, CloudUpload, Send } from '@mui/icons-material';
import { BASE_URL } from '../../utils/constants';
import Notification from '../../components/notifikasi/Notification';
import { useNavigate } from "react-router-dom";

const sectionLabelSx = {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'text.secondary',
    mb: 1.5,
};

const inputSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        backgroundColor: 'grey.50',
        fontSize: '14px',
        '& fieldset': { borderColor: 'divider' },
        '&:hover fieldset': { borderColor: 'grey.400' },
        '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: 1.5 },
    },
    '& .MuiInputLabel-root': { fontSize: '14px' },
};

const AddRecipe = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
    const [steps, setSteps] = useState([{ step_order: 1, instruction: '' }]);
    const [notify, setNotify] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const handleCloseNotify = () => setNotify({ ...notify, open: false });

    const addIngredient = () => setIngredients([...ingredients, { name: '', quantity: '' }]);
    const removeIngredient = (index) => setIngredients(ingredients.filter((_, i) => i !== index));
    const handleIngredientChange = (index, field, value) => {
        const newIng = [...ingredients];
        newIng[index][field] = value;
        setIngredients(newIng);
    };

    const addStep = () => setSteps([...steps, { step_order: steps.length + 1, instruction: '' }]);
    const removeStep = (index) => {
        const newSteps = steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, step_order: i + 1 }));
        setSteps(newSteps);
    };
    const handleStepChange = (index, value) => {
        const newSteps = [...steps];
        newSteps[index].instruction = value;
        setSteps(newSteps);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        //validasi desciptions
        const isDescriptionValid = description === '';

        //validasi ingredienst
        const isIngredientsValid = ingredients.length > 0 &&
            ingredients.every(ing => ing.name.trim() !== '' && ing.quantity.trim() !== '');

        // validasi steps
        const isStepsValid = steps.length > 0 &&
            steps.every(step => step.instruction.trim() !== '');

        if (isDescriptionValid) {
            setNotify({
                open: true,
                message: "Descriptions tidak boleh kosong!",
                severity: "warning"
            });
            return;
        }

        if (!isIngredientsValid) {
            setNotify({
                open: true,
                message: "Bahan-Bahan minimal satu dan tidak boleh kosong!",
                severity: "warning"
            });
            return;
        }

        if (!isStepsValid) {
            setNotify({
                open: true,
                message: "Langkah-Memasak minimal satu dan tidak boleh kosong!",
                severity: "warning"
            });
            return;
        }

        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('ingredients', JSON.stringify(ingredients));
        formData.append('steps', JSON.stringify(steps));
        formData.append('image', image);

        try {
            const response = await fetch(`${BASE_URL}/api/addRecipe`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const result = await response.json();
            if (result.success) {
                setNotify({
                    open: true,
                    message: "Berhasil menambahkan recipe!",
                    severity: "success"
                });

                setTimeout(() => {
                    navigate("/");
                }, 3000);
            } else {
                setNotify({
                    open: true,
                    message: "Anda belum login! silahkan login terlebih dahulu!",
                    severity: "error"
                });
            }
        } catch (error) {
            setNotify({
                open: true,
                message: error.message,
                severity: "error"
            });
            console.error('Gagal kirim:', error);
        }
    };

    return (
        <>
            <Container maxWidth="md" sx={{ py: 5 }}>
                {/* Page Header */}
                <Box sx={{ mb: 2.5 }}>
                    <Typography variant="h4" fontWeight={600} color="text.primary" sx={{ textAlign: 'center', fontWeight: 700, color: "#3b82f6", lineHeight: 1.15, fontSize: "1.9rem", mb: 1 }}>
                        Tambah Resep Baru
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, textAlign: 'center' }}>
                        Bagikan kreasi masakan kamu kepada semua orang
                    </Typography>
                </Box>

                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2.5, md: 4 },
                        borderRadius: 4,
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Box component="form" onSubmit={handleSubmit}>

                        {/* Informasi Dasar */}
                        <Box sx={{ mb: 3.5 }}>
                            <Typography sx={sectionLabelSx}>Informasi dasar</Typography>
                            <Stack spacing={2}>
                                <TextField
                                    fullWidth
                                    label="Judul resep"
                                    placeholder="Contoh: Ayam Bakar Madu Spesial"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    sx={inputSx}
                                />
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Deskripsi"
                                    placeholder="Ceritakan sedikit tentang resep ini..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    sx={inputSx}
                                />
                            </Stack>
                        </Box>

                        <Divider sx={{ my: 3.5 }} />

                        {/* Upload Foto */}
                        <Box sx={{ mb: 3.5 }}>
                            <Typography sx={sectionLabelSx}>Foto masakan</Typography>
                            <Button
                                component="label"
                                fullWidth
                                sx={{
                                    py: 3,
                                    border: '1.5px dashed',
                                    borderColor: 'divider',
                                    borderRadius: 3,
                                    backgroundColor: 'grey.50',
                                    flexDirection: 'column',
                                    gap: 1,
                                    textTransform: 'none',
                                    color: 'text.secondary',
                                    '&:hover': {
                                        backgroundColor: 'grey.100',
                                        borderColor: 'primary.main',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 2,
                                        backgroundColor: 'primary.50',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <CloudUpload sx={{ color: 'primary.main', fontSize: 20 }} />
                                </Box>
                                <Typography fontSize={13}>
                                    <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
                                        Klik untuk upload
                                    </Box>{' '}
                                    atau drag & drop
                                </Typography>
                                <Typography fontSize={12} color="text.disabled">
                                    PNG, JPG hingga 10MB
                                </Typography>
                                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                            </Button>

                            {imagePreview && (
                                <Box sx={{ mt: 2, borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        style={{ width: '100%', maxHeight: '280px', objectFit: 'cover', display: 'block' }}
                                    />
                                </Box>
                            )}
                        </Box>

                        <Divider sx={{ my: 3.5 }} />

                        {/* Bahan-bahan */}
                        <Box sx={{ mb: 3.5 }}>
                            <Typography sx={sectionLabelSx}>Bahan-bahan</Typography>
                            <Stack spacing={1.5}>
                                {ingredients.map((ing, index) => (
                                    <Stack key={index} direction="row" spacing={1} alignItems="center">
                                        <TextField
                                            label="Nama bahan"
                                            size="small"
                                            fullWidth
                                            value={ing.name}
                                            onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                            sx={inputSx}
                                        />
                                        <TextField
                                            label="Jumlah"
                                            size="small"
                                            value={ing.quantity}
                                            onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                            sx={{ ...inputSx, minWidth: 120 }}
                                        />
                                        <IconButton
                                            onClick={() => removeIngredient(index)}
                                            disabled={ingredients.length === 1}
                                            size="small"
                                            sx={{
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                borderRadius: 2,
                                                width: 36,
                                                height: 36,
                                                flexShrink: 0,
                                                '&:hover': {
                                                    backgroundColor: 'error.50',
                                                    borderColor: 'error.main',
                                                    color: 'error.main',
                                                },
                                            }}
                                        >
                                            <Delete sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </Stack>
                                ))}
                            </Stack>
                            <Button
                                startIcon={<Add sx={{ fontSize: 16 }} />}
                                onClick={addIngredient}
                                size="small"
                                sx={{
                                    mt: 1.5,
                                    textTransform: 'none',
                                    fontSize: 13,
                                    color: 'primary.main',
                                    fontWeight: 500,
                                    p: 0,
                                    '&:hover': { background: 'none', opacity: 0.7 },
                                }}
                            >
                                Tambah bahan
                            </Button>
                        </Box>

                        <Divider sx={{ my: 3.5 }} />

                        {/* Langkah Memasak */}
                        <Box sx={{ mb: 3.5 }}>
                            <Typography sx={sectionLabelSx}>Langkah memasak</Typography>
                            <Stack spacing={1.5}>
                                {steps.map((step, index) => (
                                    <Stack key={index} direction="row" spacing={1.5} alignItems="flex-start">
                                        <Box
                                            sx={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: '50%',
                                                backgroundColor: 'primary.50',
                                                color: 'primary.main',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '12px',
                                                fontWeight: 700,
                                                flexShrink: 0,
                                                mt: 0.8,
                                            }}
                                        >
                                            {step.step_order}
                                        </Box>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={2}
                                            placeholder={`Jelaskan langkah ${step.step_order}...`}
                                            size="small"
                                            value={step.instruction}
                                            onChange={(e) => handleStepChange(index, e.target.value)}
                                            sx={inputSx}
                                        />
                                        <IconButton
                                            onClick={() => removeStep(index)}
                                            disabled={steps.length === 1}
                                            size="small"
                                            sx={{
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                borderRadius: 2,
                                                width: 36,
                                                height: 36,
                                                flexShrink: 0,
                                                mt: 0.3,
                                                '&:hover': {
                                                    backgroundColor: 'error.50',
                                                    borderColor: 'error.main',
                                                    color: 'error.main',
                                                },
                                            }}
                                        >
                                            <Delete sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </Stack>
                                ))}
                            </Stack>
                            <Button
                                startIcon={<Add sx={{ fontSize: 16 }} />}
                                onClick={addStep}
                                size="small"
                                sx={{
                                    mt: 1.5,
                                    textTransform: 'none',
                                    fontSize: 13,
                                    color: 'primary.main',
                                    fontWeight: 500,
                                    p: 0,
                                    '&:hover': { background: 'none', opacity: 0.7 },
                                }}
                            >
                                Tambah langkah
                            </Button>
                        </Box>

                        <Divider sx={{ my: 3.5 }} />

                        {/* Submit */}
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            startIcon={<Send sx={{ fontSize: 18 }} />}
                            sx={{
                                py: 1.5,
                                borderRadius: 3,
                                fontWeight: 600,
                                fontSize: 15,
                                textTransform: 'none',
                                boxShadow: 'none',
                                '&:hover': { boxShadow: 'none', opacity: 0.9 },
                            }}
                        >
                            Kirim
                        </Button>
                    </Box>
                </Paper>
            </Container>

            <Notification
                open={notify.open}
                handleClose={handleCloseNotify}
                message={notify.message}
                severity={notify.severity}
            />
        </>
    );
};

export default AddRecipe;