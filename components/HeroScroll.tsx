"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import NextImage from "next/image";
import { Menu } from "lucide-react";

export default function HeroScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

    return (
        <div ref={containerRef} className="h-screen w-full bg-[#E31E24] p-2 overflow-hidden">
            <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden">
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

                {/* Logo - Top Left */}
                <div className="absolute top-4 left-6 md:top-8 md:left-12 lg:top-10 lg:left-16 z-50 rounded-2xl overflow-hidden">
                    <div className="">
                        <NextImage
                            src="/new-logo.jpeg"
                            alt="Sponge Logo"
                            width={160}
                            height={160}
                            className="w-32 md:w-40 h-auto object-contain"
                        />
                    </div>
                </div>

                {/* Menu Button - Top Right */}
                <div className="absolute top-4 right-4 md:top-8 md:right-8 lg:top-10 lg:right-10 z-50">
                    <button className="bg-white/10 backdrop-blur-md p-4 rounded-full text-white hover:bg-white/20 transition-colors duration-300 group">
                        <Menu className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                    </button>
                </div>

                {/* Hero Content */}
                <motion.div
                    style={{ opacity: heroOpacity, y: heroY }}
                    className="absolute inset-0 flex flex-col items-start justify-end text-white z-40 pl-6 pr-12 pb-10 md:pl-12 md:pr-20 md:pb-20 lg:pl-16 lg:pr-32 lg:pb-32"
                >
                    <div className="max-w-5xl">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight drop-shadow-lg text-left">
                            Strengthening Organizations <br /> Shaping Leaders,
                        </h1>
                        <p className="text-xl md:text-2xl mb-12 text-white/90 font-light leading-relaxed drop-shadow-md text-left">
                            Custom learning solutions that build long-term capability <br className="hidden md:block" /> and align with your organizational goals.
                        </p>
                        <div className="flex gap-4 flex-wrap">
                            <button className="px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-white/90 transition-colors">
                                Request a Consultation
                            </button>
                            <button className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-semibold hover:bg-white/20 transition-colors">
                                Explore Programs
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

