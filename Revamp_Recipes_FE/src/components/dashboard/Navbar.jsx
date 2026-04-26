import { AppBar, Toolbar, Typography, Stack, Avatar, Box, InputBase, Container, IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = ({ search, setSearch, onOpenDrawer }) => (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #f1f5f9' }}>
        <Container maxWidth="lg">
            <Toolbar sx={{ py: { xs: 0.5, sm: 1 }, gap: { xs: 1, sm: 2 } }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', display: { xs: 'none', md: 'block' } }}>
                    Revamp<span style={{ color: '#3b82f6' }}>Recipes</span>
                </Typography>

                <Stack direction="row" spacing={0.5} alignItems="center">
                    <Avatar sx={{ bgcolor: '#3b82f6', width: 32, height: 32 }}>U</Avatar>
                </Stack>

                <Box sx={{ display: 'flex', bgcolor: '#f1f5f9', borderRadius: '12px', px: 2, py: 0.8, flexGrow: 1, maxWidth: { md: '40%' } }}>
                    <Search sx={{ color: '#94a3b8', mr: 1, fontSize: 20 }} />
                    <InputBase
                        placeholder="Cari resep..."
                        fullWidth
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Box>

                <IconButton onClick={onOpenDrawer} sx={{ display: { md: 'none' } }}>
                    <MenuIcon />
                </IconButton>
            </Toolbar>
        </Container>
    </AppBar>
);

export default Navbar;