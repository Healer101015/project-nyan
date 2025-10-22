// src/components/PrivateRouteAdmin.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRouteAdmin = ({ children }) => {
    const { isAdmin, loading } = useContext(AuthContext);

    // Espera o AuthContext carregar a informação (evita piscar a tela)
    if (loading) {
        return <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">Verificando permissões...</div>;
    }

    // Se não estiver carregando e for admin, mostra a página.
    // Se não for admin, redireciona para a Home.
    return isAdmin ? children : <Navigate to="/" />;
};

export default PrivateRouteAdmin;