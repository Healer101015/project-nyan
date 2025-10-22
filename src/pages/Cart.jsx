import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);

  const [cepDestino, setCepDestino] = useState("");
  const [frete, setFrete] = useState(null);
  const [loadingFrete, setLoadingFrete] = useState(false);
  const [erroFrete, setErroFrete] = useState("");

  const handleQuantityChange = (id, e) => {
    const value = parseInt(e.target.value);
    if (value > 0) updateQuantity(id, value);
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const calcularFrete = async () => {
    if (!cepDestino || cepDestino.length < 8) {
      alert("Digite um CEP válido.");
      return;
    }

    const pesoTotal = cart.reduce(
      (sum, item) => sum + (item.weight || 0.5) * item.quantity,
      0
    );

    const comprimento = 20;
    const altura = 10;
    const largura = 15;

    try {
      setLoadingFrete(true);
      setErroFrete("");

      const url = new URL("http://localhost:4000/api/frete");
      url.searchParams.set("cepDestino", cepDestino.replace("-", ""));
      url.searchParams.set("peso", pesoTotal.toFixed(2));
      url.searchParams.set("comprimento", comprimento);
      url.searchParams.set("altura", altura);
      url.searchParams.set("largura", largura);

      const res = await fetch(url);
      const data = await res.json();

      if (data.error) {
        setErroFrete(data.error);
        setFrete(null);
      } else {
        setFrete({ valor: data.valor, prazo: data.prazo });
      }
    } catch (err) {
      setErroFrete("Erro ao calcular frete.");
      setFrete(null);
    } finally {
      setLoadingFrete(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold mb-10 text-center uppercase"
          style={{ fontFamily: "Teko, sans-serif" }}
        >
          Seu Carrinho ({cart.length} {cart.length === 1 ? "Item" : "Itens"})
        </motion.h2>

        {cart.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">
            Seu carrinho está vazio.
          </p>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900/90 rounded-2xl shadow-lg p-6"
          >
            <ul>
              {cart.map((item) => (
                <li
                  key={item._id}
                  className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-700 py-4 gap-6"
                >
                  {/* Produto */}
                  <div className="flex items-center gap-4 flex-1">
                    <img
                      src={item.imageUrl || "https://via.placeholder.com/100"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl border border-gray-700"
                    />
                    <div>
                      <h3 className="font-semibold text-red-600">{item.name}</h3>
                      <p className="text-sm text-gray-400">
                        {item.description && item.description.length > 60
                          ? item.description.slice(0, 57) + "..."
                          : item.description || ""}
                      </p>
                      {item.brand && (
                        <p className="text-xs font-bold mt-1 text-gray-300">
                          {item.brand}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Preço e Quantidade */}
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-red-500">
                      R$ {item.price.toFixed(2)}
                    </span>
                    <div className="flex items-center">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item._id,
                            item.quantity > 1 ? item.quantity - 1 : 1
                          )
                        }
                        className="px-2 py-1 border border-red-500 text-red-500 font-bold rounded-l hover:bg-red-500 hover:text-white transition"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item._id, e)}
                        className="w-12 text-center border-y border-red-500 text-red-500 bg-black"
                      />
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                        className="px-2 py-1 border border-red-500 text-red-500 font-bold rounded-r hover:bg-red-500 hover:text-white transition"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-bold text-red-500">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Remover */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-600 hover:text-red-400 text-xl font-bold"
                    title="Remover item"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>

            {/* CEP e Frete */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
              <input
                type="text"
                placeholder="Digite seu CEP"
                value={cepDestino}
                onChange={(e) => setCepDestino(e.target.value)}
                className="border border-gray-700 px-4 py-2 rounded-lg w-60 focus:outline-none focus:ring-2 focus:ring-red-600 bg-black text-white"
              />
              <button
                onClick={calcularFrete}
                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-500 transition"
              >
                {loadingFrete ? "Calculando..." : "Calcular Frete"}
              </button>
              {frete && (
                <div className="text-red-500 font-semibold">
                  Frete: R$ {frete.valor.toFixed(2)} (Prazo: {frete.prazo} dias úteis)
                </div>
              )}
              {erroFrete && (
                <div className="text-red-400 font-semibold">{erroFrete}</div>
              )}
            </div>

            {/* Total e Ações */}
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center border-t border-gray-700 pt-6">
              <div className="text-lg font-bold text-red-500 mb-4 sm:mb-0">
                Subtotal: R$ {totalPrice.toFixed(2)} <br />
                {frete && (
                  <>
                    Frete: R$ {frete.valor.toFixed(2)} <br />
                    <span className="text-2xl">
                      Total: R$ {(totalPrice + frete.valor).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
              <div className="flex gap-4">
                <Link
                  to="/"
                  className="border border-red-500 text-red-500 px-5 py-2 rounded-lg hover:bg-red-500 hover:text-white transition"
                >
                  Continuar comprando
                </Link>
                <Link
                  to="/checkout"
                  className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-500 transition"
                >
                  Finalizar compra
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}
