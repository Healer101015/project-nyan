// src/components/Navbar.jsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"; // (instale @heroicons/react)

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 text-white shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo e Links Principais */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-2xl font-bold text-purple-400">
              Project Nyan
            </Link>
            <div className="hidden sm:flex space-x-4">
              <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Início
              </Link>
              {/* Você pode adicionar "Listas", "Gêneros", etc. aqui */}
            </div>
          </div>

          {/* Busca (Aparência) */}
          <div className="flex-1 px-4 max-w-md hidden sm:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar mangás..."
                className="w-full bg-gray-900 border border-gray-700 rounded-full px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Links do Usuário */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Link
                  to={`/profile/${user.login}`} // Link para o perfil
                  className="bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-md text-sm font-medium"
                >
                  {user.nome}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white text-sm font-medium"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-md text-sm font-medium"
                >
                  Criar Conta
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}