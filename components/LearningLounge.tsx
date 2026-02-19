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
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Visual Side */}
                    <div className="w-full lg:w-1/2 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative aspect-square md:aspect-video lg:aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-zinc-900/50"
                        >
                            {/* Abstract placeholder visual since specific lounge image isn't available */}
                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center">
                                <div className="text-center p-8">
                                    <span className="block text-9xl font-bold text-white/5 select-none">LL</span>
                                </div>
                            </div>

                            {/* Overlay Text */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                                <div className="border border-white/20 px-8 py-3 rounded-full bg-white/5 backdrop-blur-md">
                                    <span className="text-white font-mono uppercase tracking-widest text-sm">
                                        Coming Soon
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Decorative Detail */}
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-red-600 rounded-full blur-[40px] opacity-40"></div>
                    </div>

                    {/* Content Side */}
                    <div className="w-full lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="flex flex-col gap-8"
                        >
                            <div>
                                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-2">
                                    The Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">Lounge.</span>
                                </h2>
                                <p className="text-zinc-500 text-lg uppercase tracking-widest font-medium">
                                    A Community of Practice
                                </p>
                            </div>

                            <div className="space-y-6 text-lg text-zinc-400 leading-relaxed">
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
            </div>
        </section>
    );
}
