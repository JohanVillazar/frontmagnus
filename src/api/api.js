import { useAuth } from '../context/AuthContext'; 

const baseURL = "https://backmagnus-production.up.railway.app/api";

export const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
        Authorization: `Bearer ${token}`,
    };

    const response = await fetch(`${baseURL}${url}`, {
        ...options,
        headers,
    });

    // Si el token expiró (401), lanzar modal y redirigir
    if (response.status === 401) {
        throw new Error("Unauthorized");
    }

    return response;
};