"use client";

import { motion } from "framer-motion";
import React from "react";

const services = [
    {
        title: "KEYNOTE SESSIONS",
        number: "01",
        description: "High-impact sessions to create shared understanding, shift mindsets, and launch capability initiatives with clarity.",
        icon: "https://framerusercontent.com/images/JysmmACjgF2iADFwhVcO0mCa4.png?width=120&height=120"
    },
    {
        title: "SHORT-TERM SKILL BUILDING WORKSHOPS",
        number: "02",
        description: "Focused learning experiences designed for specific outcomes and immediate application on the job.",
        icon: "https://framerusercontent.com/images/ozhlQGjkJwQi6J6kg44kqW17I.png?width=120&height=120"
    },
    {
        title: "TRANSFORMATIONAL LEARNING PROGRAMMES",
        number: "03",
        description: "Structured journeys that build leadership and functional capability over time through practice, reinforcement, and measurement.",
        icon: "https://framerusercontent.com/images/9j4K94Z5KC4m3elGl0HaEX2UTQ.png?width=120&height=120"
    },
    {
        title: "OUTBOUND TRAINING",
        number: "04",
        description: "Experiential, team-based learning that strengthens collaboration, trust, accountability, resilience, and execution.",
        icon: "https://framerusercontent.com/images/sjLWjZCc7PvVfqMbpk0WNk0.png?width=120&height=120"
    },
    {
        title: "TRAINING CONTENT CREATION",
        number: "05",
        description: "End-to-end content development including programme design, facilitator guides, participant resources, assessments, video learning, and immersive learning assets.",
        icon: "https://framerusercontent.com/images/C5SK8OiS7sAWlFOVLZQadkv3Oc.png?width=120&height=120"
    },
    {
        title: "TRAINING FACILITIES",
        number: "06",
        description: "Access to training spaces and delivery-ready environments for workshops, simulations, and cohort programmes.",
        icon: "https://framerusercontent.com/images/8v4syl4QLpJpmRYkHRxEPFxxMVA.png?width=100&height=100"
    },
    {
        title: "LEARNING MANAGEMENT SOLUTIONS",
        number: "07",
        description: "LMS access, structured learning paths, assessments, progress tracking, reinforcement, and reporting to sustain learning beyond sessions.",
        icon: "https://framerusercontent.com/images/JysmmACjgF2iADFwhVcO0mCa4.png?width=120&height=120"
    },
    {
        title: "LEADERSHIP DEVELOPMENT & SUCCESSION",
        number: "08",
        description: "Leadership pipelines built across levels, with role-based capability expectations, development plans, and readiness tracking.",
        icon: "https://framerusercontent.com/images/ozhlQGjkJwQi6J6kg44kqW17I.png?width=120&height=120"
    },
    {
        title: "COMPETENCY FRAMEWORKS",
        number: "09",
        description: "Competency models aligned to strategy, roles, and performance expectations, supported by proficiency definitions and assessment approaches.",
        icon: "https://framerusercontent.com/images/9j4K94Z5KC4m3elGl0HaEX2UTQ.png?width=120&height=120"
    }
];

export default function Services() {
    return (
        <section className="bg-white text-black relative mt-20 md:mt-32">
            <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row">

                {/* Left Column - Sticky */}
                <div className="w-full lg:w-1/2 lg:h-screen lg:sticky lg:top-0 flex flex-col justify-center px-6 py-20 md:px-12 lg:px-20 border-r border-[#E5E5E5]">
                    <div className="flex flex-col gap-12 max-w-xl">
                        <div className="flex items-center gap-2">
                            <span className="text-[#E31E24] text-xl font-bold">//</span>
                            <span className="text-black font-semibold tracking-wide">WHAT WE DELIVER</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase leading-tight tracking-tight">
                            COMPREHENSIVE LEARNING & DEVELOPMENT STRATEGIES.
                        </h2>

                        <div className="w-48 h-48 md:w-64 md:h-64 mt-8">
                            <img
                                src="https://framerusercontent.com/images/OKCsFR46k9HhF8aBwyvTJEHyFrY.svg?width=200&height=200"
                                alt="Abstract Shape"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column - Scrolling List */}
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col">
                        {services.map((service, index) => (
                            <ServiceCard key={index} service={service} index={index} />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}

function ServiceCard({ service, index }: { service: any, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5 }}
            className="group border-b border-[#E5E5E5] p-8 md:p-12 lg:p-16 hover:bg-[#FAFAFA] transition-colors duration-300 min-h-[250px] flex flex-col justify-center gap-6"
        >
            <div className="flex justify-between items-start w-full">
                {/* Icon */}
                <div className="w-12 h-12 md:w-16 md:h-16">
                    <img
                        src={service.icon}
                        alt={service.title}
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Number */}
                <span className="text-gray-400 text-lg font-medium">
                    {service.number}
                </span>
            </div>

            <div className="space-y-3">
                <h3 className="text-xl md:text-2xl font-semibold uppercase tracking-tight group-hover:text-[#E31E24] transition-colors">
                    {service.title}
                </h3>
                <p className="text-gray-500 text-base leading-relaxed max-w-lg">
                    {service.description}
                </p>
            </div>
        </motion.div>
    );
}
