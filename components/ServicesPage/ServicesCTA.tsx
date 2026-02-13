
"use client";

import { motion } from "framer-motion";
import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ServicesCTA() {
    return (
        <section className="bg-[#E31E24] py-24 px-6 md:px-12 lg:px-20 text-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#444_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight"
                >
                    Ready to Elevate Your Team's Capability?
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto"
                >
                    Share your audience, learning goals, timeline, and delivery preferences, and we will recommend the right learning approach.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-3 bg-white text-[#E31E24] px-8 py-4 rounded-full text-lg font-bold hover:bg-black hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        Get Started
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
