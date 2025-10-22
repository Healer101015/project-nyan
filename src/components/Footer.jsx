// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    // O 'mt-auto' ajuda a empurrar o footer para o final da página 
    // se o conteúdo for curto (requer flex-col min-h-screen no layout principal)
    <footer className="w-full bg-gray-800 text-gray-400 mt-auto border-t border-gray-700 shadow-inner">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">

          {/* Copyright e Nome */}
          <div className="text-center md:text-left mb-3 md:mb-0">
            <p>
              <span className="font-bold text-gray-300">Project Nyan</span>
              {' '}© {new Date().getFullYear()}.
            </p>
            <p className="text-xs">
              Um catálogo de mangás feito por fãs, para fãs.
            </p>
          </div>

          {/* Links de Navegação */}
          <div className="flex space-x-6 font-medium">
            <Link to="/about" className="hover:text-purple-400 transition-colors duration-200">
              Sobre
            </Link>
            <Link to="/privacy" className="hover:text-purple-400 transition-colors duration-200">
              Privacidade
            </Link>
            <Link to="/terms" className="hover:text-purple-400 transition-colors duration-200">
              Termos de Uso
            </Link>
            {/* Você pode adicionar um link para o GitHub do projeto se for open-source */}
            {/* <a href="https://github.com/seu-usuario/project-nyan" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors duration-200">
              GitHub
            </a> */}
          </div>
        </div>
      </div>
    </footer>
  );
}