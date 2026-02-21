"use client";

import { motion } from "framer-motion";
import NextImage from "next/image";
import React from "react";

const services = [
    {
        title: "Mindset Shaping Sessions",
        number: "01",
        description: "High-impact interventions designed to shift perspectives, challenge assumptions, and activate new ways of thinking that drive organizational capability.",
        icon: "/services/keynote.png"
    },
    {
        title: "Upskilling & Reskilling Workshops",
        number: "02",
        description: "Targeted programs focused on equipping your workforce with critical new competencies and upgrading existing skills to stay ahead of industry demands.",
        icon: "/services/workshop.png"
    },
    {
        title: "Succession Planning Solutions",
        number: "03",
        description: "Securing the future of your organization by strategically identifying, developing, and transitioning high-potential leaders into critical roles.",
        icon: "/services/transformational.png"
    },
    {
        title: "Competency Frameworks",
        number: "04",
        description: "Customized structures defining the core behaviors, knowledge, and skills required for success across all levels of your organization.",
        icon: "/services/keynote.png"
    },
    {
        title: "Inhouse & Outbound Team Building",
        number: "05",
        description: "Immersive indoor and outdoor experiences engineered to build trust, strengthen collaboration, and improve cross-functional dynamics for superior results.",
        icon: "/services/outbound.png"
    },
    {
        title: "eLearning Content Creation",
        number: "06",
        description: "End-to-end digital learning design, delivering engaging, accessible, and highly interactive multimedia modules tailored to your operational needs.",
        icon: "/services/content-creation.png"
    },
    {
        title: "LMS - Learning Management Solutions",
        number: "07",
        description: "Robust centralized platforms designed to streamline training delivery, track developmental milestones, and provide deep analytics on learning ROI.",
        icon: "/services/workshop.png"
    },
    {
        title: "Training Facilities & Locations",
        number: "08",
        description: "Dedicated physical spaces and environments optimized to foster focus, encourage deep learning, and facilitate effective cohort collaboration.",
        icon: "/services/facilities.png"
    }
];

export default function Services() {
    return (
        <section id="services" className="bg-white text-black relative z-30 mt-20 md:mt-32">
            <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row">

                {/* Left Column - Sticky */}
                <div className="w-full lg:w-1/2 lg:h-screen lg:sticky lg:top-24 flex flex-col justify-center px-6 py-20 md:px-12 lg:px-20 border-r border-[#E5E5E5]">
                    <div className="flex flex-col gap-12 max-w-xl">
                        <div className="flex items-center gap-2">
                            <span className="text-[#E31E24] text-xl font-bold">//</span>
                            <span className="text-black font-semibold tracking-wide">WHAT WE DELIVER</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase leading-tight tracking-tight">
                            COMPREHENSIVE LEARNING & DEVELOPMENT SOLUTIONS.
                        </h2>

                        <div className="w-48 h-48 md:w-64 md:h-64 mt-8 mx-auto lg:mx-0">
                            <NextImage
                                src="/services/abstract-shape.svg"
                                alt="Abstract Shape"
                                width={200}
                                height={200}
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
            className="group border-b border-[#E5E5E5] p-6 md:p-8 lg:p-10 hover:bg-[#FAFAFA] transition-colors duration-300 min-h-[180px] flex flex-col justify-center gap-5"
        >
            <div className="flex justify-between items-start w-full">
                {/* Icon */}
                <div className="w-12 h-12 md:w-16 md:h-16">
                    <NextImage
                        src={service.icon}
                        alt={service.title}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Number */}
                <span className="text-gray-400 text-lg font-medium">
                    {service.number}
                </span>
            </div>

            <div className="space-y-3">
                <h3 className="text-xl md:text-2xl font-semibold tracking-tight group-hover:text-[#E31E24] transition-colors">
                    {service.title}

                </h3>
                <p className="text-gray-500 text-base leading-relaxed max-w-lg">
                    {service.description}
                </p>
            </div>
        </motion.div>
    );
}
