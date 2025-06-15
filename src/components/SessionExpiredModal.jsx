
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

export const SessionExpiredModal = () => {
    const { logout } = useAuth();

    const showExpiredModal = () => {
        Swal.fire({
            title: 'Sesión Expirada',
            text: 'Tu sesión ha expirado. Por favor, ingresa de nuevo.',
            icon: 'warning',
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then(() => {
            logout(); // Redirige al login
        });
    };

    // Verificar errores 401 en peticiones fetch
    useEffect(() => {
        const originalFetch = window.fetch;
        
        window.fetch = async (...args) => {
            const response = await originalFetch(...args);
            
            if (response.status === 401) {
                showExpiredModal();
                throw new Error("Token expired");
            }
            
            return response;
        };

        return () => {
            window.fetch = originalFetch; // Restaurar fetch original
        };
    }, []);

    return null;
};