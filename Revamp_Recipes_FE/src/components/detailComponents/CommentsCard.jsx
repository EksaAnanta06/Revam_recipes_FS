import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";

const CommentCard = ({ comment }) => {
    const initial = comment.user.username[0].toUpperCase();
    const colors = ['#3b82f6'];
    const color = colors[comment.id % colors.length];

    return (
        <Paper
            key={comment.id}
            elevation={0}
            sx={{
                p: 2.5,
                mb: 2,
                borderRadius: 3,
                bgcolor: '#f8fafc',
                border: '1px solid #e2e8f0',
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: '0 4px 20px rgba(59,130,246,0.10)' },
            }}
        >
            <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar
                    sx={{
                        bgcolor: color,
                        width: 40,
                        height: 40,
                        fontWeight: 700,
                        fontSize: '1rem',
                        boxShadow: `0 4px 12px ${color}55`,
                    }}
                >
                    {initial}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" fontWeight={700} color="#1e293b" sx={{ mb: 0.4 }}>
                        {comment.user.username}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="#475569"
                        sx={{
                            lineHeight: 1.6,
                            fontStyle: 'italic',
                        }}
                    >
                        "{comment.message}"
                    </Typography>
                </Box>
            </Stack>
        </Paper>
    );
};


export default CommentCard;