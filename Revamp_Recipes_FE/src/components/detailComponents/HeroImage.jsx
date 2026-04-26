import { Box, Typography } from "@mui/material";
import { BASE_URL } from "../../utils/constants";

const HeroImage = ({ imageUrl, title }) => (
    <Box
        sx={{
            position: 'relative',
            width: '100%',
            borderRadius: 4,
            overflow: 'hidden',
            mb: 4,
            boxShadow: '0 24px 60px rgba(59,130,246,0.18)',
        }}
    >
        <Box
            component="img"
            src={`${BASE_URL}${imageUrl}`}
            alt={title}
            onError={(e) => { e.target.src = 'https://placehold.co/900x420/eff6ff/3b82f6?text=No+Image'; }}
            sx={{
                width: '100%',
                height: { xs: 220, sm: 320, md: 420 },
                objectFit: 'cover',
                display: 'block',
            }}
        />
        {/* Gradient overlay */}
        <Box
            sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(15,23,42,0.72) 0%, transparent 55%)',
            }}
        />
        {/* Title on image */}
        <Box
            sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: { xs: 2.5, md: 4 },
            }}
        >
            <Typography
                variant="h3"
                fontWeight={800}
                sx={{
                    color: '#fff',
                    lineHeight: 1.2,
                    fontSize: { xs: '1.6rem', md: '2.4rem' },
                    textShadow: '0 2px 12px rgba(0,0,0,0.4)',
                    mb: 1,
                }}
            >
                {title}
            </Typography>
        </Box>
    </Box>
);

export default HeroImage