import { Box, Stack, Typography } from "@mui/material";
import React from "react";

const SectionHeader = ({ icon, label }) => (
    <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 2 }}>
        <Box
            sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {React.cloneElement(icon, { sx: { color: '#3b82f6', fontSize: 20 } })}
        </Box>
        <Typography variant="h6" fontWeight={700} color="#1e293b">
            {label}
        </Typography>
    </Stack>
);

export default SectionHeader;