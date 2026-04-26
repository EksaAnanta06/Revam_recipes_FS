import { useEffect, useRef } from "react";
import { Box, Typography, Button, Stack, Chip } from "@mui/material";
import DownloadIcon from "@mui/icons-material/South";
import { keyframes } from "@mui/system";
import { Link } from "react-router-dom";

const fadeUp = keyframes`from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}`;
const float1 = keyframes`0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-20px) scale(1.05)}`;
const float2 = keyframes`0%,100%{transform:translateY(0)}50%{transform:translateY(15px)}`;
const pulse = keyframes`0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.6)}`;

const FOOD_PILLS = [
    { img: "...", name: "Nasi Goreng", meta: "⭐ 4.9 · 320 dibuat" },
    { img: "...", name: "Rendang Sapi", meta: "⭐ 4.8 · 215 dibuat" },
    { img: "...", name: "Mie Ayam Bakso", meta: "⭐ 4.7 · 178 dibuat" },
];

const STATS = [
    { id: "s1", target: 8400, suffix: "+", label: "Resep" },
    { id: "s2", target: 2100, suffix: "+", label: "Chef Aktif" },
    { id: "s3", target: 4.9, suffix: "★", label: "Rating" },
];

function countUp(el, target, suffix, dur) {
    const start = performance.now();
    const step = (t) => {
        const p = Math.min((t - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = (Math.round(ease * target * 10) / 10).toLocaleString("id") + suffix;
        if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

export default function HeroSection() {
    const canvasRef = useRef(null);

    useEffect(() => {
        // Particle canvas
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let pts = [];
        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            pts = Array.from({ length: 55 }, () => ({
                x: Math.random() * canvas.width, y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
                r: Math.random() * 1.5 + 0.5, o: Math.random() * 0.5 + 0.2,
            }));
        };
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pts.forEach((p, i) => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(148,163,184,${p.o})`;
                ctx.fill();
                for (let j = i + 1; j < pts.length; j++) {
                    const dx = pts[j].x - p.x, dy = pts[j].y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y); ctx.lineTo(pts[j].x, pts[j].y);
                        ctx.strokeStyle = `rgba(59,130,246,${0.12 * (1 - dist / 100)})`;
                        ctx.lineWidth = 0.5; ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(draw);
        };
        resize(); draw();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    useEffect(() => {
        // Count-up stats
        setTimeout(() => {
            STATS.forEach(({ id, target, suffix, dur = 1500 }) => {
                const el = document.getElementById(id);
                if (el) countUp(el, target, suffix, dur);
            });
        }, 400);
    }, []);

    return (
        <Box sx={{
            position: "relative", borderRadius: { xs: "16px", md: "24px" },
            overflow: "hidden", background: "#060d1f",
            minHeight: { xs: 260, md: 320 },
            display: "flex", alignItems: "center",
            p: { xs: "36px 28px", md: "48px 52px" },
            mb: { xs: 4, md: 6 },
        }}>
            {/* Canvas */}
            <Box component="canvas" ref={canvasRef}
                sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />

            {/* Grid overlay */}
            <Box sx={{
                position: "absolute", inset: 0, pointerEvents: "none",
                backgroundImage: "linear-gradient(rgba(59,130,246,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.06) 1px,transparent 1px)",
                backgroundSize: "40px 40px",
                maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%)",
            }} />

            {/* Glow orbs */}
            <Box sx={{ position: "absolute", width: 280, height: 280, borderRadius: "50%", background: "rgba(59,130,246,0.18)", filter: "blur(60px)", top: -80, right: 80, animation: `${float1} 6s ease-in-out infinite` }} />
            <Box sx={{ position: "absolute", width: 180, height: 180, borderRadius: "50%", background: "rgba(99,59,246,0.12)", filter: "blur(60px)", bottom: -60, right: 200, animation: `${float2} 8s ease-in-out infinite` }} />

            {/* Content */}
            <Box sx={{ position: "relative", zIndex: 2, maxWidth: 520 }}>
                {/* Badge */}
                <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, background: "rgba(59,130,246,0.15)", border: "0.5px solid rgba(59,130,246,0.35)", borderRadius: "20px", px: 1.5, py: 0.6, mb: 2.5, animation: `${fadeUp} 0.6s ease both` }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#3b82f6", animation: `${pulse} 2s ease infinite` }} />
                    <Typography sx={{ fontSize: "11px", color: "#93c5fd", fontWeight: 500, letterSpacing: "0.04em" }}>
                        1.200+ Resep Baru Minggu Ini
                    </Typography>
                </Box>

                <Typography variant="h4" sx={{ fontWeight: 700, color: "#f8fafc", lineHeight: 1.15, mb: 1.75, fontSize: { xs: "1.9rem", md: "3rem" }, animation: `${fadeUp} 0.6s 0.1s ease both`, opacity: 0, animationFillMode: "forwards" }}>
                    Inspirasi Masak<br />
                    <Box component="span" sx={{ color: "#3b82f6" }}>Terbaik</Box> Hari Ini.
                </Typography>

                <Typography sx={{ fontSize: { xs: "0.85rem", md: "0.9rem" }, color: "#94a3b8", lineHeight: 1.65, maxWidth: 380, mb: 3.5, animation: `${fadeUp} 0.6s 0.2s ease both`, opacity: 0, animationFillMode: "forwards" }}>
                    Temukan ribuan resep lezat dari komunitas chef rumahan terbaik Indonesia — dimasak dengan cinta, dibagikan untuk semua.
                </Typography>

                <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ animation: `${fadeUp} 0.6s 0.3s ease both`, opacity: 0, animationFillMode: "forwards" }}>
                    <Link to="/addRecipe">
                        <Button variant="contained" disableElevation startIcon={<DownloadIcon sx={{ fontSize: 14 }} />}
                            sx={{ bgcolor: "#2563eb", borderRadius: "12px", px: 3, py: 1.2, textTransform: "none", fontWeight: 600, fontSize: "13px", "&:hover": { bgcolor: "#1d4ed8", transform: "translateY(-2px)" }, transition: "all 0.2s cubic-bezier(.34,1.56,.64,1)" }}>
                            Bagikan Resep
                        </Button>
                    </Link>
                </Stack>

                {/* Stats */}
                <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mt: 3, animation: `${fadeUp} 0.6s 0.4s ease both`, opacity: 0, animationFillMode: "forwards" }}>
                    {STATS.map((s, i) => (
                        <Stack key={s.id} direction="row" spacing={2.5} alignItems="center">
                            <Box>
                                <Typography id={s.id} sx={{ fontSize: "18px", fontWeight: 700, color: "#f1f5f9" }}>0</Typography>
                                <Typography sx={{ fontSize: "10px", color: "#64748b", letterSpacing: "0.04em" }}>{s.label}</Typography>
                            </Box>
                            {i < STATS.length - 1 && <Box sx={{ width: "0.5px", height: 28, bgcolor: "rgba(148,163,184,0.2)" }} />}
                        </Stack>
                    ))}
                </Stack>
            </Box>

            {/* Food pills — desktop only */}
            <Stack spacing={1.5} sx={{ position: "absolute", right: 48, top: "50%", transform: "translateY(-50%)", zIndex: 2, display: { xs: "none", md: "flex" }, animation: `${fadeUp} 0.6s 0.35s ease both` }}>
                {FOOD_PILLS.map((f, i) => (
                    <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1, background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: "16px", p: "10px 14px", mt: i === 1 ? 3 : 0 }}>
                        <Box component="img" src={f.img} sx={{ width: 36, height: 36, borderRadius: "10px", objectFit: "cover" }} />
                        <Box>
                            <Typography sx={{ fontSize: "12px", color: "#f1f5f9", fontWeight: 500 }}>{f.name}</Typography>
                            <Typography sx={{ fontSize: "10px", color: "#64748b" }}>{f.meta}</Typography>
                        </Box>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
}