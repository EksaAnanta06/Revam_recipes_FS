/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, handleGoogleLogin } from '../../Services/authService.jsx';
import { useOAuth } from '../../hooks/useOAuth.jsx';
import { Form } from '../../components/form/Form';
import Notification from '../../components/notifikasi/Notification.jsx';

const Login = () => {
    useOAuth();
    const navigate = useNavigate(); // Inisialisasi navigate
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    const [notify, setNotify] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const handleCloseNotify = () => setNotify({ ...notify, open: false });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(formData);
            if (response.data?.token) {
                localStorage.setItem("token", response.data?.token);
                navigate("/");
            } else {
                setNotify({
                    open: true,
                    message: response.message || "Login Gagal!",
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
        { name: 'password', label: 'Password', type: 'password' }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50">
            <Form
                type={'login'}
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

export default Login;