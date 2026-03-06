"use client";

import { motion } from "framer-motion";
import React from "react";
import ServicesHeroAnimation from "./ServicesHeroAnimation";

export default function ServicesHero() {
    return (
        <section className="relative min-h-auto md:min-h-[70vh] flex items-center pb-4 pt-6 md:pb-20 md:pt-24 px-6 md:px-12 lg:px-20 bg-black overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30 z-10" />

            {/* Global Ambient Glow */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#E31E24] rounded-full filter blur-[150px] opacity-20 animate-pulse pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[300px] bg-[#E31E24] rounded-full filter blur-[200px] opacity-10 pointer-events-none" />

            <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
                {/* Left Side: Text Content */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left">
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
                        className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed mx-auto lg:mx-0"
                    >
                        Our services are designed around business priorities, role expectations, and capability gaps. We tailor every engagement to your context, audience, and success measures.
                    </motion.p>
                </div>

                {/* Right Side: Animated Visual */}
                <div className="w-full lg:w-1/2 flex items-center justify-center -mt-8 lg:mt-0 relative overflow-visible">
                    <ServicesHeroAnimation />
                </div>
            </div>
        </section>
    );
}

