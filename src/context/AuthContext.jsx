import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [usuario, setUsuario] = useState(
        JSON.parse(localStorage.getItem('usuario')) || null
    );

    const login = (newToken, userData) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('usuario', JSON.stringify(userData));
        setToken(newToken);
        setUsuario(userData);
    };


    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setToken(null);

    };

    return (
        <AuthContext.Provider value={{ token, usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);