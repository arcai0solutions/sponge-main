"use client";

import { motion } from 'framer-motion';
import NextImage from 'next/image';
import React from 'react';

export default function About() {
    return (
        <section className="bg-black text-white pt-16 pb-0 md:pt-20 md:pb-0 px-6 md:px-12 lg:px-24 mb-[-2rem] md:mb-[-4rem] relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto">

                {/* Top Row: Label & Badge */}
                <div className="flex justify-between items-start mb-12 md:mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-2"
                    >
                        <span className="text-[#E31E24] text-xl font-bold">//</span>
                        <span className="text-white/80 text-lg uppercase tracking-widest font-medium">about us</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative w-32 h-32 md:w-40 md:h-40 hidden md:block"
                    >
                        {/* Rotating Text Badge */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="w-full h-full"
                        >
                            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                                <path
                                    id="circlePath"
                                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                                    fill="transparent"
                                />
                                <text style={{ fontFamily: 'var(--font-inter), sans-serif' }} fill="white" fontSize="11.5" fontWeight="bold" letterSpacing="2px">
                                    <textPath href="#circlePath" startOffset="0%">
                                        SPONGE GLOBAL • EST 2011 •
                                    </textPath>
                                </text>
                            </svg>
                        </motion.div>

                        {/* Center Arrow/Icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#E31E24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </motion.div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

                    {/* Main Headline */}
                    <div className="lg:col-span-8">
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-xl md:text-3xl lg:text-5xl font-medium leading-[1.2] tracking-tight text-left"
                            lang="en"
                        >
                            Your Context is Unique to You. We’ll meet where you are - with a strategy and a solution tailored to your requirements and budgets.
                        </motion.h2>

                        {/* Spinning Image */}
                        <div className="hidden md:flex w-full justify-center lg:justify-start lg:pl-64 mt-12 lg:mt-16">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-full overflow-hidden"
                            >
                                <NextImage
                                    src="/about-image.jpeg"
                                    alt="About Sponge Global"
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>
                        </div>
                    </div>

                    {/* Secondary Text & Cards */}
                    <div className="lg:col-span-4 flex flex-col justify-between gap-12">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="space-y-8"
                        >
                            <p className="text-gray-400 text-lg md:text-xl leading-relaxed text-left md:text-justify">
                                We are an end-to-end partner dedicated to addressing your most critical workforce performance challenges through the seamless integration of learning, talent, and technology.
                            </p>
                            <p className="text-gray-400 text-lg md:text-xl leading-relaxed text-left md:text-justify">
                                Supported by a multidisciplinary team of strategists, industry experts, and transformation specialists, we design and deliver integrated talent solutions that drive measurable impact and strong returns on your investment.
                            </p>
                        </motion.div>

                        {/* Action Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                            <Card href="#services" label="Services" delay={0.4} />
                            <Card href="#projects" label="Projects" delay={0.5} variant="red" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Card({ href, label, delay, variant = "black" }: { href: string, label: string, delay: number, variant?: "black" | "red" }) {
    const isRed = variant === "red";

    return (
        <motion.a
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            href={href}
            className={`
                group relative overflow-hidden rounded-lg p-6 flex items-center justify-between
                ${isRed ? 'bg-[#E31E24] text-white' : 'bg-[#111] text-white border border-white/10'}
                transition-all duration-300 hover:scale-[1.02]
            `}
        >
            <span className="text-xl font-medium tracking-wide z-10">{label}</span>
            <div className={`p-2 rounded-full ${isRed ? 'bg-white/20' : 'bg-white/10'} group-hover:bg-white group-hover:text-black transition-colors duration-300`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
            </div>
        </motion.a>
    );
}
