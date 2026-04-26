import { Typography } from '@mui/material'
const HeaderForm = () => {
    return (
        <div className="text-center mb-8">
            <Typography
                variant="h6"
                className=" mb-2 bg-linear-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent"
                sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}
            >
                Recipes Revamp
            </Typography>
            <Typography variant="body2" className="text-gray-500">
                Masuk untuk melanjutkan ke akun Anda
            </Typography>
        </div>
    )
}

export default HeaderForm