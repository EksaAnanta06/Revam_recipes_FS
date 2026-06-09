import { useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

const decodeToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        return jwtDecode(token);
    } catch {
        return null;
    }
};

export const useUser = () => {
    // Lazy init sudah baca token saat pertama render — tidak perlu sync ulang di effect
    const [user, setUser] = useState(decodeToken);

    const syncUser = useCallback(() => {
        setUser(decodeToken());
    }, []);

    useEffect(() => {
        // HAPUS syncUser() di sini — lazy init sudah cukup untuk mount pertama
        window.addEventListener("storage", syncUser);
        window.addEventListener("user-updated", syncUser);

        return () => {
            window.removeEventListener("storage", syncUser);
            window.removeEventListener("user-updated", syncUser);
        };
    }, [syncUser]);

    return user;
};