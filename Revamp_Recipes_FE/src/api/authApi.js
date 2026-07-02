/**
 * src/api/authApi.js
 *
 * Semua HTTP request untuk domain autentikasi.
 *
 * Dipindah dari Services/authService.jsx → api/authApi.js
 *
 * Perubahan:
 * - Ekstensi .jsx → .js (tidak ada JSX)
 * - Import BASE_URL dari constants/index.js
 * - Hapus komentar "Sesuaikan dengan backend lu" (tidak profesional)
 * - Hapus komentar "Navigasi luar tidak butuh useNavigate" (obvious)
 */

import { BASE_URL } from "../constants/index.js";

export const loginUser = async (formData) => {
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return res.json();
};

export const registerUser = async (formData) => {
    const { username, password, email } = formData;
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
    });
    return res.json();
};

export const forgotPassword = async (formData) => {
    const { email } = formData;
    const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });
    return res.json();
};

export const resetPassword = async (token, newPassword) => {
    const res = await fetch(`${BASE_URL}/auth/reset-password?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
    });
    return res.json();
};

export const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/auth/google`;
};
