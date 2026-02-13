
"use client";

import { motion } from "framer-motion";
import React from "react";
import { BookOpen, Users, Settings } from "lucide-react"; // Icons for visualization

const sustainItems = [
    {
        title: "Learning Management Solutions",
        description: "Continue learning through structured content, learning paths, and progress tracking.",
        icon: Settings
    },
    {
        title: "Learning Lounge",
        description: "A space to meet, learn, and stay updated on relevant and trending topics.",
        icon: Users
    },
    {
        title: "Content creation at scale",
        description: "Studio-supported content and immersive learning assets designed for retention and adoption.",
        icon: BookOpen
    }
];

export default function SustainLearning() {
    return (
        <section className="bg-white text-black py-24 px-6 md:px-12 lg:px-20">
            <div className="max-w-[1400px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 text-center md:text-left"
                >
                    <span className="text-[#E31E24] font-bold text-sm tracking-widest uppercase mb-2 block">// Continuity</span>
                    <h2 className="text-4xl md:text-5xl font-bold max-w-2xl">
                        SUSTAIN LEARNING <br />
                        BEYOND THE SESSION.
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {sustainItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="group p-8 border border-gray-200 hover:border-[#E31E24] hover:shadow-xl transition-all duration-300 rounded-xl bg-gray-50"
                        >
                            <div className="w-14 h-14 bg-black text-white rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#E31E24] transition-colors duration-300">
                                <item.icon size={28} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 group-hover:text-[#E31E24] transition-colors duration-300">
                                {item.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
