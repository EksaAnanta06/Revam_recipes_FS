import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const useUser = () => {
    // 1. Inisialisasi state langsung dengan fungsi (Lazy Initial State)
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                return jwtDecode(token);
            } catch (error) {
                console.error("Invalid token:", error);
                return null;
            }
        }
        return null; // Kalau gak ada token, otomatis default-nya null
    });

    // 2. useEffect sekarang cuma bertugas sinkronisasi kalau ada perubahan di luar (opsional)
    useEffect(() => {
        const handleStorageChange = () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setUser(null);
            } else {
                try {
                    setUser(jwtDecode(token));
                } catch {
                    setUser(null);
                }
            }
        };

        // Dengerin perubahan localStorage (bila perlu, misal user logout di tab sebelah)
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return user;
};