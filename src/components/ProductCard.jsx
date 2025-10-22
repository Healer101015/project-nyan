import React, { useContext } from "react";
import { motion } from "framer-motion";
import { CartContext } from "../context/CartContext";

export default function ProductCard({ product }) {
    const { addToCart } = useContext(CartContext);

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-black text-white flex flex-col w-[300px]"
        >
            {/* Imagem */}
            <motion.img
                src={product.imageUrl || "https://via.placeholder.com/300x400"}
                alt={product.name}
                className="w-full h-[400px] object-cover"
            />

            {/* Conteúdo */}
            <div className="px-3 py-4 flex flex-col items-start">
                {/* Nome */}
                <h3
                    className="text-base font-normal leading-snug"
                    style={{ fontFamily: 'Teko, sans-serif' }}
                >
                    {product.name}
                </h3>

                {/* Preço alinhado à esquerda */}
                <p
                    className="text-lg font-semibold mt-2"
                    style={{ fontFamily: 'Teko, sans-serif' }}
                >
                    R$ {product.price.toFixed(2)}
                </p>

                {/* Botão logo abaixo, alinhado à esquerda */}
                <button
                    onClick={() => addToCart(product)}
                    className="mt-3 border border-white bg-black text-white px-4 py-2 text-xs font-semibold uppercase hover:bg-white hover:text-black transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                >
                    Adicione ao carrinho
                </button>
            </div>
        </motion.div>
    );
}