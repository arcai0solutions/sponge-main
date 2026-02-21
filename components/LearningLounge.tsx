"use client";

import { motion } from "framer-motion";
import React from "react";

export default function LearningLounge() {
    return (
        <section className="bg-black relative py-24 md:py-32 overflow-hidden border-t border-white/5">

            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
            <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left — Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
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
                                This is a cozy meeting space for like-minded people to gather, brainstorm, and exchange ideas. You don't need to spend a lot of money booking hotels to connect, network, or enjoy good food and drinks together.
                            </p>
                            <p>
                                Learning doesn't always have to be formal — sometimes the best insights come from informal conversations. This is a space designed exactly for that.
                            </p>
                            <p>
                                We provide the location and food, and you're even welcome to bring your own beverages if you wish. We also have a few musical instruments and a karaoke setup if you'd like to relax and entertain yourself.
                            </p>
                        </div>
                    </motion.div>

                    {/* Right — Coming Soon */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-zinc-900/50 flex flex-col items-center justify-center gap-6"
                    >
                        {/* Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-transparent pointer-events-none" />

                        {/* Animated pulse ring */}
                        <div className="relative flex items-center justify-center">
                            <div className="absolute w-32 h-32 rounded-full bg-red-600/10 animate-ping" />
                            <div className="absolute w-20 h-20 rounded-full bg-red-600/20" />
                            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center z-10">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                            </div>
                        </div>

                        <div className="text-center z-10">
                            <p className="text-white text-3xl font-bold uppercase tracking-widest">Coming Soon</p>
                            <p className="text-zinc-500 text-sm mt-2 tracking-wide">Our lounge is opening soon. Stay tuned.</p>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
