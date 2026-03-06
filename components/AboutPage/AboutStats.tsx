"use client";

import { motion } from "framer-motion";
import React from "react";
import { Trophy, Users, Globe2, Sparkles } from "lucide-react";

const stats = [
    {
        icon: Users,
        value: "200+",
        label: "Client Organizations",
        description: "Across industries and multiple countries"
    },
    {
        icon: Globe2,
        value: "Global",
        label: "Reach & Impact",
        description: "Delivering solutions worldwide"
    },
    {
        icon: Sparkles,
        value: "100%",
        label: "Tailored Solutions",
        description: "Meeting you where you are"
    },
    {
        icon: Trophy,
        value: "13+",
        label: "Years of Excellence",
        description: "Trusted partner since 2011"
    }
];

export default function AboutStats() {
    return (
        <section className="bg-zinc-950 py-24 px-6 md:px-12 lg:px-20 relative overflow-hidden border-t border-white/5">
            <div className="max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="group relative p-8 rounded-3xl bg-zinc-900/40 border border-white/5 hover:bg-zinc-900 transition-colors duration-500 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#E31E24]/0 to-[#E31E24]/0 group-hover:from-[#E31E24]/10 group-hover:to-transparent transition-colors duration-500 pointer-events-none" />

                            <div className="relative z-10 flex flex-col gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center border border-white/10 group-hover:border-[#E31E24]/30 group-hover:text-[#E31E24] transition-colors duration-500 text-white shadow-lg">
                                    <stat.icon size={24} strokeWidth={1.5} />
                                </div>

                                <div>
                                    <h4 className="text-4xl md:text-5xl font-bold text-white mb-3 group-hover:text-[#E31E24] transition-colors duration-500">
                                        {stat.value}
                                    </h4>
                                    <div className="text-lg font-bold text-white mb-2 uppercase tracking-wide">
                                        {stat.label}
                                    </div>
                                    <p className="text-sm text-zinc-400 leading-relaxed font-light">
                                        {stat.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
