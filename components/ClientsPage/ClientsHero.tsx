"use client";

import { motion } from "framer-motion";
import React from "react";

export default function ClientsHero() {
    return (
        <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 px-6 md:px-12 lg:px-24 overflow-hidden flex flex-col items-center">
            {/* Background floating elements */}
            <motion.div
                animate={{
                    y: [0, -30, 0],
                    opacity: [0.1, 0.25, 0.1]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-1/4 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-[#E31E24] rounded-full blur-[120px] md:blur-[180px] -translate-y-1/2 pointer-events-none"
            />
            <motion.div
                animate={{
                    y: [0, 40, 0],
                    opacity: [0.05, 0.15, 0.05]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-0 left-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-white rounded-full blur-[100px] md:blur-[150px] translate-y-1/2 pointer-events-none"
            />

            <div className="max-w-[1400px] mx-auto relative z-10 w-full flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center max-w-5xl"
                >
                    {/* Glassmorphic Pill */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "backOut" }}
                        className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
                    >
                        <span className="w-2 h-2 rounded-full bg-[#E31E24] animate-pulse" />
                        <span className="text-white/80 font-bold tracking-[0.2em] uppercase text-xs md:text-sm">
                            Valued Partnerships
                        </span>
                        <span className="w-2 h-2 rounded-full bg-[#E31E24] animate-pulse" />
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1] mb-6">
                        OUR <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#E31E24] to-red-600">CLIENTS.</span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        className="text-lg md:text-2xl text-white/60 max-w-3xl leading-relaxed font-light"
                    >
                        We are proud to partner with leading organizations to drive performance, build strong leadership, and create lasting, measurable impact.
                    </motion.p>
                </motion.div>

                {/* Decorative Line Component */}
                <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                    className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-16 md:mt-24 origin-center"
                />
            </div>
        </section>
    );
}
