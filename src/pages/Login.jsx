import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Importa o contexto

const Login = () => {
    const [loginOrEmail, setLoginOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); // Pega a função de login do contexto

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpa erros anteriores

        try {
            // A função login do AuthContext fará a chamada de API
            await login(loginOrEmail, password);

            // Redireciona para a Home após o login bem-sucedido
            navigate('/');
        } catch (err) {
            console.error('Erro no login:', err);
            // Define uma mensagem de erro amigável
            setError(err.response?.data || 'Login ou senha inválidos.');
        }
    };

    // Estilos (Tailwind)
    const inputStyle = "w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500";
    const labelStyle = "block text-sm font-medium text-gray-300 mb-2";

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-center text-white">
                    Login - Project Nyan
                </h2>

                {error && (
                    <div className="p-3 text-center text-red-300 bg-red-800 bg-opacity-50 rounded-lg">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="loginOrEmail" className={labelStyle}>
                            Login ou Email
                        </label>
                        <input
                            id="loginOrEmail"
                            name="loginOrEmail"
                            type="text"
                            required
                            className={inputStyle}
                            placeholder="seu_login ou seu@email.com"
                            value={loginOrEmail}
                            onChange={(e) => setLoginOrEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className={labelStyle}>
                            Senha
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className={inputStyle}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-3 font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition duration-300"
                        >
                            Entrar
                        </button>
                    </div>
                </form>

                <p className="text-sm text-center text-gray-400">
                    Não tem uma conta?{' '}
                    <Link to="/register" className="font-medium text-cyan-400 hover:underline">
                        Registre-se
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;