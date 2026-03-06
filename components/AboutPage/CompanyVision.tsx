"use client";

import { motion } from "framer-motion";
import React from "react";
import { ArrowRight } from "lucide-react";

export default function CompanyVision() {
    return (
        <section className="bg-white text-black py-24 px-6 md:px-12 lg:px-20 relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Vision Text */}
                    <div className="flex flex-col gap-8 order-2 lg:order-1">
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
                        >
                            INTEGRATING LEARNING, <br />
                            TALENT & <span className="text-gray-400">TECHNOLOGY.</span>
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, scaleX: 0 }}
                            whileInView={{ opacity: 1, scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-black w-24 h-2 origin-left"
                        />

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light mt-4"
                        >
                            We are an end-to-end partner dedicated to addressing your most critical workforce performance challenges.
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-lg text-gray-500 leading-relaxed"
                        >
                            Supported by a multidisciplinary team of strategists, industry experts, and transformation specialists, we design and deliver integrated talent solutions that drive measurable impact and strong returns on your investment.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="pt-6"
                        >
                            <a href="/services" className="group inline-flex items-center gap-4 text-black font-bold text-lg hover:text-[#E31E24] transition-colors">
                                Explore Our Services
                                <div className="w-12 h-12 rounded-full border border-black/20 flex items-center justify-center group-hover:border-[#E31E24] group-hover:bg-[#E31E24] group-hover:text-white transition-all duration-300">
                                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                                </div>
                            </a>
                        </motion.div>
                    </div>

                    {/* Creative Visual Block */}
                    <div className="relative order-1 lg:order-2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="relative aspect-square md:aspect-[4/3] lg:aspect-[4/3] xl:aspect-square bg-zinc-50 rounded-[2rem] overflow-hidden group border border-zinc-200"
                        >
                            {/* Abstract Graphic Element */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#E31E24_0%,transparent_50%)] opacity-5 group-hover:opacity-10 transition-opacity duration-700" />

                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-16 text-center z-10">
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className="w-24 h-24 bg-black rounded-2xl mb-8 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 shadow-2xl shadow-black/10"
                                >
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                        <path d="M2 17l10 5 10-5" />
                                        <path d="M2 12l10 5 10-5" />
                                    </svg>
                                </motion.div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-4">Transformational Learning</h3>
                                <p className="text-gray-500 text-lg md:text-xl font-light">Building capability through keynote sessions, short-term workshops, and immersive learning programmes aligned to business goals.</p>
                            </div>

                            {/* Background Pattern Overlay */}
                            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
                        </motion.div>

                        {/* Floating elements */}
                        <motion.div
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-8 -left-4 md:-left-12 bg-black text-white p-6 md:p-8 rounded-2xl shadow-2xl shadow-black/20 z-20"
                        >
                            <div className="flex items-center gap-4">
                                <div className="text-4xl md:text-5xl font-bold text-[#E31E24]">2011</div>
                                <div className="text-xs md:text-sm uppercase tracking-wider font-bold text-gray-400">Founded &<br />Established</div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
