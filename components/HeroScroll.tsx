"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import NextImage from "next/image";

export default function HeroScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

    return (
        <div ref={containerRef} className="min-h-[100svh] w-full bg-[#E31E24] p-1 overflow-hidden">
            <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden min-h-[inherit]">
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
                    className="absolute inset-0 flex flex-col items-start justify-end text-white z-40 px-6 pb-[25vh] md:pl-12 md:pr-20 md:pb-20 lg:pl-16 lg:pr-32 lg:pb-32"
                >
                    <div className="max-w-5xl w-full">
                        <h1 className="text-4xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight drop-shadow-lg text-center md:text-left leading-tight">
                            Strengthening Organizations <br /> Shaping Leaders.
                        </h1>
                        <p className="text-lg md:text-2xl mb-8 md:mb-12 text-white/90 font-light leading-relaxed drop-shadow-md text-justify md:text-left max-w-2xl">
                            Custom learning solutions that build long-term capability <br className="hidden md:block" /> and align with your organizational goals.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <button className="w-full sm:w-auto px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-white/90 transition-colors text-center">
                                Request a Consultation
                            </button>
                            <button className="w-full sm:w-auto px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-semibold hover:bg-white/20 transition-colors text-center">
                                Explore Programs
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

