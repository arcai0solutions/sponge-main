"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const programmes = [
    {
        title: "Strategic Thinking",
        description: "Develop the ability to anticipate market shifts, connect complex variables, and formulate long-term organizational strategies."
    },
    {
        title: "Customer Centricity",
        description: "Embed extreme customer focus into your organizational DNA to drive loyalty, satisfaction, and sustainable revenue growth."
    },
    {
        title: "Data Analytics and Artificial Intelligence",
        description: "Equip your teams with the fluency to interpret complex data and leverage AI tools for accelerated, intelligent business decisions."
    },
    {
        title: "Decision Making & Problem Solving",
        description: "Frameworks and cognitive tools to navigate ambiguity, evaluate risks, and solve sophisticated structural business challenges."
    },
    {
        title: "Change Management",
        description: "Equip leaders with the resilience and strategies required to guide teams through organizational transitions and market disruptions smoothly."
    },
    {
        title: "Stakeholder Management",
        description: "Master the art of mapping, engaging, and influencing internal and external stakeholders to align with strategic business outcomes."
    },
    {
        title: "Leading Self & Others",
        description: "Cultivate high emotional intelligence and foundational leadership capabilities to inspire high performance across decentralized teams."
    },
    {
        title: "Impactful Communication",
        description: "Develop clear, persuasive, and authentic communication skills necessary to articulate vision and drive alignment."
    },
    {
        title: "Creativity & Innovation",
        description: "Foster a culture that encourages divergent thinking and rapid prototyping to continuously develop new solutions."
    },
    {
        title: "Team Work & Collaboration",
        description: "Break down silos and establish dynamic, cross-functional collaboration protocols that enhance productivity and trust."
    },
    {
        title: "Coaching & Mentoring",
        description: "Transition managers into capability builders who can identify potential and actively accelerate internal talent development."
    },
    {
        title: "Digital Transformation",
        description: "Prepare your workforce to adopt, integrate, and maximize emerging digital technologies across all operational workflows."
    }
];

export default function ServicesList() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleService = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="bg-black text-white relative py-20 px-4 md:px-8 overflow-hidden">
            <div className="max-w-[1400px] mx-auto">

                {/* Header Grid - Matching strict design */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 md:mb-32">
                    <div className="flex flex-col">
                        <h2 className="text-5xl md:text-7xl font-medium tracking-tight text-white mb-8">Programmes</h2>
                    </div>

                    {/* Animated Cross Icons */}
                    <div className="hidden md:flex gap-4 mb-2">
                        {[1, 2, 3, 4].map((_, i) => (
                            <motion.img
                                key={i}
                                src="https://cdn.prod.website-files.com/6840876d4d1ed0e8e2a330b9/6848ab85cf257420c02231d5_close-white.svg"
                                alt=""
                                className="w-6 h-6 opacity-80"
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
                            />
                        ))}
                    </div>

                    <div className="text-4xl md:text-5xl font-medium text-white/90">
                        (12)
                    </div>
                </div>

                {/* Services List */}
                <div className="flex flex-col">
                    {programmes.map((programme, index) => (
                        <div key={index} className="group cursor-pointer" onClick={() => toggleService(index)}>
                            {/* Line Separator */}
                            <motion.div
                                initial={{ width: "0%" }}
                                whileInView={{ width: "100%" }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, ease: "easeInOut" }}
                                className="h-[1px] bg-[#E31E24] w-full"
                            />

                            <div className="flex flex-col lg:flex-row py-10 lg:py-16 gap-8 lg:gap-20 relative">

                                {/* Left Side: Number + Title */}
                                <div className="w-full lg:w-1/2 flex items-start gap-8 md:gap-16">
                                    <div className="text-lg md:text-xl font-medium text-white/60 pt-1">
                                        {(index + 1).toString()}
                                    </div>
                                    <h3 className="text-3xl md:text-5xl font-medium leading-tight group-hover:text-gray-300 transition-colors">
                                        {programme.title}
                                    </h3>
                                </div>

                                {/* Right Side: Description (Expandable) */}
                                <div className="w-full lg:w-1/2">
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            height: activeIndex === index ? "auto" : 0,
                                            opacity: activeIndex === index ? 1 : 0
                                        }}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl pb-4">
                                            {programme.description}
                                        </p>

                                        {/* Tags (Placeholder style based on design) */}
                                        <div className="flex flex-wrap gap-3 mt-6">
                                            {["Strategy", "Implementation", "Growth"].map((tag, tIndex) => (
                                                <span key={tIndex} className="px-4 py-2 border border-white/20 rounded-full text-sm text-gray-400">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Collapsed State Hint (Optional) */}
                                    <motion.div
                                        animate={{ opacity: activeIndex === index ? 0 : 1 }}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 lg:static lg:translate-y-0 lg:mt-4 hidden lg:block"
                                    >
                                        {!activeIndex && (
                                            <span className="text-white/40 text-sm uppercase tracking-widest border border-white/20 px-4 py-2 rounded-full">
                                                Explore
                                            </span>
                                        )}
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Final Line */}
                    <motion.div
                        initial={{ width: "0%" }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        className="h-[1px] bg-[#E31E24] w-full"
                    />
                </div>

                {/* Footer Button */}
                <div className="mt-20 flex justify-start">
                    <a href="/contact/3" className="inline-flex items-center gap-2 group">
                        <span className="w-3 h-3 bg-red-600 rounded-full group-hover:scale-125 transition-transform duration-300"></span>
                        <span className="text-white text-lg font-medium border-b border-transparent group-hover:border-white transition-colors">Get in touch</span>
                    </a>
                </div>

            </div>
        </section>
    );
}
