import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/gatoa-logo.jpg";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const register = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:4000/api/register", { email, password });
            alert("Usuário criado com sucesso!");
            navigate("/login"); // redireciona para login
        } catch (err) {
            alert("Erro ao registrar. Tente novamente.");
        }
    };

    return (
        <div className="bg-black text-white min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-xl p-8 border border-zinc-800">

                {/* Logo e título */}
                <div className="flex flex-col items-center mb-8">
                    <img
                        src={logo}
                        alt="Logo"
                        className="w-20 h-20 rounded-full border-2 border-red-600 mb-4"
                    />
                    <h2
                        className="text-3xl font-extrabold uppercase text-center"
                        style={{ fontFamily: "Teko, sans-serif" }}
                    >
                        Criar <span className="text-red-600">Conta</span>
                    </h2>
                </div>

                {/* Formulário */}
                <form onSubmit={register} className="space-y-6">
                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Digite seu email"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-red-600"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Senha</label>
                        <input
                            type="password"
                            placeholder="Digite sua senha"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-red-600"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 transition text-white font-bold py-2 rounded-xl shadow-lg"
                    >
                        Registrar
                    </button>
                </form>

                {/* Extra */}
                <p className="text-sm text-center text-zinc-400 mt-6">
                    Já tem uma conta?{" "}
                    <a
                        href="/login"
                        className="text-red-500 hover:underline font-semibold"
                    >
                        Entrar
                    </a>
                </p>
            </div>
        </div>
    );
}
