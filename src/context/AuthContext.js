import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Criar o Contexto
export const AuthContext = createContext();

// 2. Criar o Provedor
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true); // Estado de carregamento inicial

    // Efeito para carregar o usuário do localStorage na inicialização
    useEffect(() => {
        const loadUserFromStorage = () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                const userData = JSON.parse(storedUser);
                setToken(storedToken);
                setUser(userData);
                setIsAdmin(userData.isAdmin);

                // Define o token no header padrão do axios para futuras requisições
                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            }
            setLoading(false);
        };

        loadUserFromStorage();
    }, []);

    // Função de Login
    const login = async (loginOrEmail, password) => {
        try {
            const res = await axios.post('http://localhost:5001/api/login', {
                loginOrEmail,
                password,
            });

            const { token, user } = res.data;

            // Salvar no localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Definir estado
            setToken(token);
            setUser(user);
            setIsAdmin(user.isAdmin);

            // Definir header padrão do axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return user; // Retorna o usuário em caso de sucesso
        } catch (error) {
            // Limpa o estado/storage em caso de erro de login
            logout();
            // Re-lança o erro para a página de Login tratar
            throw error;
        }
    };

    // Função de Logout
    const logout = () => {
        // Limpar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Limpar estado
        setToken(null);
        setUser(null);
        setIsAdmin(false);

        // Remover header padrão do axios
        delete axios.defaults.headers.common['Authorization'];
    };

    // 3. Fornecer o contexto para os componentes filhos
    // Não renderiza os filhos até que o carregamento inicial (do localStorage) esteja completo
    if (loading) {
        return <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">Carregando sessão...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, token, isAdmin, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};