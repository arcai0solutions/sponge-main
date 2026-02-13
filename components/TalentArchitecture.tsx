"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

const steps = [
    {
        number: "01",
        title: "Purpose & Measurement",
        subtitle: "The Foundation",
        description: "Governance, KPIs, success metrics, reporting, and analytics to ensure learning drives outcomes.",
        bg: "bg-zinc-900/50"
    },
    {
        number: "02",
        title: "Pre-Assessment",
        subtitle: "The Baseline",
        description: "Baseline proficiency mapping and gap analysis across technical, behavioral, and domain capabilities.",
        bg: "bg-zinc-800/50"
    },
    {
        number: "03",
        title: "Capability Pathways",
        subtitle: "The Core Structure",
        description: "Role-aligned learning pathways tailored to specific needs.",
        isWide: true,
        bg: "bg-zinc-900/50",
        subItems: [
            {
                title: "Domain Capability",
                text: "Functional mastery, business acumen, governance, risk, and compliance."
            },
            {
                title: "Behavioral Capability",
                text: "Customer centricity, stakeholder management, change leadership, communication, decision making."
            },
            {
                title: "Technical Capability",
                text: "Tools and processes, digital proficiency including AI, privacy, data, and cyber security."
            }
        ]
    },
    {
        number: "04",
        title: "Development & Reinforcement",
        subtitle: "The Growth Engine",
        description: "Education, experience, and exposure pathways supported by coaching, application assignments, certifications, and talent reviews.",
        bg: "bg-zinc-800/50"
    }
];

export default function TalentArchitecture() {
    const targetRef = useRef<HTMLDivElement | null>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    // Transform vertical scroll to horizontal movement
    // 0% -> 100% scroll maps to 0% -> -75% X translation (adjust based on total width)
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

    return (
        <section ref={targetRef} className="relative bg-black">

            {/* DESKTOP: Horizontal Scroll Container (Sticky) */}
            <div className="hidden lg:block h-[300vh]">
                <div className="sticky top-0 flex h-screen items-end pb-20 overflow-hidden">

                    {/* Fixed Title Component */}
                    <div className="absolute top-12 left-12 md:left-24 z-20">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="h-px w-12 bg-red-600"></span>
                            <span className="text-red-500 font-bold tracking-widest text-sm uppercase">Our Architecture</span>
                        </div>
                        <h2 className="text-5xl font-bold text-white uppercase tracking-tighter leading-[0.9]">
                            Talent <br />
                            <span className="text-zinc-600">Development</span>
                        </h2>
                    </div>

                    <motion.div style={{ x }} className="flex gap-12 pl-[40vw] pr-[10vw] items-center">
                        {steps.map((step, index) => (
                            <Card key={index} step={step} />
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* MOBILE: Vertical Stack */}
            <div className="lg:hidden flex flex-col gap-8 py-20 px-6 bg-black">
                <div className="mb-10">
                    <span className="text-red-500 font-bold tracking-widest text-sm uppercase mb-2 block">Our Architecture</span>
                    <h2 className="text-4xl font-bold text-white uppercase tracking-tighter leading-none">
                        Talent <span className="text-zinc-600">Development</span>
                    </h2>
                </div>
                {steps.map((step, index) => (
                    <Card key={index} step={step} isMobile />
                ))}
            </div>

        </section>
    );
}

function Card({ step, isMobile = false }: { step: any, isMobile?: boolean }) {
    return (
        <div
            className={`
                relative flex flex-col justify-between shrink-0
                ${isMobile ? 'w-full h-auto' : 'w-[50vw] h-[65vh]'}
                ${!isMobile && step.isWide ? 'w-[75vw]' : ''}
                rounded-3xl p-8 md:p-14
                border border-white/10 ${step.bg}
                group overflow-hidden
            `}
        >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-transparent to-transparent group-hover:from-red-900/10 transition-colors duration-700" />

            {/* Background Number */}
            <span className="absolute top-4 right-6 text-[8rem] md:text-[10rem] font-bold text-white/5 select-none pointer-events-none tracking-tighter leading-none z-0">
                {step.number}
            </span>

            {/* Content Top */}
            <div className="relative z-10 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <span className="text-red-500 font-mono text-xs uppercase tracking-widest border border-red-500/20 px-3 py-1 rounded-full">
                        Step {step.number}
                    </span>
                </div>

                <div>
                    <h3 className="text-3xl md:text-5xl font-bold text-white uppercase leading-none mb-2">
                        {step.title}
                    </h3>
                    <span className="text-zinc-500 text-sm md:text-base font-bold uppercase tracking-wide">
                        {step.subtitle}
                    </span>
                </div>

                <p className="text-zinc-400 text-lg leading-relaxed max-w-lg">
                    {step.description}
                </p>
            </div>

            {/* Sub Items (Example: Grid for Step 3) */}
            {step.subItems && (
                <div className={`
                    mt-8 grid gap-4 relative z-10
                    ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}
                `}>
                    {step.subItems.map((sub: any, i: number) => (
                        <div key={i} className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                            <h4 className="text-red-400 font-bold uppercase text-xs mb-3 tracking-wider">
                                {sub.title}
                            </h4>
                            <p className="text-zinc-400 text-xs leading-relaxed">
                                {sub.text}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Bottom Line Decoration */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
    );
}
