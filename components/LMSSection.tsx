"use client";

import { motion } from "framer-motion";
import NextImage from "next/image";
import React from "react";

const features = [
    {
        title: "Structured Learning Paths",
        description: "Curated journeys that guide learners through specific skills and roles, ensuring comprehensive development.",
        icon: "https://cdn.prod.website-files.com/6840876d4d1ed0e8e2a330b9/6848ab85cf257420c02231d5_close-white.svg" // Placeholder, can be replaced
    },
    {
        title: "Assessments & Quizzes",
        description: "Built-in evaluation tools to measure understanding, retention, and application of new knowledge.",
        icon: "https://cdn.prod.website-files.com/6840876d4d1ed0e8e2a330b9/6848ab85cf257420c02231d5_close-white.svg"
    },
    {
        title: "Progress Tracking",
        description: "Real-time analytics and dashboards for learners and admins to monitor growth and completion rates.",
        icon: "https://cdn.prod.website-files.com/6840876d4d1ed0e8e2a330b9/6848ab85cf257420c02231d5_close-white.svg"
    },
    {
        title: "Reinforcement & Retention",
        description: "Post-training nudges and micro-learning modules to combat the forgetting curve and sustain impact.",
        icon: "https://cdn.prod.website-files.com/6840876d4d1ed0e8e2a330b9/6848ab85cf257420c02231d5_close-white.svg"
    }
];

export default function LMSSection() {
    return (
        <section className="bg-black relative py-20 md:py-32 overflow-hidden">
            {/* Background Gradient/Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-8">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="h-px w-12 bg-red-600"></span>
                            <span className="text-red-500 font-bold tracking-widest text-sm uppercase">Digital Enablement</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
                            Learning Management <br />
                            <span className="text-zinc-500">System.</span>
                        </h2>
                    </div>

                    <p className="text-zinc-400 text-lg md:text-xl max-w-md leading-relaxed">
                        Extend the impact of our training with a robust digital platform designed for sustainability, measurement, and scale.
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative p-8 rounded-2xl bg-zinc-900/40 border border-white/5 hover:bg-zinc-900/60 transition-colors duration-500"
                        >
                            {/* Hover Border Gradient */}
                            <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-red-500/20 transition-colors duration-500 pointer-events-none" />

                            <div className="w-12 h-12 mb-6 bg-black/50 rounded-lg flex items-center justify-center border border-white/10 group-hover:border-red-500/30 transition-colors">
                                {/* Use a simple shape or icon if specific ones aren't available yet */}
                                <div className="w-3 h-3 bg-red-600 rounded-sm transform rotate-45 group-hover:scale-125 transition-transform" />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                                {feature.title}
                            </h3>

                            <p className="text-zinc-400 leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* CTA / Bottom Note */}
                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <span className="text-zinc-500 text-sm uppercase tracking-widest">
                        Seamless Integration with Your Workflow
                    </span>
                    <a href="/contact" className="group flex items-center gap-3 text-white font-medium hover:text-red-500 transition-colors">
                        Request a Demo
                        <span className="block w-6 h-px bg-current transition-all group-hover:w-10" />
                    </a>
                </div>

            </div>
        </section>
    );
}
