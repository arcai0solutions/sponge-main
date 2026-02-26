'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, Headset } from 'lucide-react';
import Image from 'next/image';

const features = [
    {
        icon: Search,
        title: 'PROVEN TRACK RECORD',
        description: 'We have worked with over 200 clients across Geographies with an immaculate track record.',
    },
    {
        icon: Clock,
        title: 'TAILORED SOLUTIONS',
        description: 'Whether you are a startup or a multinational company, skilled or unskilled, we can tailor the sessions to your requirements.',
    },
    {
        icon: Headset,
        title: 'SUIT YOUR BUDGET',
        description: 'No matter how good the programme, if it’s not within your budget, we will carefully work with you to devise a solution that will suit your budget and deliver the intended outcomes.',
    },
];

const images = [
    '/abou1.png',
    '/about2.png',
    '/about3.png',
    '/about4.png',
    '/about5.png',
];

export default function WhyChooseUs() {
    return (
        <section className="bg-white text-black py-24 px-4 md:px-8 lg:px-16 overflow-hidden">
            <div className="max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    {/* Left Column - Headline Area */}
                    <div className="lg:col-span-4 flex flex-col gap-8">
                        <div className="flex items-center gap-2">
                            <span className="text-[#E31E24] text-lg font-bold">//</span>
                            <span className="text-lg font-medium text-black tracking-widest">WHY CHOOSE US</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight">
                            Trusted by <br /> 200+ <span className="text-gray-500">Clients.</span>
                        </h2>
                    </div>

                    {/* Right Column - Features & Carousel */}
                    <div className="lg:col-span-8 flex flex-col gap-16 pt-4">

                        {/* Features Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                            {features.map((feature, index) => (
                                <div key={index} className="flex flex-col gap-6 group">
                                    {/* Icon Container with Orange Stroke */}
                                    <div className="w-12 h-12 text-[#E31E24]">
                                        <feature.icon className="w-full h-full stroke-[1.5]" />
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-black">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-gray-200" />

                        {/* Carousel Area */}
                        <div className="w-full relative">
                            <div className="w-full overflow-hidden">
                                <motion.div
                                    className="flex gap-6 w-max"
                                    animate={{ x: '-50%' }}
                                    transition={{
                                        duration: 30,
                                        ease: 'linear',
                                        repeat: Infinity,
                                    }}
                                >
                                    {/* Repeat images 4 times to ensure smooth loop for fewer items */}
                                    {[...images, ...images, ...images, ...images].map((src, index) => (
                                        <div
                                            key={index}
                                            className="relative w-[280px] md:w-[320px] aspect-[4/3] flex-shrink-0 overflow-hidden"
                                        >
                                            <Image
                                                src={src}
                                                alt={`Portfolio image ${index}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </motion.div>
                            </div>
                            {/* Gradient Masks for Fade Output - Subtle white fade */}
                            <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                            <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
