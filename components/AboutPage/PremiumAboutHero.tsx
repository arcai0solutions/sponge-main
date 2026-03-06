"use client";

import { motion } from "framer-motion";
import React from "react";
import NextImage from "next/image";

export default function PremiumAboutHero() {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 px-6 md:px-12 lg:px-20 overflow-hidden bg-black text-white">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-[#E31E24]/10 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />

            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

            <div className="max-w-[1400px] mx-auto w-full z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

                    {/* Left Content */}
                    <div className="lg:col-span-7 flex flex-col gap-8 text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex items-center gap-3"
                        >
                            <span className="w-12 h-[1px] bg-[#E31E24]"></span>
                            <span className="text-[#E31E24] font-bold tracking-widest text-sm uppercase">About Us</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[0.9]"
                        >
                            WE ARE <br />
                            <span className="text-zinc-500">SPONGE</span>
                            <span className="text-[#E31E24]">.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                            className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed max-w-2xl mt-4"
                        >
                            <span className="text-white font-medium">Your context is unique to you.</span> We meet where you are - with a strategy and a solution tailored to your requirements and budgets.
                        </motion.p>
                    </div>

                    {/* Right Graphic / Spinning Image */}
                    <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                            className="relative w-72 h-72 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px]"
                        >
                            {/* Rotating Text Badge */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 z-20 pointer-events-none"
                            >
                                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                                    <path
                                        id="circlePathHero"
                                        d="M 50, 50 m -45, 0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0"
                                        fill="transparent"
                                    />
                                    <text fill="rgba(255,255,255,0.6)" fontSize="9" fontWeight="bold" letterSpacing="4px">
                                        <textPath href="#circlePathHero" startOffset="0%">
                                            LEARNING & CAPABILITY PARTNER • EST 2011 •
                                        </textPath>
                                    </text>
                                </svg>
                            </motion.div>

                            {/* Center Image */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-[15%] rounded-full overflow-hidden"
                            >
                                <NextImage
                                    src="/about-image.jpeg"
                                    alt="About Sponge Global"
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
