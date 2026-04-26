import { Snackbar } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Box, Typography } from '@mui/material';

const severityConfig = {
    success: {
        label: "Berhasil",
        icon: <CheckCircleOutlineIcon sx={{ fontSize: 18, color: "#3B6D11" }} />,
        iconBg: "#EAF3DE",
        labelColor: "#27500A",
        barColor: "#639922",
    },
    error: {
        label: "Gagal",
        icon: <ErrorOutlineIcon sx={{ fontSize: 18, color: "#A32D2D" }} />,
        iconBg: "#FCEBEB",
        labelColor: "#791F1F",
        barColor: "#E24B4A",
    },
    warning: {
        label: "Perhatian",
        icon: <WarningAmberIcon sx={{ fontSize: 18, color: "#854F0B" }} />,
        iconBg: "#FAEEDA",
        labelColor: "#633806",
        barColor: "#BA7517",
    },
    info: {
        label: "Info",
        icon: <InfoOutlinedIcon sx={{ fontSize: 18, color: "#185FA5" }} />,
        iconBg: "#E6F1FB",
        labelColor: "#0C447C",
        barColor: "#378ADD",
    },
};

const Notification = ({ open, handleClose, message, severity = "success" }) => {
    const config = severityConfig[severity];

    return (
        <Snackbar
            open={open}
            autoHideDuration={5000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.5,
                    bgcolor: "background.paper",
                    border: "0.5px solid",
                    borderColor: "divider",
                    borderRadius: "16px",
                    p: "14px 16px",
                    width: 320,
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Icon */}
                <Box
                    sx={{
                        width: 45, height: 45,
                        borderRadius: "10px",
                        bgcolor: config.iconBg,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    {config.icon}
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                        sx={{
                            fontSize: "17px", fontWeight: 500,
                            letterSpacing: "0.04em", textTransform: "uppercase",
                            color: config.labelColor, mb: "2px",
                        }}
                    >
                        {config.label}
                    </Typography>
                    <Typography sx={{ fontSize: "15px", color: "text.primary", lineHeight: 1.5 }}>
                        {message}
                    </Typography>
                </Box>

                {/* Close button */}
                <IconButton
                    size="small"
                    onClick={handleClose}
                    sx={{
                        p: 0.25, borderRadius: "6px",
                        color: "text.disabled",
                        "&:hover": { bgcolor: "action.hover" },
                    }}
                >
                    <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>

                {/* Progress bar */}
                <Box
                    sx={{
                        position: "absolute", bottom: 0, left: 0,
                        height: "2px",
                        bgcolor: config.barColor,
                        borderRadius: "0 0 16px 16px",
                        animation: "shrink 5s linear forwards",
                        "@keyframes shrink": {
                            from: { width: "100%" },
                            to: { width: "0%" },
                        },
                    }}
                />
            </Box>
        </Snackbar>
    );
};

export default Notification;