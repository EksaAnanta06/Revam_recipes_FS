import { BASE_URL } from "../utils/constants";


export const loginUser = async (formData) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        signal: controller.signal
    });

    clearTimeout(timeoutId);
    return res.json();
};

export const registerUser = async (formData) => {
    const { username, password, email } = formData
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    });

    return res.json();
}

export const forgotPassword = async (formData) => {
    const { email } = formData
    const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });

    return res.json();
}

export const resetPassword = async (token, newPassword) => {
    // Token dikirim via Query String, Password via Body
    const res = await fetch(`${BASE_URL}/auth/reset-password?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }) // Sesuaikan dengan backend lu
    });
    return res.json();
};

export const handleGoogleLogin = () => {
    // Navigasi luar (window.location) tidak butuh useNavigate
    window.location.href = `${BASE_URL}/auth/google`;
};
