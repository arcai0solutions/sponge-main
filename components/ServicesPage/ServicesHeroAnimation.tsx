"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Brain, TrendingUp, Target } from "lucide-react";

export default function ServicesHeroAnimation() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Create a master timeline that loops indefinitely
            const tl = gsap.timeline({ repeat: -1 });

            // Initial state setup for cards (static properties)
            gsap.set(".service-card", {
                xPercent: -50,
                yPercent: -50,
                top: "50%",
                left: "50%",
                willChange: "transform, opacity"
            });

            // Background orbit rotations (continuous standalone animation)
            gsap.to(".bg-orbit-1", { rotation: 360, duration: 40, repeat: -1, ease: "linear" });
            gsap.to(".bg-orbit-2", { rotation: -360, duration: 60, repeat: -1, ease: "linear" });

            // --- SEQUENCE TIMELINE ---

            // Reset at start of loop
            tl.set(".service-card", { x: 0, y: 0, scale: 0.5, autoAlpha: 0 });

            // 1. Mindset Shaping appears in center, then moves to position
            tl.to(".card-1", { autoAlpha: 1, scale: 1.1, duration: 0.8, ease: "back.out(1.5)" })
                .to(".card-1", { scale: 1, x: -100, y: -120, duration: 1.2, ease: "power3.inOut" });

            // 2. Upskilling appears in center, then moves to position (overlaps previous animation)
            tl.to(".card-2", { autoAlpha: 1, scale: 1.1, duration: 0.8, ease: "back.out(1.5)" }, "-=0.6")
                .to(".card-2", { scale: 1, x: 120, y: 0, duration: 1.2, ease: "power3.inOut" });

            // 3. Leadership appears in center, then moves to position
            tl.to(".card-3", { autoAlpha: 1, scale: 1.1, duration: 0.8, ease: "back.out(1.5)" }, "-=0.6")
                .to(".card-3", { scale: 1, x: -40, y: 130, duration: 1.2, ease: "power3.inOut" });

            // 4. Successive pulse/glow highlight across all cards
            tl.to(".service-card", {
                borderColor: "rgba(227, 30, 36, 0.8)",
                boxShadow: "0px 0px 30px rgba(227, 30, 36, 0.4)",
                stagger: 0.2,
                duration: 0.4,
            }, "-=0.2")
                .to(".service-card", {
                    borderColor: "rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", // Default shadow-2xl equivalent
                    stagger: 0.2,
                    duration: 0.6,
                }, "-=0.2");

            // 5. Hold the formation so the user can read the content
            tl.to({}, { duration: 4 });

            // 6. Transition out cleanly before looping
            tl.to(".service-card", {
                autoAlpha: 0,
                scale: 0.8,
                y: "+=30",
                duration: 1,
                stagger: 0.1,
                ease: "power2.in",
            });

        }, containerRef);

        return () => ctx.revert(); // Cleanup on unmount
    }, []);

    return (
        <div ref={containerRef} className="relative w-full aspect-square max-w-[500px] mx-auto flex items-center justify-center transform scale-[0.85] md:scale-100">

            {/* Background Orbit/Glow Elements */}
            <div className="bg-orbit-1 absolute w-[120%] h-[120%] rounded-full border border-white/5 border-dashed pointer-events-none" />
            <div className="bg-orbit-2 absolute w-[90%] h-[90%] rounded-full border border-[#E31E24]/10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#E31E24] rounded-full filter blur-[100px] opacity-20 pointer-events-none" />

            {/* Cards are positioned absolute. X/Y will be driven entirely by optimized GSAP CSS transforms */}

            {/* Card 1: Mindset Shaping */}
            <div className="service-card card-1 absolute glass-card p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 shadow-2xl flex items-center gap-4 w-60 z-10">
                <div className="p-3 bg-[#E31E24]/20 rounded-lg text-[#E31E24] shrink-0">
                    <Brain className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-semibold text-white text-sm">Mindset Shaping</h3>
                    <p className="text-gray-400 text-xs text-nowrap">Transform perspectives</p>
                </div>
            </div>

            {/* Card 2: Upskilling */}
            <div className="service-card card-2 absolute glass-card p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 shadow-2xl flex items-center gap-4 w-60 z-10">
                <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400 shrink-0">
                    <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-semibold text-white text-sm">Upskilling</h3>
                    <p className="text-gray-400 text-xs text-nowrap">Upgrade competencies</p>
                </div>
            </div>

            {/* Card 3: Leadership */}
            <div className="service-card card-3 absolute glass-card p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 shadow-2xl flex items-center gap-4 w-60 z-10">
                <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400 shrink-0">
                    <Target className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-semibold text-white text-sm">Leadership</h3>
                    <p className="text-gray-400 text-xs text-nowrap">Succession planning</p>
                </div>
            </div>
        </div>
    );
}
