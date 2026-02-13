"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const services = [
    {
        title: "Keynote Sessions",
        description: "High-impact sessions to create shared understanding, shift mindsets, and launch capability initiatives with clarity."
    },
    {
        title: "Short-Term Skill Building Workshops",
        description: "Focused learning experiences designed for specific outcomes and immediate application on the job."
    },
    {
        title: "Transformational Learning Programmes",
        description: "Structured journeys that build leadership and functional capability over time through practice, reinforcement, and measurement."
    },
    {
        title: "Outbound Training",
        description: "Experiential, team-based learning that strengthens collaboration, trust, accountability, resilience, and execution."
    },
    {
        title: "Training Content Creation",
        description: "End-to-end content development including programme design, facilitator guides, participant resources, assessments, video learning, and immersive learning assets."
    },
    {
        title: "Training Facilities",
        description: "Access to training spaces and delivery-ready environments for workshops, simulations, and cohort programmes."
    },
    {
        title: "Learning Management Solutions",
        description: "LMS access, structured learning paths, assessments, progress tracking, reinforcement, and reporting to sustain learning beyond sessions."
    },
    {
        title: "Leadership Development & Succession",
        description: "Leadership pipelines built across levels, with role-based capability expectations, development plans, and readiness tracking."
    },
    {
        title: "Competency Frameworks",
        description: "Competency models aligned to strategy, roles, and performance expectations, supported by proficiency definitions and assessment approaches."
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
                        <h2 className="text-5xl md:text-7xl font-medium tracking-tight text-white mb-8">Services</h2>
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
                        (09)
                    </div>
                </div>

                {/* Services List */}
                <div className="flex flex-col">
                    {services.map((service, index) => (
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
                                        {service.title}
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
                                            {service.description}
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
