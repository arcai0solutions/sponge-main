
"use client";

import { motion } from "framer-motion";
import React from "react";
import { CheckCircle2 } from "lucide-react";

const reasons = [
    "Established in 2011 and trusted for training and capability building",
    "200+ client organizations across industries and multiple countries",
    "Strong expertise in instructional design and content creation",
    "Keynote sessions that create alignment and energy at scale",
    "Short-term workshops (2 to 8 hours) for focused upskilling",
    "Transformational learning programmes (6 to 12 months) for sustainable growth",
    "Proprietary Learning Management Solutions with assessments and analytics"
];

export default function WhySponge() {
    return (
        <section className="bg-black text-white py-16 md:py-24 px-6 md:px-12 lg:px-20 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>

            <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row gap-10 lg:gap-24 items-start">

                {/* Left: Title */}
                <div className="lg:w-1/3 lg:sticky lg:top-32">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                            WHY <br />
                            <span className="text-[#E31E24]">SPONGE GLOBAL?</span>
                        </h2>
                        <div className="w-20 h-2 bg-[#E31E24]"></div>
                    </motion.div>
                </div>

                {/* Right: List */}
                <div className="lg:w-2/3">
                    <div className="space-y-6">
                        {reasons.map((reason, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="flex items-start gap-4 group"
                            >
                                <div className="mt-1 min-w-[24px]">
                                    <CheckCircle2 className="text-[#E31E24] w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                                </div>
                                <p className="text-lg md:text-xl text-gray-300 font-light group-hover:text-white transition-colors duration-300">
                                    {reason}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
