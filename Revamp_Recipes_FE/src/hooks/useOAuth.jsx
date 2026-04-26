import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const useOAuth = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
       
        const token = searchParams.get("token");

        if (token) {
            localStorage.setItem("token", token);
            alert("Login Google berhasil 🎉");
            navigate("/", { replace: true });
        }
    }, [searchParams, navigate]); 
};