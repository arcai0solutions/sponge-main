"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Preloader() {
    const text = "Designing learning that lasts";
    const characters = text.split("");
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Hide preloader after animation completes + small delay
        // Typing duration: ~1.5s (0.05 * 29 chars)
        // Hold: 0.5s
        const totalDuration = (characters.length * 0.05 * 1000) + 800;

        const timer = setTimeout(() => {
            setIsVisible(false);
        }, totalDuration);

        return () => clearTimeout(timer);
    }, [characters.length]);

    return (
        <AnimatePresence mode='wait'>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
                    initial={{ y: 0 }}
                    exit={{
                        y: "-100%",
                        transition: {
                            duration: 0.8,
                            ease: [0.76, 0, 0.24, 1] // Custom cubic-bezier for "premium" feel
                        }
                    }}
                >
                    <motion.div
                        className="text-3xl md:text-5xl lg:text-7xl font-bold text-red-500 tracking-tight text-center px-4"
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, transition: { duration: 0.4 } }} // Fade text out before slide completes
                        variants={{
                            hidden: { opacity: 1 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.05
                                }
                            }
                        }}
                    >
                        {characters.map((char, index) => (
                            <motion.span
                                key={index}
                                variants={{
                                    hidden: { opacity: 0, y: 10 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                            >
                                {char}
                            </motion.span>
                        ))}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
