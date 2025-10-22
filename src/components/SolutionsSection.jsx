// src/components/SolutionsSection.jsx
import React from "react";
import { motion } from "framer-motion";
import FlyingWings from "./FlyingWings";
import BotaoAnimado from "./BotaoAnimado";

const servicesData = [
    {
        icon: "🌐",
        title: "Criação de Sites",
        desc: "Sites modernos, rápidos e responsivos para destacar sua marca online.",
    },
    {
        icon: "📱",
        title: "Apps Android e iOS",
        desc: "Aplicativos mobile sob medida com foco em usabilidade e inovação.",
    },
    {
        icon: "⚙️",
        title: "Soluções Personalizadas",
        desc: "Sistemas completos de acordo com a necessidade do seu projeto.",
    },
];

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.25 } },
};

const itemVariants = {
    hidden: (i) => ({
        opacity: 0,
        x: i % 2 === 0 ? -80 : 80,
        y: Math.floor(Math.random() * 50),
    }),
    visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: { duration: 0.7, ease: "easeOut" },
    },
};

const ServiceCard = ({ icon, title, desc, custom }) => {
    return (
        <motion.div
            variants={itemVariants}
            custom={custom}
            animate={{
                y: [0, -4, 0, -2, 0],
            }}
            transition={{
                duration: 5 + custom,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            whileHover={{
                scale: 1.08,
                rotateX: 3,
                rotateY: -3,
                boxShadow: "0 20px 35px rgba(14, 165, 233, 0.35)",
            }}
            whileTap={{ scale: 0.96 }}
            className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 text-center flex flex-col items-center cursor-pointer w-full max-w-[280px] transition-all duration-300"
        >
            <div className="text-5xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold text-sky-800 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{desc}</p>
        </motion.div>
    );
};

export default function SolutionsSection() {
    return (
        <section
            id="solucoes"
            className="relative bg-gradient-to-b from-gray-100 via-white to-gray-50 py-24 px-6 overflow-hidden"
        >
            {/* Camada de luz suave */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-100/40 via-transparent to-sky-200/30" />

            <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                {/* Coluna Esquerda */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-6"
                >
                    <FlyingWings>
                        <span className="bg-gradient-to-r from-sky-500 via-sky-300 to-sky-500 bg-clip-text text-transparent animate-pulse">
                            Nossas Soluções
                        </span>
                    </FlyingWings>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-gray-600 text-lg leading-relaxed"
                    >
                        Potencialize sua presença online com tecnologia inteligente e soluções visuais modernas.
                        Da criação de sites ao desenvolvimento de apps, oferecemos tudo que seu negócio precisa
                        para se destacar.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <BotaoAnimado href="#contato">Solicitar Orçamento</BotaoAnimado>
                    </motion.div>
                </motion.div>

                {/* Coluna Direita - Cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="flex flex-wrap gap-6 justify-center"
                >
                    {servicesData.map((item, index) => (
                        <ServiceCard
                            key={index}
                            icon={item.icon}
                            title={item.title}
                            desc={item.desc}
                            custom={index}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
