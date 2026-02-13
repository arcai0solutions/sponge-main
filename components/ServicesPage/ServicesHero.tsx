
"use client";

import { motion } from "framer-motion";
import React from "react";

export default function ServicesHero() {
    return (
        <section className="relative h-[60vh] md:h-[70vh] flex items-end pb-20 px-6 md:px-12 lg:px-20 bg-black overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />

            {/* Animated Gradient Orb (Optional High-end Feel) */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#E31E24] rounded-full filter blur-[150px] opacity-20 animate-pulse" />

            <div className="relative z-20 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6">
                        BUILT FOR <br />
                        <span className="text-[#E31E24]">IMPACT.</span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-xl md:text-2xl text-gray-400 max-w-2xl leading-relaxed"
                >
                    Our services are designed around business priorities, role expectations, and capability gaps. We tailor every engagement to your context, audience, and success measures.
                </motion.p>
            </div>
        </section>
    );
}
