"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import NextImage from "next/image";
import { Menu } from "lucide-react";

const frameCount = 52; // 104 - 53 + 1
const images = Array.from({ length: frameCount }, (_, i) => {
    const index = 53 + i;
    return `/sponge-hero/ezgif-frame-${index.toString().padStart(3, "0")}.jpg`;
});

const aboutText = "Founded in 2011, Sponge Global is a trusted learning partner building stronger leaders and teams for 200+ clients worldwide. We combine expert facilitation with technology to deliver practical, transformative training solutions that drive measurable impact.";

const Word = ({ children, progress, range }: { children: string, progress: any, range: [number, number] }) => {
    const opacity = useTransform(progress, range, [0.1, 1]);
    return (
        <motion.span style={{ opacity }} className="relative text-white">
            {children}
        </motion.span>
    );
};

export default function HeroScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const { loaded } = useImagePreloader(images);
    const [currentFrame, setCurrentFrame] = useState(0);

    // Map scroll progress (0 to 1) to frame index (0 to frameCount - 1)
    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);

    // Animations
    // Ensure Hero text stays at 0 opacity after the initial phase
    const heroOpacity = useTransform(scrollYProgress, [0, 0.15, 0.2, 1], [1, 0, 0, 0]);
    const heroY = useTransform(scrollYProgress, [0, 0.15, 0.2, 1], [0, -50, -50, -50]);

    // About Us Animations
    const aboutOpacity = useTransform(scrollYProgress, [0.15, 0.2, 0.8, 0.9], [0, 1, 1, 0]);


    useEffect(() => {
        // ... existing sync logic ...
        const unsubscribe = frameIndex.on("change", (latest) => {
            setCurrentFrame(Math.floor(latest));
        });
        return () => unsubscribe();
    }, [frameIndex]);

    // ... existing canvas drawing logic ...
    useEffect(() => {
        if (!loaded || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = new Image();
        img.src = images[currentFrame];

        const drawImage = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width / 2) - (img.width / 2) * scale;
            const y = (canvas.height / 2) - (img.height / 2) * scale;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        }

        img.onload = drawImage;

        if (img.complete) {
            drawImage();
        }
    }, [currentFrame, loaded]);


    return (
        <div ref={containerRef} className="h-[400vh] relative">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full object-cover"
                />

                {/* Fixed slight overlay for overall contrast */}
                <div className="absolute inset-0 bg-black/10" />

                {!loaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
                        Loading...
                    </div>
                )}

                {/* Logo - Top Left */}
                <div className="absolute top-8 left-8 md:top-12 md:left-12 lg:top-16 lg:left-16 z-50">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                        <NextImage
                            src="/sponge-logo.jpeg"
                            alt="Sponge Logo"
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Menu Button - Top Right */}
                <div className="absolute top-8 right-8 md:top-12 md:right-12 lg:top-16 lg:right-16 z-50">
                    <button className="bg-white/10 backdrop-blur-md p-4 rounded-full text-white hover:bg-white/20 transition-colors duration-300 group">
                        <Menu className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                    </button>
                </div>

                {/* Hero Content */}
                <motion.div
                    style={{ opacity: heroOpacity, y: heroY }}
                    className="absolute inset-0 flex flex-col items-start justify-end text-white z-40 px-8 pb-4 md:px-12 md:pb-6 lg:px-16 lg:pb-8"
                >
                    <div className="bg-black/60 backdrop-blur-2xl border border-white/10 px-6 pt-6 pb-6 md:px-8 md:pt-8 md:pb-8 rounded-3xl max-w-2xl">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight drop-shadow-lg text-left">
                            Elevate Leadership
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-white/90 font-light leading-relaxed drop-shadow-md text-left">
                            Custom learning solutions that build long-term capability and align with your organizational goals.
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

                {/* About Us Content - Scroll Reveal */}
                <div className="absolute inset-0 flex items-center justify-center z-40 px-4 pointer-events-none">
                    <motion.div
                        style={{ opacity: aboutOpacity }}
                        className="max-w-5xl w-full pointer-events-auto"
                    >
                        <div className="bg-black/90 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 md:p-12 lg:p-16 text-center shadow-2xl">
                            <h2 className="text-sm font-semibold tracking-widest text-white/50 uppercase mb-8">About Us</h2>
                            <p className="text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed text-white flex flex-wrap justify-center gap-x-2 gap-y-1">
                                {aboutText.split(" ").map((word, i) => {
                                    const words = aboutText.split(" ");
                                    const start = 0.25 + (i / words.length) * 0.4;
                                    const end = start + 0.05;
                                    return (
                                        <Word key={i} progress={scrollYProgress} range={[start, end]}>
                                            {word}
                                        </Word>
                                    );
                                })}
                            </p>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}

