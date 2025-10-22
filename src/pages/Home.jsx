import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import avatar from "../assets/gatoa-logo.jpg";

// Imagens
import gatoa1 from "../assets/gatoa1.jpg";
import gatoa2 from "../assets/gatoa2.jpg";
import gatoa3 from "../assets/gatoa3.jpg";
import gatoa4 from "../assets/gatoa4.jpg";
import gatoa5 from "../assets/gatoa5.jpg";
import gatoa6 from "../assets/gatoa6.jpg";
import gatoa7 from "../assets/gatoa7.jpg";
import gatoa8 from "../assets/gatoa8.jpg";
import hero from "../assets/hero.png";
import hero2 from "../assets/hero1.png";

const products = [
  { _id: "1", name: "The Evil. Camisa Oversized", price: 99.0, imageUrl: gatoa1 },
  { _id: "2", name: "Makima - Camisa Oversized", price: 99.0, imageUrl: gatoa2 },
  { _id: "3", name: "Nika - Camisa Oversized", price: 99.0, imageUrl: gatoa3 },
  { _id: "4", name: "Gojo - Camisa Oversized", price: 99.0, imageUrl: gatoa4 },
  { _id: "5", name: "Produto 5 - Camisa Oversized", price: 99.0, imageUrl: gatoa5 },
  { _id: "6", name: "Produto 6 - Camisa Oversized", price: 99.0, imageUrl: gatoa6 },
  { _id: "7", name: "Produto 7 - Camisa Oversized", price: 99.0, imageUrl: gatoa7 },
  { _id: "8", name: "Produto 8 - Camisa Oversized", price: 99.0, imageUrl: gatoa8 },
];

const feedbacks = [
  {
    name: "Pedro",
    location: "Salvador, BA",
    comment: "Melhor camisa de anime que eu já comprei!! Veste super bem, indico a todos. Melhor loja!!",
    avatar,
  },
  {
    name: "Julia",
    location: "São Paulo, SP",
    comment: "Qualidade surreal, chegou super rápido. Com certeza comprarei de novo!",
    avatar,
  },
  {
    name: "Carlos",
    location: "Rio de Janeiro, RJ",
    comment: "Atendimento incrível, camisa confortável e com caimento perfeito!",
    avatar,
  },
  {
    name: "Ana",
    location: "Belo Horizonte, MG",
    comment: "Minha camisa favorita do guarda-roupa. Nota 10!",
    avatar,
  },
];

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="flex flex-col min-h-screen bg-black font-sans text-white">
      <Navbar />

      <main>
        {/* Hero Section 1 */}
        <section
          className="relative h-[80vh] bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: `url(${hero})` }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <motion.div
            className="relative z-10 text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl font-extrabold uppercase" style={{ fontFamily: "Teko, sans-serif" }}>
              Estilo <span className="text-red-600">Sem Limites</span>
            </h1>
            <p className="mt-4 text-lg max-w-xl mx-auto">Vista o que você ama. Sinta a diferença das camisetas oversized mais estilosas.</p>

          </motion.div>
        </section>

        {/* Novo Drop */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-extrabold uppercase" style={{ fontFamily: "Teko, sans-serif" }}>
              <span className="text-red-600">Novo</span> Drop
            </h2>
            <div className="mt-6 inline-block bg-white text-black px-6 py-4 rounded-xl shadow-lg">
              <p className="text-lg">Use o cupom</p>
              <p className="text-3xl font-extrabold text-red-600 tracking-widest">GATOAIO</p>
              <p className="text-sm font-medium">e ganhe <span className="font-bold">10% de desconto!</span></p>
            </div>
          </div>

          <div className="mt-12 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <motion.div
                key={product._id}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Hero Section 2 */}
        <section
          className="relative h-[60vh] bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: `url(${hero2})` }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </section>

        {/* Mais Vendidos */}
        <section id="camisetas" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.h2
              className="text-4xl font-extrabold mb-12 uppercase"
              style={{ fontFamily: "Teko, sans-serif" }}
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Mais Vendidos <span className="text-red-600">Pra você ficar no estilo</span>
            </motion.h2>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {products.concat(products).map((product, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Feedbacks */}
        <section className="py-20" style={{ backgroundColor: "#d35944" }}>
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-xl uppercase" style={{ fontFamily: "Teko, sans-serif" }}>
              Clientes
            </h3>
            <h2 className="text-5xl font-extrabold uppercase" style={{ fontFamily: "Teko, sans-serif" }}>
              Feedbacks
            </h2>

            <motion.div
              className="flex gap-6 mt-12 overflow-x-auto snap-x snap-mandatory pb-6 scrollbar-hide"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {feedbacks.map((feedback, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-transparent min-w-[280px] snap-center p-6 rounded-xl border border-white flex flex-col justify-between shadow-lg"
                >
                  <p className="text-white italic text-left mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                    "{feedback.comment}"
                  </p>
                  <div className="flex items-center gap-4">
                    <img src={feedback.avatar} alt={feedback.name} className="w-12 h-12 rounded-full bg-black" />
                    <div className="text-left">
                      <p className="font-bold text-white" style={{ fontFamily: "Teko, sans-serif" }}>
                        {feedback.name}
                      </p>
                      <p className="text-sm text-white" style={{ fontFamily: "Teko, sans-serif" }}>
                        {feedback.location}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
