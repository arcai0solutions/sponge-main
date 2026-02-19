"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden px-6">

            {/* Background Ambience */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#E31E24]/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#E31E24]/5 blur-[100px] rounded-full pointer-events-none" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50" />

            <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">

                {/* glitched 404 text effect */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative"
                >
                    <h1 className="text-[150px] md:text-[200px] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 select-none">
                        404
                    </h1>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        className="absolute top-0 left-0 w-full h-full text-[150px] md:text-[200px] font-bold leading-none tracking-tighter text-[#E31E24]/20 blur-sm select-none pointer-events-none"
                    >
                        404
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="flex flex-col items-center gap-6 mt-4"
                >
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                            Page Not Found
                        </h2>
                        <p className="text-white/60 text-lg md:text-xl max-w-md mx-auto leading-relaxed">
                            The page you are looking for doesn't exist or has been moved.
                            Let's get you back on track.
                        </p>
                    </div>

                    <div className="pt-8">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-[#E31E24] hover:text-white transition-all duration-300 group"
                        >
                            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            <span>Back to Home</span>
                        </Link>
                    </div>
                </motion.div>

            </div>

            {/* Footer Branding */}
            <div className="absolute bottom-10 left-0 w-full text-center">
                <p className="text-white/20 text-sm uppercase tracking-widest">Sponge Global</p>
            </div>

        </main>
    );
}
