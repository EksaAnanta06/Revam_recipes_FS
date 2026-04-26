import { Search } from '@mui/icons-material';
import { Box, InputBase } from '@mui/material';

const SearchBar = ({ search, setSearch }) => {
    return (
        <Box sx={{
            display: 'flex',
            bgcolor: '#f1f5f9',
            borderRadius: '12px',
            px: 2,
            py: 0.8,
            flexGrow: 1,
            maxWidth: { md: '40%' }
        }}>
            <Search sx={{ color: '#94a3b8', mr: 1, fontSize: 20 }} />
            <InputBase
                placeholder="Cari resep..."
                fullWidth
                sx={{ fontSize: '0.9rem' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </Box>
    )
}

export default SearchBar;
