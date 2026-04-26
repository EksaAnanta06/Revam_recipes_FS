import { Box, List, ListItem, ListItemText, Paper, Typography } from "@mui/material";

const IngredientCard = ({ ingredients }) => (
    <Paper
        variant="outlined"
        sx={{ borderRadius: 3, overflow: 'hidden', borderColor: '#e2e8f0' }}
    >
        <Box sx={{ bgcolor: '#eff6ff', px: 2, py: 1.2 }}>
            <Typography variant="caption" fontWeight={700} color="#3b82f6" letterSpacing={1}>
                {ingredients.length} BAHAN
            </Typography>
        </Box>
        <List disablePadding>
            {ingredients.map((ing, idx) => (
                <ListItem
                    key={ing.id}
                    divider={idx < ingredients.length - 1}
                    sx={{
                        px: 2.5,
                        py: 1.4,
                        '&:hover': { bgcolor: '#f8fafc' },
                        transition: 'background 0.15s',
                    }}
                >
                    <Box
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: '#3b82f6',
                            mr: 1.5,
                            flexShrink: 0,
                        }}
                    />
                    <ListItemText
                        primary={ing.name}
                        secondary={ing.quantity}
                        primaryTypographyProps={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}
                        secondaryTypographyProps={{ color: '#64748b', fontSize: '0.8rem' }}
                    />
                </ListItem>
            ))}
        </List>
    </Paper>
);

export default IngredientCard;