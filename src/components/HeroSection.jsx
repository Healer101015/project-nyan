import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import asaEsquerda from "../assets/asa-esquerda.png";
import asaDireita from "../assets/asa-direita.png";
import BotaoAnimado from "../components/BotaoAnimado";

// Flutuação central
const flyingSync = {
    translateY: [0, -6, 2, -6, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
};

// Bater de asas
const wingRotation = {
    rotate: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 2.8,
        ease: "easeInOut",
    },
};

// Variantes container
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.25 } },
};

// Entrada de itens
const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" },
    },
};

export default function HeroSection() {
    const prefersReduced = useReducedMotion();

    return (
        <section
            className="relative min-h-[95vh] flex flex-col items-center justify-center text-white overflow-hidden"
            style={{
                background: "linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 50%, #ffffff 100%)",
            }}
        >
            {/* Overlay sutil para contraste */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-sky-500/20 via-sky-300/10 to-transparent"
                aria-hidden="true"
            />

            {/* Conteúdo */}
            <motion.div
                className="relative z-10 text-center max-w-5xl px-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Logo com asas */}
                <motion.div
                    variants={itemVariants}
                    className="flex justify-center items-center gap-4 mb-4"
                    style={{ willChange: "transform" }}
                >
                    <motion.div
                        animate={prefersReduced ? {} : flyingSync}
                        className="flex items-center gap-4"
                    >
                        <motion.img
                            src={asaEsquerda}
                            alt="Asa esquerda"
                            className="w-16 h-16 drop-shadow-lg"
                            animate={prefersReduced ? {} : { rotate: ["-12deg", "-28deg"] }}
                            transition={wingRotation.rotate}
                            aria-hidden="true"
                            draggable={false}
                        />

                        <motion.h1
                            className="text-4xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-sky-500 via-sky-300 to-sky-500 bg-clip-text text-transparent"
                            animate={
                                prefersReduced
                                    ? {}
                                    : {
                                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                    }
                            }
                            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        >
                            Angels
                            <span className="block text-2xl md:text-4xl font-light mt-2 text-sky-800">
                                a solução que caiu do céu
                            </span>
                        </motion.h1>

                        <motion.img
                            src={asaDireita}
                            alt="Asa direita"
                            className="w-16 h-16 drop-shadow-lg"
                            animate={prefersReduced ? {} : { rotate: ["12deg", "28deg"] }}
                            transition={wingRotation.rotate}
                            aria-hidden="true"
                            draggable={false}
                        />
                    </motion.div>
                </motion.div>

                {/* Texto */}
                <motion.p
                    variants={itemVariants}
                    className="mt-6 text-lg md:text-xl font-light max-w-3xl mx-auto drop-shadow-md text-gray-700"
                >
                    A Angels transforma ideias em soluções digitais de alto impacto para
                    seu negócio.
                </motion.p>

                {/* Botão com destaque */}
                <motion.div variants={itemVariants} className="mt-6">
                    <BotaoAnimado />
                </motion.div>
            </motion.div>
        </section>
    );
}
