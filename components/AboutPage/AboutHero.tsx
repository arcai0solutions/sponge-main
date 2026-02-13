
"use client";

import { motion } from "framer-motion";
import React from "react";

export default function AboutHero() {
    return (
        <section className="relative pb-20 px-6 md:px-12 lg:px-20 overflow-hidden">

            {/* Background Graphic (Optional) */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-[#E31E24]/20 to-transparent rounded-full blur-[120px] -z-10" />

            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-20"
                >
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6">
                        ABOUT <span className="text-[#E31E24]">US.</span>
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {/* Who we are */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#E31E24]/50 transition-colors duration-500 flex flex-col"
                    >
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="h-[4.5rem] flex items-center mb-6">
                                <h3 className="text-3xl font-bold text-white group-hover:text-[#E31E24] transition-colors duration-300">Who we are</h3>
                            </div>
                            <p className="text-gray-400 leading-relaxed text-lg text-left">
                                Sponge Global is a learning and capability partner founded in 2011. We design and deliver practical learning solutions for organizations across industries and countries, supported by a multi-disciplinary team.
                            </p>
                        </div>
                    </motion.div>

                    {/* What we do */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#E31E24]/50 transition-colors duration-500 flex flex-col"
                    >
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="h-[4.5rem] flex items-center mb-6">
                                <h3 className="text-3xl font-bold text-white group-hover:text-[#E31E24] transition-colors duration-300">What we do</h3>
                            </div>
                            <p className="text-gray-400 leading-relaxed text-lg text-left">
                                We build capability through keynote sessions, short-term workshops, and transformational learning programmes aligned to business goals, role requirements, and measurable performance outcomes.
                            </p>
                        </div>
                    </motion.div>

                    {/* How we sustain impact */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#E31E24]/50 transition-colors duration-500 flex flex-col"
                    >
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="h-[4.5rem] flex items-center mb-6">
                                <h3 className="text-3xl font-bold text-white group-hover:text-[#E31E24] transition-colors duration-300">How we sustain impact</h3>
                            </div>
                            <p className="text-gray-400 leading-relaxed text-lg text-left">
                                We combine delivery with Learning Management Solutions, assessments, reinforcement pathways, and reporting so learning continues beyond the classroom.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
