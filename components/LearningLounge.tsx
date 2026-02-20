"use client";

import { motion } from "framer-motion";
import NextImage from "next/image";
import React from "react";

export default function LearningLounge() {
    return (
        <section className="bg-black relative py-24 md:py-32 overflow-hidden border-t border-white/5">

            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
            <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col gap-8 items-center"
                    >
                        <div>
                            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-2">
                                The Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">Lounge.</span>
                            </h2>
                            <p className="text-zinc-500 text-lg uppercase tracking-widest font-medium">
                                A Community of Practice
                            </p>
                        </div>

                        <div className="space-y-6 text-lg text-zinc-400 leading-relaxed max-w-2xl">
                            <p>
                                Imagine a space where curiosity connects with conversation. The Learning Lounge will be our exclusive hub for thought leadership, industry insights, and continuous dialogue.
                            </p>
                            <p>
                                From expert interviews to interactive webinars and peer-to-peer exchanges, we are building a sanctuary for those who believe learning never stops.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
