/* eslint-disable no-unused-vars */
import { Form } from '../../components/form/Form';
import Notification from '../../components/notifikasi/Notification.jsx';
import { useOAuth } from '../../hooks/useOAuth.jsx';
import { registerUser, handleGoogleLogin } from '../../Services/authService.jsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    useOAuth();
    const navigate = useNavigate(); // Inisialisasi navigate
    const [formData, setFormData] = useState({ username: '', password: '', email: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);

    const [notify, setNotify] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const handleCloseNotify = () => setNotify({ ...notify, open: false });

    const isPasswordMismatch = formData.confirmPassword !== "" &&
        formData.password !== formData.confirmPassword;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registerUser(formData);

            if (response?.success) {

                setNotify({
                    open: true,
                    message: "Registrasi akun berhasil, silahkan login!",
                    severity: "success"
                });

                setTimeout(() => {
                    navigate("/login");
                }, 3000)
            } else {
                setNotify({
                    open: true,
                    message: response.message || "Registrasi Gagal!",
                    severity: "error"
                });
            }
        } catch (error) {
            setNotify({
                open: true,
                message: "Gagal menghubungi server. Coba lagi nanti.",
                severity: "error"
            });
        }
    };


    const loginFields = [
        { name: 'username', label: 'Username', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'password', label: 'Password', type: 'password' },
        { name: 'confirmPassword', label: 'Confirm Password', type: 'password' }
    ];

    return (
        <>
            <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50">
                <Form
                    type={'register'}
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
        </>
    )
}

export default Register