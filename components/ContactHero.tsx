"use client";

import { motion } from 'framer-motion';
import React from 'react';

export default function ContactHero() {
    return (
        <section className="bg-black text-white pt-32 md:pt-48 pb-12 px-6 md:px-12 lg:px-24 relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto relative z-10">
                <div className="flex flex-col gap-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-3"
                    >
                        <span className="w-8 h-[2px] bg-[#E31E24]"></span>
                        <span className="text-white/80 text-sm md:text-base uppercase tracking-[0.2em] font-medium">Get in Touch</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                        className="text-3xl md:text-5xl lg:text-7xl font-semibold leading-[1.05] tracking-tighter"
                    >
                        Let's build something <br />
                        <span className="text-white/40">extraordinary.</span>
                    </motion.h1>
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#E31E24]/10 blur-[150px] rounded-full pointer-events-none -z-10" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        </section>
    );
}
