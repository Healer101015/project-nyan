import { ShoppingCart } from "lucide-react";
import logo from "../assets/gatoa-logo.jpg"; // logo que você já tem

const Navbar = () => {
  return (
    <>
      {/* Navbar fixa no topo */}
      <nav className="fixed top-0 left-0 w-full bg-black py-4 px-6 flex justify-between items-center z-50">
        {/* Logo */}
        <a href="/" className="flex-shrink-0">
          <img src={logo} alt="Gatoa Logo" className="h-10 w-auto" />
        </a>

        {/* Links do meio */}
        <ul className="hidden md:flex items-center gap-12 text-white font-semibold text-[15px]">
          <li>
            <a href="#quem-somos" className="hover:text-gray-300 transition-colors">
              Quem somos
            </a>
          </li>
          <li>
            <a href="#loja" className="hover:text-gray-300 transition-colors">
              Loja
            </a>
          </li>
          <li>
            <a href="#anime-news" className="hover:text-gray-300 transition-colors">
              AnimeNews
            </a>
          </li>
          <li>
            <a href="#contato" className="hover:text-gray-300 transition-colors">
              Contato
            </a>
          </li>
        </ul>

        {/* Lado direito */}
        <div className="hidden md:flex items-center gap-3 text-white font-semibold text-[15px]">
          <a href="/login" className="hover:text-gray-300 transition-colors">
            Login
          </a>
          <span className="text-gray-400">|</span>
          <span>R$0,00</span>
          <a href="/cart" className="ml-1 hover:text-gray-300 transition-colors">
            <ShoppingCart size={20} />
          </a>
        </div>
      </nav>

      {/* Espaço para não sobrepor o conteúdo */}
      <div className="pt-16"></div>
    </>
  );
};

export default Navbar;