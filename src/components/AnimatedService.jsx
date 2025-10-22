import React from "react";
import { motion } from "framer-motion";

export default function AnimatedService({ icon, title, desc, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay, duration: 0.7 }}
        >
            <motion.div
                animate={{
                    y: [0, -8, 0],
                }}
                transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: delay,
                }}
                className="p-8 bg-gray-50 border border-gray-200 rounded-3xl shadow hover:shadow-lg transition"
            >
                <div className="text-5xl mb-4">{icon}</div>
                <h3 className="text-2xl font-bold text-sky-700 mb-2">{title}</h3>
                <p className="text-gray-600">{desc}</p>
            </motion.div>
        </motion.div>
    );
}
