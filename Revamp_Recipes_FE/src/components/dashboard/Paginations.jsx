import { useState } from "react";
import { Box, Typography, Container } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const getPages = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
    if (current >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "…", current - 1, current, current + 1, "…", total];
};

const PgBtn = ({ id, children, active, dots, disabled, onClick }) => (
    <Box
        key={id}
        component="button"
        onClick={onClick}
        disabled={disabled}
        sx={{
            width: 36, height: 36,
            borderRadius: "10px",
            border: "0.5px solid",
            borderColor: active ? "#1d4ed8" : dots ? "transparent" : "divider",
            bgcolor: active ? "#1d4ed8" : "background.paper",
            color: active ? "#fff" : dots ? "text.disabled" : "text.secondary",
            fontSize: "13px", fontWeight: 500,
            cursor: dots ? "default" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.18s cubic-bezier(.34,1.56,.64,1)",
            transform: active ? "scale(1.08)" : "scale(1)",
            boxShadow: active ? "0 0 0 3px rgba(59,130,246,0.18)" : "none",
            opacity: disabled ? 0.3 : 1,
            "&:hover": !dots && !disabled && !active ? {
                borderColor: "#3b82f6",
                color: "#3b82f6",
                transform: "translateY(-2px)",
                bgcolor: "action.hover",
            } : {},
            "&:active": !dots && !disabled ? { transform: "scale(0.93)" } : {},
        }}
    >
        {children}
    </Box>
);

const ModernPagination = ({ totalPage, onChange }) => {
    const [current, setCurrent] = useState(1);

    const go = (page) => {
        if (page === current) return;
        setCurrent(page);
        onChange?.(null, page);
    };

    const list = getPages(current, totalPage);

    return (
        <Container sx={{ position: "sticky", bottom: 0, zIndex: 10 }}>
            <Box sx={{
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: "10px",
                py: "18px",
                bgcolor: "background.paper",
                borderTop: "0.5px solid", borderColor: "divider",
            }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {/* Prev */}
                    <PgBtn disabled={current === 1} onClick={() => go(current - 1)}>
                        <ChevronLeftIcon sx={{ fontSize: 16 }} />
                    </PgBtn>

                    {list.map((p, i) =>
                        p === "…" ? (
                            <PgBtn id={`dots-${i}`} key={`dots-${i}`} dots>···</PgBtn>
                        ) : (
                                <PgBtn id={p} key={`dots-${i}`} active={p === current} onClick={() => go(p)}>
                                {p}
                            </PgBtn>
                        )
                    )}

                    {/* Next */}
                    <PgBtn disabled={current === totalPage} onClick={() => go(current + 1)}>
                        <ChevronRightIcon sx={{ fontSize: 16 }} />
                    </PgBtn>
                </Box>

                <Typography sx={{ fontSize: "12px", color: "text.disabled" }}>
                    Halaman {current} dari {totalPage}
                </Typography>
            </Box>
        </Container>
    );
};

export default ModernPagination;