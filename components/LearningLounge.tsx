"use client";

import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const loungeImages = [
    "/lounge1 (1).jpg",
    "/lounge2.jpg",
    "/lounge3.jpg"
];

export default function LearningLounge() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % loungeImages.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);
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

                    {/* Right — Image Carousel */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-zinc-900/50"
                    >
                        {loungeImages.map((src, index) => (
                            <Image
                                key={src}
                                src={src}
                                alt={`Lounge ${index + 1}`}
                                fill
                                className={`object-cover transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-100" : "opacity-0"
                                    }`}
                                priority={index === 0}
                            />
                        ))}

                        {/* Subtle overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
