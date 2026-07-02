import { useState } from 'react';
import {
    Box, Button, Menu, MenuItem,
    ListItemIcon, ListItemText, Divider, Typography
} from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';
import { SORT_OPTIONS } from '../../hooks/useRecipe.jsx';

const SORT_LABELS = {
    [SORT_OPTIONS.DEFAULT]:       { label: "Terbaru",           icon: <AccessTimeIcon sx={{ fontSize: 16 }} /> },
    [SORT_OPTIONS.MOST_LIKES]:    { label: "Like Terbanyak",    icon: <FavoriteIcon    sx={{ fontSize: 16, color: '#ef4444' }} /> },
    [SORT_OPTIONS.MOST_COMMENTS]: { label: "Komentar Terbanyak", icon: <ChatBubbleOutlineIcon sx={{ fontSize: 16, color: '#3b82f6' }} /> },
};

const SortDropdown = ({ sortBy, setSortBy }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleOpen  = (e) => setAnchorEl(e.currentTarget);
    const handleClose = ()  => setAnchorEl(null);

    const handleSelect = (value) => {
        setSortBy(value);
        handleClose();
    };

    const activeLabel = SORT_LABELS[sortBy]?.label ?? "Urutkan";
    const isFiltered  = sortBy !== SORT_OPTIONS.DEFAULT;

    return (
        <>
            <Button
                onClick={handleOpen}
                // Di mobile: hanya ikon (minWidth kecil). Di sm+: ikon + label
                startIcon={<SortIcon sx={{ fontSize: 18 }} />}
                size="small"
                variant={isFiltered ? "contained" : "outlined"}
                disableElevation
                sx={{
                    textTransform: 'none',
                    borderRadius: '10px',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    // Mobile: padding ikon saja, sm+ tampilkan label
                    px: { xs: 1, sm: 1.5 },
                    minWidth: { xs: 36, sm: 'auto' },
                    borderColor: '#e2e8f0',
                    color: isFiltered ? '#fff' : '#475569',
                    bgcolor: isFiltered ? '#3b82f6' : 'transparent',
                    '&:hover': {
                        borderColor: '#3b82f6',
                        bgcolor: isFiltered ? '#2563eb' : '#f1f5f9',
                    },
                    // Sembunyikan teks label di xs, tampilkan di sm+
                    '& .MuiButton-startIcon': { mr: { xs: 0, sm: 0.5 } },
                }}
            >
                {/* Label disembunyikan di mobile dengan sx display */}
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    {activeLabel}
                </Box>
            </Button>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{
                    paper: {
                        elevation: 3,
                        sx: {
                            mt: 0.5,
                            borderRadius: '12px',
                            minWidth: 200,
                            border: '1px solid #f1f5f9',
                            overflow: 'hidden',
                        }
                    }
                }}
            >
                <Box sx={{ px: 2, py: 1.25 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Urutkan berdasarkan
                    </Typography>
                </Box>
                <Divider sx={{ borderColor: '#f1f5f9' }} />

                {Object.entries(SORT_LABELS).map(([value, { label, icon }]) => (
                    <MenuItem
                        key={value}
                        onClick={() => handleSelect(value)}
                        selected={sortBy === value}
                        sx={{
                            px: 2,
                            py: 1,
                            gap: 1,
                            fontSize: '0.875rem',
                            '&.Mui-selected': {
                                bgcolor: '#eff6ff',
                                '&:hover': { bgcolor: '#dbeafe' },
                            },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 28 }}>
                            {icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={label}
                            primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: sortBy === value ? 600 : 400 }}
                        />
                        {sortBy === value && (
                            <CheckIcon sx={{ fontSize: 15, color: '#3b82f6', ml: 'auto' }} />
                        )}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default SortDropdown;
