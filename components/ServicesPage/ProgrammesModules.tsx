
"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; // Assuming lucide-react is installed or similar icons

// Define the data structure for programmes
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

export default function ProgrammesModules() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="bg-black text-white py-20 px-6 md:px-12 lg:px-20">
            <div className="max-w-[1400px] mx-auto">
                <div className="mb-16">
                    <span className="text-[#E31E24] font-bold text-sm tracking-widest uppercase mb-2 block">// Deep Dive</span>
                    <h2 className="text-4xl md:text-5xl font-bold">Programmes and Modules</h2>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {programmes.map((programme, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`border border-gray-800 rounded-xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'bg-[#111] border-[#E31E24]/30' : 'bg-black hover:border-gray-600'}`}
                        >
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="w-full flex justify-between items-center p-6 md:p-8 text-left focus:outline-none"
                            >
                                <div>
                                    <h3 className={`text-2xl font-bold mb-2 ${openIndex === index ? 'text-[#E31E24]' : 'text-white'}`}>
                                        {programme.title}
                                    </h3>
                                    <p className="text-gray-400 max-w-2xl hidden md:block">
                                        {programme.description}
                                    </p>
                                </div>
                                <div className={`p-2 rounded-full ${openIndex === index ? 'bg-[#E31E24]/10 text-[#E31E24]' : 'bg-gray-900 text-gray-400'}`}>
                                    {openIndex === index ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                </div>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="p-6 md:p-8 pt-0 border-t border-gray-800 text-gray-300 grid md:grid-cols-2 gap-8">

                                    {/* Focus Areas */}
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

                                    {/* Tools & Outcomes */}
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
                    ))}
                </div>
            </div>
        </section>
    );
}
