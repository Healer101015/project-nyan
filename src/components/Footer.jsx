import React from 'react';
import logo from '../assets/gatoa-logo.jpg';
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterestP, FaTiktok } from 'react-icons/fa';
import { CheckCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 font-sans border-t border-gray-800 mt-auto">
      <div className="container mx-auto px-6 py-12">
        {/* Seção Principal do Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

          {/* Coluna 1: Logo e Vantagens */}
          <div className="lg:col-span-2">
            <img src={logo} alt="Gatoa Logo" className="h-10 w-auto mb-4" style={{ filter: 'brightness(0) invert(1)' }} />
            <h3 className="font-bold text-white uppercase mb-3" style={{ fontFamily: 'Teko, sans-serif' }}>
              Por que comprar com a gente?
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-red-500" />
                Frete grátis acima de R$200,00
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-red-500" />
                Garantia de 3 meses
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-red-500" />
                Brinde exclusivo na primeira compra
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-red-500" />
                Pagamentos seguros com criptografia SLL
              </li>
            </ul>
          </div>

          {/* Coluna 2: Pedidos */}
          <div>
            <h3 className="font-bold text-white uppercase mb-3" style={{ fontFamily: 'Teko, sans-serif' }}>
              Pedidos
            </h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Compras</a></li>
              <li><a href="#" className="hover:text-white">Entregas</a></li>
              <li><a href="#" className="hover:text-white">Trocas</a></li>
              <li><a href="#" className="hover:text-white">Reembolso</a></li>
            </ul>
          </div>

          {/* Coluna 3: Links */}
          <div>
            <h3 className="font-bold text-white uppercase mb-3" style={{ fontFamily: 'Teko, sans-serif' }}>
              Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Sobre</a></li>
              <li><a href="#" className="hover:text-white">AnimeNews</a></li>
              <li><a href="#" className="hover:text-white">Contato</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>

          {/* Coluna 4: Fique por dentro */}
          <div>
            <h3 className="font-bold text-white uppercase mb-3" style={{ fontFamily: 'Teko, sans-serif' }}>
              Fique por dentro
            </h3>
            <form>
              <input
                type="email"
                placeholder="Insira o seu e-mail aqui"
                className="w-full bg-transparent border border-gray-600 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-white"
              />
            </form>
            <div className="flex space-x-4 mt-4">
              <a href="#" aria-label="Facebook" className="hover:text-white"><FaFacebookF /></a>
              <a href="#" aria-label="Twitter" className="hover:text-white"><FaTwitter /></a>
              <a href="#" aria-label="Instagram" className="hover:text-white"><FaInstagram /></a>
              <a href="#" aria-label="Pinterest" className="hover:text-white"><FaPinterestP /></a>
              <a href="#" aria-label="TikTok" className="hover:text-white"><FaTiktok /></a>
            </div>
          </div>
        </div>

        {/* Seção de Pagamento e Selos */}
        <div className="border-t border-gray-800 mt-8 pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-white uppercase mb-3" style={{ fontFamily: 'Teko, sans-serif' }}>
              Métodos de Pagamento
            </h3>
            {/* Adicione os ícones dos cartões aqui quando os tiver */}
            <p className="text-sm">PIX - CARTÃO - BOLETO</p>
          </div>
          <div>
            <h3 className="font-bold text-white uppercase mb-3" style={{ fontFamily: 'Teko, sans-serif' }}>
              Trusted Store
            </h3>
            {/* Adicione o selo aqui quando o tiver */}
            <p className="text-sm">Compra Segura</p>
          </div>
        </div>


        {/* Copyright e Links Finais */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-gray-500 mb-4 md:mb-0">Copyright GatoaStore</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white">Privacidade</a>
            <a href="#" className="hover:text-white">Termos</a>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;