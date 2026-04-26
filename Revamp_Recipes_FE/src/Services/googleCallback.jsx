import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";

const GoogleCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            localStorage.setItem("token", token);

            const timeout = setTimeout(() => {
                navigate("/", { replace: true });
            }, 2000);

            return () => clearTimeout(timeout);
        } else {
            navigate("/login");
        }
    }, [searchParams, navigate]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            gap={2}
        >
            <CircularProgress size={60} thickness={4} sx={{ color: '#3b82f6' }} />
            <Typography variant="h6" color="textSecondary">
                Memverifikasi akun Google kamu...
            </Typography>
        </Box>
    );
};

export default GoogleCallback;