import { Person } from "@mui/icons-material";
import { Chip, Stack } from "@mui/material";

const MetaRow = ({ author, id }) => (
    <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
        <Chip
            icon={<Person sx={{ fontSize: 16 }} />}
            label={`Oleh: ${author.username}`}
            sx={{
                bgcolor: '#eff6ff',
                color: '#1d4ed8',
                fontWeight: 600,
                border: '1.5px solid #bfdbfe',
                '& .MuiChip-icon': { color: '#3b82f6' },
            }}
        />
        <Chip
            label={`Resep #${id}`}
            size="small"
            sx={{ bgcolor: '#f1f5f9', color: '#64748b', fontWeight: 500 }}
        />
    </Stack>
);

export default MetaRow;