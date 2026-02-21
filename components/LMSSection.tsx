"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

const features = [
    {
        title: "Immersive eLearning Content",
        description: "Engaging, rich multimedia courses designed to deliver real knowledge retention and behavioural change.",
    },
    {
        title: "Assessment & Quizzes",
        description: "Built-in evaluation tools to measure understanding, retention, and application of new knowledge.",
    },
    {
        title: "Realtime Progress Tracking",
        description: "Live analytics and dashboards for learners and admins to monitor growth, activity, and completion rates.",
    },
    {
        title: "AI Enabled",
        description: "Intelligent recommendations and personalised learning paths powered by AI to maximise each learner's development.",
    },
];

const lmsImages = [
    "/learnig 1.png",
    "/learnign 2.png",
    "/learnig 3.png",
    "/learnig 4.png",
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
                            className="group relative p-8 rounded-2xl bg-zinc-900/40 border border-white/5 hover:bg-zinc-900/60 transition-colors duration-500 flex flex-col"
                        >
                            <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-red-500/20 transition-colors duration-500 pointer-events-none" />
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors min-h-[3.5rem] flex items-start">
                                {feature.title}
                            </h3>
                            <p className="text-zinc-400 leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/5 mt-16" />

                {/* Image Carousel — matching WhyChooseUs style */}
                <div className="w-full relative mt-12 overflow-hidden">
                    <motion.div
                        className="flex gap-6 w-max"
                        animate={{ x: "-50%" }}
                        transition={{
                            duration: 30,
                            ease: "linear",
                            repeat: Infinity,
                        }}
                    >
                        {[...lmsImages, ...lmsImages, ...lmsImages, ...lmsImages].map((src, index) => (
                            <div
                                key={index}
                                className="relative w-[280px] md:w-[380px] aspect-video flex-shrink-0 overflow-hidden rounded-xl border border-white/10"
                            >
                                <Image
                                    src={src}
                                    alt={`LMS screenshot ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </motion.div>
                    {/* Fade masks */}
                    <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
                </div>

                {/* CTA / Bottom Note */}
                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <span className="text-zinc-500 text-sm uppercase tracking-widest">
                        Seamless Integration with Your Workflow
                    </span>
                    <a
                        href="https://sponge.wisdomlms.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 px-6 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors"
                    >
                        Access our LMS for Free Courses
                        <span className="block w-4 h-px bg-current transition-all group-hover:w-6" />
                    </a>
                </div>

            </div>
        </section>
    );
}
