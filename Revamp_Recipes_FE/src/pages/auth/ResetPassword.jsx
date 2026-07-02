/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Form from "../../components/form/Form.jsx";
import Notification from "../../components/notifikasi/Notification.jsx";
import { handleGoogleLogin, resetPassword } from "../../api/authApi.js";

const ResetPassword = () => {
    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [token, setToken] = useState("");
    const [notify, setNotify] = useState({ open: false, message: "", severity: "success" });

    const location = useLocation();
    const navigate = useNavigate();

    // 1. Ambil token dari URL saat halaman di-load
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenFromUrl = params.get("token");
        if (tokenFromUrl) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setToken(tokenFromUrl);
        } else {
            // Jika tidak ada token, tendang balik ke login atau kasih error
            setNotify({ open: true, message: "Token tidak valid atau kadaluarsa", severity: "error" });
        }
    }, [location]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCloseNotify = () => setNotify({ ...notify, open: false });

    // 2. Logika kecocokan password
    const isPasswordMismatch = formData.confirmPassword !== "" &&
        formData.password !== formData.confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi sebelum kirim
        if (formData.password.length < 8) {
            setNotify({ open: true, message: "Password minimal 8 karakter", severity: "error" });
            return;
        }

        if (isPasswordMismatch) {
            setNotify({ open: true, message: "Password tidak cocok!", severity: "error" });
            return;
        }

        try {
            const res = await resetPassword(token, formData.password);
            if (res.success) {
                setNotify({ open: true, message: "Password berhasil diubah! Mengalihkan...", severity: "success" });
                // Redirect ke login setelah 2 detik
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setNotify({ open: true, message: res.message || "Gagal reset password", severity: "error" });
            }
        } catch (error) {
            setNotify({ open: true, message: "Terjadi kesalahan koneksi", severity: "error" });
        }
    };

    const loginFields = [
        { name: 'password', label: 'Password Baru', type: 'password' },
        { name: 'confirmPassword', label: 'Konfirmasi Password Baru', type: 'password' }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50">
            <Form
                type="resetPassword" // Pastikan Form.jsx menghandle type ini
                errorMismatch={isPasswordMismatch}
                loginFields={loginFields}
                formData={formData}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleGoogleLogin={handleGoogleLogin}
            />

            <Notification
                open={notify.open}
                handleClose={handleCloseNotify}
                message={notify.message}
                severity={notify.severity}
            />
        </div>
    );
};

export default ResetPassword;