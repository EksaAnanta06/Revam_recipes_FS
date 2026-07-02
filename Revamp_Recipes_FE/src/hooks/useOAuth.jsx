/**
 * src/hooks/useOAuth.jsx
 *
 * Hook untuk menangani redirect token setelah Google OAuth di halaman Login/Register.
 *
 * Konteks penggunaan:
 * Ketika user login via Google dari halaman Login atau Register, Google
 * meredirect ke /oauth-success yang ditangani oleh OAuthSuccess.jsx.
 * Hook ini adalah guard tambahan — jika karena suatu alasan token muncul
 * di search params halaman login/register, hook ini akan memprosesnya.
 *
 * Perubahan dari versi lama:
 * - alert("Login Google berhasil 🎉") dihapus
 *   → alert() adalah API browser yang memblokir UI thread, tidak bisa
 *     di-style, dan tidak profesional untuk production app
 * - Navigasi tetap sama: simpan token → redirect ke "/"
 */

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const useOAuth = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            localStorage.setItem("token", token);
            navigate("/", { replace: true });
        }
    }, [searchParams, navigate]);
};
