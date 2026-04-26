import React, { useState } from 'react';
import { Grid, Card, Box, CardMedia, CardContent, Chip, Typography, Stack, IconButton, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import { Favorite, FavoriteBorder, AccessTime } from '@mui/icons-material';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import CloseIcon from '@mui/icons-material/Close';
import Notification from '../notifikasi/Notification.jsx';
import SendIcon from '@mui/icons-material/Send';
import { BASE_URL } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';

const RecipeCard = ({ id, recipe, api }) => {
    // State lokal per masing-masing card resep
    const likeKey = `liked_recipe_${recipe.id}`;
    const cachedLike = localStorage.getItem(likeKey);

    // Prioritas: data dari API (jika ada), fallback ke cache localStorage
    const initialLiked = recipe.isLiked ?? (cachedLike === "true");

    const [isLiked, setIsLiked] = useState(initialLiked);
    const [likeCount, setLikeCount] = useState(recipe.totalLikes || 0);
    const navigate = useNavigate();
    const [notify, setNotify] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const handleCloseNotify = () => setNotify({ ...notify, open: false });

    const handleToggleLike = async () => {
        const token = localStorage.getItem("token");

        if (!token) return setNotify({
            open: true,
            message: "gagal, silahkan login terlebih dahulu!",
            severity: "error"
        });

        const prevLiked = isLiked;
        const prevCount = likeCount;

        // Optimistic update
        const newLiked = !isLiked;
        setIsLiked(newLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

        // Simpan ke cache segera (optimistic)
        localStorage.setItem(likeKey, String(newLiked));

        try {
            const response = await fetch(`${BASE_URL}/api/recipes/${recipe.id}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                // Rollback cache jika gagal
                localStorage.setItem(likeKey, String(prevLiked));
                setIsLiked(prevLiked);
                setLikeCount(prevCount);
                return setNotify({
                    open: true,
                    message: "gagal menyukai recipe, periksa koneksi anda!",
                    severity: "error"
                });
            }

            const result = await response.json();

            // Update state & cache dari response server (source of truth)
            setIsLiked(result.isLiked);
            localStorage.setItem(likeKey, String(result.isLiked));

            if (!prevLiked) {
                setNotify({
                    open: true,
                    message: "recipe disukai!",
                    severity: "success"
                });
            }

        } catch (error) {
            console.error("Gagal like:", error);

            // Rollback state & cache
            setIsLiked(prevLiked);
            setLikeCount(prevCount);
            localStorage.setItem(likeKey, String(prevLiked));

            setNotify({
                open: true,
                message: "gagal menyukai recipe!",
                severity: "error"
            });
        }
    };

    // coments
    const [openComment, setOpenComment] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [commentText, setCommentText] = useState("");

    const handleOpenComment = (recipe) => {
        setSelectedRecipe(recipe);
        setOpenComment(true);
    };

    const handleCloseComment = () => {
        setOpenComment(false);
        setCommentText("");
    };

    const handleSubmitComment = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${BASE_URL}/api/recipes/${selectedRecipe.id}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: commentText
                })
            });

            if (response.ok) {
                setTimeout(() => {
                    api(); // Refresh data biar angka komentarnya nambah, api ini isinya fetchRecipe()
                }, 1500)

                setNotify({
                    open: true,
                    message: "berhasil mengirim komentar!",
                    severity: "success"
                });

                handleCloseComment();
            } else {
                setNotify({
                    open: true,
                    message: "silahkan login terlebih dahulu!",
                    severity: "error"
                });
            }

        } catch (error) {
            setNotify({
                open: true,
                message: "gagal mengirim komentar cek koneksi anda!",
                severity: "error"
            });

            console.error("Gagal kirim komentar:", error);
        }
    };

    return (
        <>
            <Grid key={id} size={6} item xs={6} sm={4} md={3} className="p-1 md:p-2">
                <Card
                    sx={{
                        background: "#0f172a",
                        borderRadius: "20px",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        cursor: "pointer",
                        outline: "1.5px solid transparent",
                        transition: "transform 0.3s cubic-bezier(.34,1.56,.64,1), outline 0.2s",
                        "&:hover": {
                            transform: "translateY(-8px) scale(1.01)",
                            outline: "1.5px solid rgba(59,130,246,0.5)",
                            "& .card-img": { transform: "scale(1.06)" },
                            "& .cek-btn": { background: "#1d4ed8" },
                        },
                    }}
                >
                    {/* Image section */}
                    <Box sx={{ position: "relative", pt: "68%", overflow: "hidden" }}>
                        <CardMedia
                            className="card-img"
                            component="img"
                            image={recipe.image_url
                                ? `${BASE_URL.replace(/\/$/, "")}${recipe.image_url}`
                                : "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"}
                            alt={recipe.title}
                            sx={{
                                position: "absolute", top: 0, width: "100%", height: "100%",
                                objectFit: "cover",
                                transition: "transform 0.4s ease",
                            }}
                        />
                        {/* gradient overlay */}
                        <Box sx={{
                            position: "absolute", inset: 0,
                            background: "linear-gradient(to top, #0f172a 0%, transparent 55%)",
                        }} />
                        {/* username badge */}
                        <Chip label={recipe.username} size="small" sx={{
                            position: "absolute", top: 10, left: 10,
                            bgcolor: "rgba(59,130,246,0.9)", color: "#fff",
                            fontWeight: 600, fontSize: "11px", height: 22,
                            backdropFilter: "blur(4px)",
                        }} />
                        {/* date badge */}
                        <Box sx={{
                            position: "absolute", top: 10, right: 10,
                            bgcolor: "rgba(15,23,42,0.7)", borderRadius: "20px",
                            px: 1, py: "3px", display: "flex", alignItems: "center", gap: 0.5,
                        }}>
                            <AccessTime sx={{ fontSize: 10, color: "#94a3b8" }} />
                            <Typography sx={{ fontSize: "10px", color: "#94a3b8" }}>
                                {new Date(recipe.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Body */}
                    <CardContent sx={{ p: "14px", flexGrow: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                        <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "#f1f5f9", lineHeight: 1.3 }}>
                            {recipe.title.length > 22 ? `${recipe.title.substring(0, 22)}...` : recipe.title}
                        </Typography>
                        <Typography sx={{
                            fontSize: "11px", color: "#64748b", lineHeight: 1.5,
                            display: "-webkit-box", WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical", overflow: "hidden",
                        }}>
                            {recipe.description}
                        </Typography>

                        <Box sx={{ mt: "auto", pt: "10px", borderTop: "0.5px solid rgba(148,163,184,0.12)" }}>
                            <Stack direction="row" alignItems="center" gap={1.5}>
                                {/* Like */}
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <IconButton size="small" onClick={handleToggleLike} sx={{ p: 0 }}>
                                        {isLiked
                                            ? <Favorite sx={{ fontSize: 15, color: "#ef4444" }} />
                                            : <FavoriteBorder sx={{ fontSize: 15, color: "#64748b" }} />}
                                    </IconButton>
                                    <Typography sx={{ fontSize: "11px", color: "#94a3b8" }}>{likeCount}</Typography>
                                </Stack>
                                {/* Comment */}
                                <Stack direction="row" spacing={0.5} alignItems="center"
                                    onClick={() => handleOpenComment(recipe)} sx={{ cursor: "pointer" }}>
                                    <MessageOutlinedIcon sx={{ fontSize: 15, color: "#64748b" }} />
                                    <Typography sx={{ fontSize: "11px", color: "#94a3b8" }}>
                                        {recipe.comments?.length || 0}
                                    </Typography>
                                </Stack>
                            </Stack>

                            <Button
                                onClick={() => navigate(`/recipes/${recipe.id}`)}
                                className="cek-btn"
                                fullWidth size="small" variant="contained"
                                sx={{
                                    mt: "10px", bgcolor: "#1d4ed8", textTransform: "none",
                                    borderRadius: "10px", fontSize: "12px", fontWeight: 500,
                                    boxShadow: "none", transition: "background 0.2s",
                                    "&:hover": { bgcolor: "#1e40af", boxShadow: "none" },
                                }}
                            >
                                Lihat Resep
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* coments pop-up */}
            <Dialog
                open={openComment}
                onClose={handleCloseComment}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    sx: {
                        borderRadius: "20px",
                        overflow: "hidden",
                        p: 0,
                    }
                }}
            >
                <DialogTitle sx={{ px: 3, pt: 3, pb: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                        <Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                <Box sx={{
                                    width: 28, height: 28, borderRadius: "50%",
                                    bgcolor: "info.lighter", display: "flex",
                                    alignItems: "center", justifyContent: "center"
                                }}>
                                    <MessageOutlinedIcon sx={{ fontSize: 14, color: "info.main" }} />
                                </Box>
                                <Typography sx={{ fontWeight: 500, fontSize: "0.9375rem" }}>
                                    Tulis Komentar
                                </Typography>
                            </Box>
                        </Box>
                        <IconButton size="small" onClick={handleCloseComment}
                            sx={{ border: "0.5px solid", borderColor: "divider", borderRadius: "50%", p: 0.5 }}>
                            <CloseIcon sx={{ fontSize: 12 }} />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent sx={{ px: 3, pt: 2 }}>
                    {/* Recipe label */}
                    <Box sx={{
                        bgcolor: "action.hover", borderRadius: 2,
                        px: 1.5, py: 1, display: "flex", alignItems: "center", gap: 1, mb: 2
                    }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "info.main", flexShrink: 0 }} />
                        <Typography variant="caption" color="text.secondary">Untuk: </Typography>
                        <Typography variant="caption" fontWeight={500} noWrap>
                            {selectedRecipe?.title}
                        </Typography>
                    </Box>

                    {/* Textarea */}
                    <Box sx={{ position: "relative" }}>
                        <TextField
                            autoFocus multiline rows={4} fullWidth
                            placeholder="Tulis pendapat kamu di sini..."
                            variant="outlined"
                            value={commentText}
                            onChange={(e) => {
                                if (e.target.value.length <= 280) setCommentText(e.target.value);
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 3,
                                    fontSize: "0.8125rem",
                                    lineHeight: 1.6,
                                }
                            }}
                        />
                        <Typography variant="caption" color={commentText.length > 260 ? "error" : "text.disabled"}
                            sx={{ position: "absolute", bottom: 10, right: 12 }}>
                            {commentText.length}/280
                        </Typography>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3, pt: 1, justifyContent: "space-between" }}>
                    <Button onClick={handleCloseComment}
                        sx={{
                            textTransform: "none", fontSize: "0.8125rem",
                            color: "text.secondary", border: "0.5px solid", borderColor: "divider",
                            borderRadius: 2.5, px: 2
                        }}>
                        Batal
                    </Button>
                    <Button
                        onClick={handleSubmitComment}
                        variant="contained"
                        disabled={!commentText.trim() || commentText.length > 280}
                        startIcon={<SendIcon sx={{ fontSize: 13 }} />}
                        sx={{
                            textTransform: "none", fontSize: "0.8125rem", fontWeight: 500,
                            borderRadius: 2.5, px: 2.5, boxShadow: "none",
                            bgcolor: "#2563eb",
                            "&:hover": { bgcolor: "#1d4ed8", boxShadow: "none" },
                            "&:disabled": { opacity: 0.4 }
                        }}>
                        Kirim
                    </Button>
                </DialogActions>
            </Dialog>

            {/* notifikasi */}
            <Notification open={notify.open}
                handleClose={handleCloseNotify}
                message={notify.message}
                severity={notify.severity} />
        </>
    );
};

export default RecipeCard;


