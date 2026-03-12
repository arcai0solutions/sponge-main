"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const programmes = [
    {
        title: "Strategic Thinking",
        description: "Develop the ability to see the bigger picture, anticipate market shifts, and align organizational resources to long-term goals.",
        focusAreas: [
            "Business environment scanning and foresight",
            "Vision setting and strategic alignment",
            "Opportunity identification and risk assessment",
            "Portfolio thinking and resource allocation",
            "Translating strategy into actionable plans"
        ],
        tools: "PESTLE, SWOT, Porter's Five Forces, Balanced Scorecard, Blue Ocean Strategy, scenario planning.",
        outcomes: "Think strategically at every level, connect daily decisions to long-term objectives, and drive sustainable competitive advantage."
    },
    {
        title: "Customer Centricity",
        description: "Build a culture that places the customer at the heart of every decision, process, and innovation.",
        focusAreas: [
            "Understanding customer needs and expectations",
            "Customer journey mapping and experience design",
            "Voice of the customer (VoC) analysis",
            "Service excellence and recovery strategies",
            "Building customer loyalty and advocacy"
        ],
        tools: "Customer journey maps, NPS frameworks, empathy mapping, service blueprints, CX maturity models.",
        outcomes: "Deliver exceptional customer experiences, increase retention and loyalty, and embed customer-first thinking across the organization."
    },
    {
        title: "Data Analytics and Artificial Intelligence",
        description: "Leverage data and AI to make smarter decisions, uncover insights, and drive innovation across the business.",
        focusAreas: [
            "Data literacy and analytical thinking",
            "Translating data into actionable insights",
            "AI fundamentals and responsible adoption",
            "Productivity tools powered by AI (Copilot, Gemini)",
            "Data visualization and storytelling",
            "Privacy, ethics, and governance basics"
        ],
        tools: "Analytics maturity models, Power BI, Excel dashboards, DMAIC, prompt engineering frameworks, AI use case prioritization.",
        outcomes: "Make better decisions faster, communicate insights clearly, adopt AI responsibly, and build sustainable data-driven habits."
    },
    {
        title: "Decision Making & Problem Solving",
        description: "Strengthen the ability to analyze complex situations, evaluate options, and make sound decisions under pressure.",
        focusAreas: [
            "Structured problem-solving methodologies",
            "Root cause analysis and critical thinking",
            "Cognitive biases and decision traps",
            "Evaluating trade-offs and managing ambiguity",
            "Collaborative decision-making techniques"
        ],
        tools: "Six Thinking Hats, Ishikawa diagrams, 5 Whys, Eisenhower Matrix, decision matrices, Kepner-Tregoe analysis.",
        outcomes: "Solve problems systematically, reduce bias in decision-making, and build confidence in navigating high-stakes situations."
    },
    {
        title: "Change Management",
        description: "Lead change with structure, increase adoption, reduce resistance, and sustain business outcomes.",
        focusAreas: [
            "Change impact on people and performance",
            "Leadership role in driving and sustaining change",
            "Communication planning and stakeholder alignment",
            "Managing resistance and building commitment",
            "Reinforcement, measurement, and feedback loops"
        ],
        tools: "ADKAR, Kotter's 8-Step Model, VUCA frameworks, sources of power, habit and reinforcement frameworks.",
        outcomes: "Lead change initiatives with confidence, increase adoption rates, minimize disruption, and sustain long-term business outcomes."
    },
    {
        title: "Stakeholder Management",
        description: "Strengthen influence, reduce friction, align priorities, and build collaborative stakeholder relationships.",
        focusAreas: [
            "Stakeholder identification and prioritization",
            "Expectations, needs, and communication planning",
            "Relationship building and trust development",
            "Conflict navigation and alignment techniques",
            "Influence strategies across organizational levels"
        ],
        tools: "Power-interest grid, RACI matrix, stakeholder heatmaps, influence mapping, engagement planning workshops.",
        outcomes: "Strengthen influence, reduce friction, align priorities, and build productive collaborative stakeholder relationships."
    },
    {
        title: "Leading Self & Others",
        description: "Lead with clarity and confidence, build trust, develop others, communicate with empathy, and drive sustained performance.",
        focusAreas: [
            "Self-awareness, values, strengths, and emotional intelligence",
            "Ownership, resilience, time and energy management",
            "Trust building, motivation, coaching, and feedback",
            "Leadership communication and difficult conversations",
            "Team effectiveness, delegation, empowerment, and collaboration"
        ],
        tools: "DISC/MBTI profiling, Situational Leadership, Trust Equation, Tuckman model, resilience and mindfulness frameworks.",
        outcomes: "Lead with clarity and confidence, build trust, develop others, communicate with empathy, and drive sustained team performance."
    },
    {
        title: "Impactful Communication",
        description: "Communicate with structure and confidence, adapt to stakeholders, build trust, and influence outcomes.",
        focusAreas: [
            "Clarity, intent, and audience alignment",
            "Leadership presence — verbal and non-verbal",
            "Structured messaging and storytelling",
            "Active listening and powerful questioning",
            "Influence, persuasion, and difficult conversations"
        ],
        tools: "3Vs framework, STAR storytelling, influence models, active listening techniques, presentation frameworks.",
        outcomes: "Communicate with structure and confidence, adapt messaging to any audience, build trust, and influence outcomes effectively."
    },
    {
        title: "Creativity & Innovation",
        description: "Generate practical ideas, improve solutions under uncertainty, and build habits that support continuous improvement.",
        focusAreas: [
            "Creativity as a business capability",
            "Ideation techniques and problem reframing",
            "Converting ideas into viable innovations",
            "Experimentation and managing innovation risk",
            "Embedding innovation into everyday work"
        ],
        tools: "Design thinking, SCAMPER, lateral thinking, agile ways of working, value models, innovation canvas.",
        outcomes: "Generate practical ideas, improve solutions under uncertainty, and build habits that support continuous improvement and innovation."
    },
    {
        title: "Team Work & Collaboration",
        description: "Build high-performing teams that communicate openly, leverage diverse strengths, and deliver results together.",
        focusAreas: [
            "Team dynamics and stages of development",
            "Building psychological safety and trust",
            "Leveraging diversity and complementary strengths",
            "Cross-functional collaboration and alignment",
            "Conflict resolution and constructive feedback"
        ],
        tools: "Tuckman's model, Lencioni's Five Dysfunctions, Belbin Team Roles, DISC profiling, team charter frameworks.",
        outcomes: "Build cohesive teams, foster a culture of collaboration, resolve conflict constructively, and consistently deliver collective results."
    },
    {
        title: "Coaching & Mentoring",
        description: "Develop the skills to coach and mentor others effectively, unlocking potential and accelerating growth.",
        focusAreas: [
            "Coaching vs. mentoring — when and how to apply each",
            "Building a coaching mindset and culture",
            "Powerful questioning and active listening",
            "Goal setting, accountability, and progress tracking",
            "Giving and receiving developmental feedback"
        ],
        tools: "GROW model, OSCAR framework, Situational Leadership, feedback models (SBI, STAR), mentoring best practices.",
        outcomes: "Develop coaching capabilities, unlock team potential, accelerate individual growth, and build a sustainable coaching culture."
    },
    {
        title: "Digital Transformation",
        description: "Equip leaders and teams to navigate and drive digital change, from mindset shifts to technology adoption.",
        focusAreas: [
            "Digital mindset and organizational readiness",
            "Understanding emerging technologies and their business impact",
            "Leading digital change and managing disruption",
            "Agile and lean approaches to transformation",
            "Building digital capabilities across the workforce"
        ],
        tools: "Digital maturity assessments, agile frameworks, change management for digital, technology adoption models, digital roadmapping.",
        outcomes: "Navigate digital disruption confidently, lead technology-driven change, and build organizational capabilities for a digitally transformed future."
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
