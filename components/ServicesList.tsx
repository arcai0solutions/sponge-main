"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const programmes = [
    {
        title: "Strategic Thinking and Decision Making",
        description: "Strengthen strategic judgement, anticipate risks and opportunities, make balanced high-impact decisions, and align execution to strategy.",
        focusAreas: [
            "Business strategy foundations",
            "Internal and external environment analysis",
            "Opportunities, risks, and trade-offs",
            "Prioritization and execution choices",
            "Data-driven decision making"
        ],
        tools: "VUCA, Porter’s frameworks, 6Ps, Eisenhower Matrix, Six Thinking Hats, scenario planning, decision trade-off tools.",
        outcomes: "Strengthen strategic judgement, anticipate risks and opportunities, make balanced high-impact decisions, and align execution to strategy."
    },
    {
        title: "Leading Self and Others",
        description: "Lead with clarity and confidence, build trust, develop others, communicate with empathy, and drive sustained performance.",
        focusAreas: [
            "Self-awareness, values, strengths, emotional intelligence",
            "Ownership, resilience, time and energy management",
            "Trust, motivation, coaching, feedback",
            "Leadership communication and difficult conversations",
            "Team effectiveness, delegation, empowerment, collaboration"
        ],
        tools: "DISC/MBTI (as appropriate), Situational Leadership, Trust Equation, Tuckman model, resilience frameworks.",
        outcomes: "Lead with clarity and confidence, build trust, develop others, communicate with empathy, and drive sustained performance."
    },
    {
        title: "Creativity and Driving Innovation",
        description: "Generate practical ideas, improve solutions under uncertainty, and build habits that support continuous improvement.",
        focusAreas: [
            "Creativity in business",
            "Ideation techniques and problem framing",
            "Converting ideas into viable innovations",
            "Experimentation and managing innovation risk",
            "Embedding innovation into everyday work"
        ],
        tools: "Design thinking, SCAMPER, agile ways of working, value models, prioritization tools.",
        outcomes: "Generate practical ideas, improve solutions under uncertainty, and build habits that support continuous improvement."
    },
    {
        title: "Impactful Communication",
        description: "Communicate with structure and confidence, adapt to stakeholders, build trust, and influence outcomes.",
        focusAreas: [
            "Clarity, intent, audience alignment",
            "Leadership presence (verbal and non-verbal)",
            "Structured messaging and storytelling",
            "Active listening and questioning",
            "Influence and difficult conversations"
        ],
        tools: "3Vs, STAR storytelling, influence models, active listening techniques.",
        outcomes: "Communicate with structure and confidence, adapt to stakeholders, build trust, and influence outcomes."
    },
    {
        title: "Data Analytics and AI for Decision Making",
        description: "Make better decisions faster, communicate insights clearly, and build sustainable data-driven habits.",
        focusAreas: [
            "Decision quality and bias reduction",
            "Translating data into insights and recommendations",
            "Visualization and reporting",
            "Using modern AI productivity tools responsibly",
            "Data-driven storytelling under pressure"
        ],
        tools: "Analytics maturity models, Excel and dashboards, Power BI, DMAIC, Copilot/Gemini use cases, storytelling frameworks.",
        outcomes: "Make better decisions faster, communicate insights clearly, and build sustainable data-driven habits."
    },
    {
        title: "Stakeholder Management",
        description: "Strengthen influence, reduce friction, align priorities, and build collaborative stakeholder relationships.",
        focusAreas: [
            "Stakeholder identification and prioritization",
            "Expectations, needs, and communication planning",
            "Relationship building and trust",
            "Conflict navigation and alignment",
            "Influence strategies"
        ],
        tools: "Power-interest grid, RACI, stakeholder heatmaps, workshops, interviews, surveys.",
        outcomes: "Strengthen influence, reduce friction, align priorities, and build collaborative stakeholder relationships."
    },
    {
        title: "Change Management",
        description: "Lead change with structure, increase adoption, reduce resistance, and sustain business outcomes.",
        focusAreas: [
            "Change impact on people and performance",
            "Leadership role in change",
            "Communication planning and stakeholder alignment",
            "Managing resistance and building commitment",
            "Reinforcement, measurement, and feedback loops"
        ],
        tools: "ADKAR, VUCA, sources of power, habit and reinforcement frameworks.",
        outcomes: "Lead change with structure, increase adoption, reduce resistance, and sustain business outcomes."
    },
    {
        title: "Basic AI Fundamentals",
        description: "Build AI confidence, identify high-value use cases, guide adoption, and apply AI responsibly.",
        focusAreas: [
            "Business value of AI for teams and functions",
            "AI adoption mindsets and models",
            "Productivity stacks in Microsoft and Google ecosystems",
            "Identifying and prioritizing use cases",
            "Prompting practices and safe usage",
            "AI for analysis, reporting, and storytelling",
            "Privacy, ethics, and governance basics"
        ],
        tools: "Adoption models, prompt frameworks, enterprise AI use patterns, use case prioritization.",
        outcomes: "Build AI confidence, identify high-value use cases, guide adoption, and apply AI responsibly."
    },
    {
        title: "Art of Delegation for Leaders",
        description: "Delegate with clarity, build trust and ownership, develop talent, and strengthen team execution.",
        focusAreas: [
            "Delegation as a leadership capability",
            "What to delegate and what to retain",
            "Clarity, empowerment, and accountability",
            "Coaching and mentoring through delegation",
            "Cadences for review and feedback"
        ],
        tools: "Situational Leadership, DISC/MBTI (as appropriate), GROW coaching, STAR/SBA communication models.",
        outcomes: "Delegate with clarity, build trust and ownership, develop talent, and strengthen team execution."
    }
];

