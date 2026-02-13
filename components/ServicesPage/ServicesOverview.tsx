
"use client";

import { motion } from "framer-motion";
import React from "react";

export default function ServicesOverview() {
    return (
        <section className="bg-black py-20 px-6 md:px-12 lg:px-20 border-b border-gray-900">
            <div className="max-w-4xl mx-auto text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-4xl font-bold text-white mb-8"
                >
                    Transforming Capability into <span className="text-[#E31E24]">Business Results</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg md:text-xl text-gray-400 leading-relaxed"
                >
                    We don't just deliver training; we build ecosystems of learning that drive performance.
                    From strategic thinking to operational excellence, our programmes are crafted to elevate
                    talent at every level of your organization.
                </motion.p>
            </div>
        </section>
    );
}
