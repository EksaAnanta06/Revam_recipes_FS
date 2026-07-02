import { TextField, Button, Typography, Paper, InputAdornment, IconButton, Box, Link } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import HeaderForm from './Header';
import Footer from './Footer.jsx';
import IconContainer from './IconContainer.jsx';
import { validateEmail } from '../../utils/validators.js'

export const Form = ({
    errorMismatch,
    type,
    loginFields,
    formData,
    handleChange,
    handleSubmit,
    handleGoogleLogin,
    showPassword,
    setShowPassword
}) => {
    const isLogin = type === 'login';
    const isRegister = type === 'register';
    const isReset = type === 'resetPassword';
    const isForgot = type === 'forgotPass'; 

    return (
        <Box className="w-full max-w-md">
            <IconContainer />
            <Paper elevation={0}>
                <HeaderForm type={type} /> {/* Pastikan HeaderForm terima type */}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {loginFields.map((field) => {
                        const value = formData[field.name] || "";
                        const isPassword = field.type === 'password';
                        const isConfirmField = field.name === 'confirmPassword';

                        let errorMsg = "";
                        if (field.name === "username" && value.length > 0 && value.length < 4) {
                            errorMsg = "Minimal 4 karakter";
                        } else if (field.name === "password" && value.length > 0 && value.length < 8) {
                            errorMsg = "Minimal 8 karakter";
                        } else if (isConfirmField && errorMismatch) {
                            errorMsg = "Password tidak sama";
                        } else if (field.type === "email" && value.length > 0 && !validateEmail(value)) {
                            errorMsg = "Format email tidak valid";
                        }

                        return (
                            <TextField
                                key={field.name}
                                name={field.name}
                                label={field.label}
                                type={isPassword ? (showPassword ? 'text' : 'password') : (field.type === 'email' ? 'email' : field.type)}
                                value={value}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                required
                                error={Boolean(errorMsg)}
                                helperText={errorMsg}
                                sx={{
                                    mb: 1.5,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        backgroundColor: '#f8fafc',
                                    }
                                }}
                                slotProps={isPassword ? {
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                } : {}}
                            />
                        );
                    })}

                   
                    {isLogin && (
                        <div className="flex justify-center">
                            <Link href="/forgot-password" underline="hover" className="text-sm text-blue-600 font-medium">
                                Lupa Password?
                            </Link>
                        </div>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                            borderRadius: '12px',
                            py: 1.5,
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                    >
                        {isLogin ? "Masuk" : isRegister ? "Daftar" : isReset ? "Ubah Password" : "Kirim Link"}
                    </Button>
                </form>

                {/* LOGIKA DINAMIS BAGIAN BAWAH */}
                {!isForgot && !isReset ? (
                    <>
                        <div className="mt-6 text-center">
                            <Typography variant="body2" className="text-gray-600">
                                {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{' '}
                                <Link
                                    href={isLogin ? `/register` : `/login`}
                                    underline="hover"
                                    className="text-blue-600 font-semibold"
                                >
                                    {isLogin ? "Daftar sekarang" : "Login"}
                                </Link>
                            </Typography>
                        </div>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">atau</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button
                                onClick={handleGoogleLogin}
                                variant="outlined"
                                fullWidth
                                sx={{ borderRadius: '12px', textTransform: 'none' }}
                            >
                                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-3" />
                                Lanjutkan dengan Google
                            </Button>
                        </div>
                    </>
                ) : (
                    /* Tombol Kembali khusus untuk Lupa Password atau Reset Password */
                    <div className="mt-6 text-center">
                        <Link href="/login" underline="hover" className="text-sm text-blue-600 font-medium">
                            Kembali ke Halaman Login
                        </Link>
                    </div>
                )}
            </Paper>
            <Footer />
        </Box>
    );
}

export default Form