export default function ServicesList() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    const toggleService = (index: number) => {
        const isOpening = activeIndex !== index;
        setActiveIndex(isOpening ? index : null);

        if (isOpening) {
            setTimeout(() => {
                itemRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 400); // Wait for the expand animation
        }
    };

    return (
        <section id="programmes" className="bg-black text-white relative py-20 px-4 md:px-8 overflow-hidden">
            <div className="max-w-[1400px] mx-auto">

                {/* Header Grid - Matching strict design */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 md:mb-32">
                    <div className="flex flex-col">
                        <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-white mb-8">Programmes</h2>
                    </div>

                    {/* Animated Cross Icons */}
                    <div className="hidden md:flex gap-4 mb-2">
                        {[1, 2, 3, 4].map((_, i) => (
                            <motion.img
                                key={i}
                                src="/close-white.svg"
                                alt=""
                                aria-hidden="true"
                                className="w-6 h-6 opacity-80"
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
                            />
                        ))}
                    </div>

                    <div className="text-3xl md:text-4xl font-medium text-white/90">
                        ({programmes.length < 10 ? `0${programmes.length}` : programmes.length})
                    </div>
                </div>

                {/* Services List */}
                <div className="flex flex-col">
                    {programmes.map((programme, index) => (
                        <div
                            key={index}
                            ref={(el) => { itemRefs.current[index] = el; }}
                            className="group cursor-pointer"
                            onClick={() => toggleService(index)}
                        >
                            {/* Line Separator */}
                            <motion.div
                                initial={{ width: "0%" }}
                                whileInView={{ width: "100%" }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, ease: "easeInOut" }}
                                className="h-[1px] bg-[#E31E24] w-full"
                            />

                            <div className="flex flex-col lg:flex-row py-8 lg:py-12 gap-8 lg:gap-16 relative">

                                {/* Left Side: Number + Title */}
                                <div className="w-full lg:w-1/2 flex items-start gap-8 md:gap-16">
                                    <div className="text-base md:text-lg font-medium text-white/60 pt-1">
                                        {(index + 1).toString()}
                                    </div>
                                    <h3 className="text-2xl md:text-4xl font-medium leading-tight group-hover:text-gray-300 transition-colors">
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
                                        <div className="flex flex-col gap-6 lg:gap-8 pb-4 mt-2">
                                            <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                                                {programme.description}
                                            </p>

                                            <div className="grid md:grid-cols-2 gap-8 text-gray-300">
                                                <div>
                                                    <h4 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-[#E31E24]"></span> Focus Areas
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {programme.focusAreas.map((area, i) => (
                                                            <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
                                                                <span className="text-gray-500 mt-1">•</span>
                                                                {area}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="space-y-6">
                                                    <div>
                                                        <h4 className="text-white font-semibold text-lg mb-2">Tools & Frameworks</h4>
                                                        <p className="text-sm leading-relaxed text-gray-400">{programme.tools}</p>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-semibold text-lg mb-2">Outcomes</h4>
                                                        <p className="text-sm leading-relaxed text-gray-400">{programme.outcomes}</p>
                                                    </div>
                                                </div>
                                            </div>
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
                    <Link href="/contact" aria-label="Contact Sponge Global to discuss your training needs" className="inline-flex items-center gap-2 group">
                        <span className="w-3 h-3 bg-red-600 rounded-full group-hover:scale-125 transition-transform duration-300"></span>
                        <span className="text-white text-lg font-medium border-b border-transparent group-hover:border-white transition-colors">Get in touch</span>
                    </Link>
                </div>

            </div>
        </section>
    );
}
