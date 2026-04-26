/* eslint-disable no-unused-vars */
import { Form } from '../../components/form/Form';
import { forgotPassword } from "../../Services/authService.jsx";
import { useState } from "react";
import Notification from "../../components/notifikasi/Notification.jsx";


const ForgotPassword = () => {
    const [formData, setFormData] = useState({ email: '' });
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
            const response = await forgotPassword(formData);

            if (response.success) {
                setNotify({
                    open: true,
                    message: "Link reset password berhasil dikirim ke email!",
                    severity: "success"
                });

                setFormData({ email: '' });
            } else {
                setNotify({
                    open: true,
                    message: response.message || "Email tidak terdaftar.",
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
        { name: 'email', label: 'Masukan Email', type: 'email' }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50">
            <Form
                type={'ForgotPass'}
                loginFields={loginFields}
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />

            <Notification
                open={notify.open}
                handleClose={handleCloseNotify}
                message={notify.message}
                severity={notify.severity}
            />
        </div>
    )
}

export default ForgotPassword;