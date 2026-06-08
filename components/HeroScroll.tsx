"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import NextImage from "next/image";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

export default function HeroScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

    return (
        <div ref={containerRef} className="h-[100dvh] w-full bg-[#E31E24] p-1 overflow-hidden">
            <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">
                {/* Video Background */}
                <div className="absolute inset-0 w-full h-full">
                    <video
                        src="/hero-vid.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    />
                    {/* Overlay for contrast */}
                    <div className="absolute inset-0 bg-black/30" />
                </div>

                {/* Hero Content */}
                <motion.div
                    style={{ opacity: heroOpacity, y: heroY }}
                    className="absolute inset-0 flex flex-col items-start text-white z-40 px-6 pt-24 pb-8 sm:px-8 sm:pb-12 md:pl-12 md:pr-20 md:pb-20 md:pt-32 lg:pl-16 lg:pr-32 lg:pb-24 lg:pt-36"
                >
                    <div className="max-w-5xl w-full mt-auto">
                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 tracking-tight drop-shadow-lg text-center md:text-left leading-tight">
                            Transforming Talent <br className="hidden sm:block" />
                            Driving Performance
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 md:mb-12 text-white/90 font-light leading-relaxed drop-shadow-md text-center md:text-left max-w-2xl">
                            We deliver innovative learning and development solutions, including custom eLearning, Immersive in-person training, and integrated talent development solutions.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                            <a href="https://wa.me/94713687386" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-6 py-2.5 sm:px-8 sm:py-3 bg-white text-black rounded-full font-semibold hover:bg-white/90 transition-colors text-center inline-block text-sm sm:text-base">
                                Request a Consultation
                            </a>
                            <a
                                href="#programmes"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const el = document.getElementById('programmes');
                                    if (el) {
                                        const top = el.getBoundingClientRect().top + window.scrollY;
                                        window.scrollTo({ top, behavior: 'smooth' });
                                    }
                                }}
                                className="w-full sm:w-auto px-6 py-2.5 sm:px-8 sm:py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-semibold hover:bg-white/20 transition-colors text-center inline-block text-sm sm:text-base"
                            >
                                Explore Programmes
                            </a>
                        </div>

                        {/* Social Links under Hero Buttons */}
                        <div className="mt-8 md:mt-10 flex flex-row items-center gap-4 text-white/70 justify-center md:justify-start w-full">
                            <span className="text-xs tracking-wider uppercase font-semibold text-white/50">Follow Us</span>
                            <div className="h-px w-8 bg-white/20 hidden sm:block" />
                            <div className="flex items-center gap-3">
                                {/* YouTube - Primary */}
                                <motion.a
                                    href="https://www.youtube.com/@sponge_global_training/shorts"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    animate={{ scale: [1, 1.06, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    whileHover={{ scale: 1.15, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-11 h-11 rounded-full flex items-center justify-center bg-[#E31E24] text-white transition-all shadow-[0_0_15px_rgba(227,30,36,0.6)] border border-[#E31E24] hover:shadow-[0_0_20px_rgba(227,30,36,0.9)]"
                                    aria-label="Follow us on YouTube"
                                >
                                    <Youtube className="w-5 h-5" />
                                </motion.a>

                                {/* LinkedIn */}
                                <motion.a
                                    href="https://www.linkedin.com/company/3069879/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.12, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 hover:border-white/30 transition-all"
                                    aria-label="Follow us on LinkedIn"
                                >
                                    <Linkedin className="w-4 h-4" />
                                </motion.a>

                                {/* Instagram */}
                                <motion.a
                                    href="https://www.instagram.com/spongeglobal?igsh=Y3p3MGFnbHhtcTNo"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.12, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 hover:border-white/30 transition-all"
                                    aria-label="Follow us on Instagram"
                                >
                                    <Instagram className="w-4 h-4" />
                                </motion.a>

                                {/* Facebook */}
                                <motion.a
                                    href="https://www.facebook.com/spongeglobal"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.12, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 hover:border-white/30 transition-all"
                                    aria-label="Follow us on Facebook"
                                >
                                    <Facebook className="w-4 h-4" />
                                </motion.a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

