import { Box, Paper, Typography } from "@mui/material";

const StepCard = ({ step }) => (
    <Box
        sx={{
            display: 'flex',
            gap: 2,
            mb: 2.5,
            alignItems: 'flex-start',
        }}
    >
        {/* Step number badge */}
        <Box
            sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: '#3b82f6',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.9rem',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(59,130,246,0.35)',
            }}
        >
            {step.step_order}
        </Box>

        <Paper
            elevation={0}
            sx={{
                flex: 1,
                p: 2,
                bgcolor: '#eff6ff',
                borderRadius: 3,
                borderLeft: '3px solid #3b82f6',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: -10,
                    top: 12,
                    width: 0,
                    height: 0,
                    borderTop: '6px solid transparent',
                    borderBottom: '6px solid transparent',
                    borderRight: '8px solid #eff6ff',
                },
            }}
        >
            <Typography variant="body2" color="#1e293b" sx={{ lineHeight: 1.75 }}>
                {step.instruction}
            </Typography>
        </Paper>
    </Box>
);

export default StepCard;