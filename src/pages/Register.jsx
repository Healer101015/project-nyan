import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await axios.post('http://localhost:5001/api/register', {
                nome,
                email,
                login,
                password,
            });

            setSuccess('Registro bem-sucedido! Redirecionando para o login...');

            // Espera 2 segundos e redireciona para o login
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            console.error('Erro no registro:', err);
            setError(err.response?.data || 'Erro ao registrar. Verifique os dados.');
        }
    };

    // Estilos (Tailwind) - ATUALIZADO (Roxo)
    const inputStyle = "w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500";
    const labelStyle = "block text-sm font-medium text-gray-300 mb-2";

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-center text-white">
                    Criar Conta
                </h2>

                {error && (
                    <div className="p-3 text-center text-red-300 bg-red-800 bg-opacity-50 rounded-lg">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="p-3 text-center text-green-300 bg-green-800 bg-opacity-50 rounded-lg">
                        {success}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="nome" className={labelStyle}>
                            Nome
                        </label>
                        <input
                            id="nome"
                            type="text"
                            required
                            className={inputStyle}
                            placeholder="Seu Nome Completo"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className={labelStyle}>
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            className={inputStyle}
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="login" className={labelStyle}>
                            Login (Apelido)
                        </label>
                        <input
                            id="login"
                            type="text"
                            required
                            className={inputStyle}
                            placeholder="seu_login_unico"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className={labelStyle}>
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            className={inputStyle}
                            placeholder="•••••••• (mín. 6 caracteres)"
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full mt-2 px-4 py-3 font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-300"
                        >
                            Registrar
                        </button>
                    </div>
                </form>

                <p className="text-sm text-center text-gray-400">
                    Já tem uma conta?{' '}
                    <Link to="/login" className="font-medium text-purple-400 hover:underline">
                        Faça login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;