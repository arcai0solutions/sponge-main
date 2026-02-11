"use client";

import { useScroll, useTransform, motion, MotionValue } from 'framer-motion';
import React, { useRef, useEffect, useState, useMemo } from 'react';

// Build the ACTUAL list of frame numbers that exist in /sponge-hero/
// Frames 001-018, then 053-160 (no 019-052)
function getFramePaths(): string[] {
    const paths: string[] = [];
    for (let i = 1; i <= 18; i++) {
        paths.push(`/sponge-hero/ezgif-frame-${String(i).padStart(3, '0')}.jpg`);
    }
    for (let i = 53; i <= 160; i++) {
        paths.push(`/sponge-hero/ezgif-frame-${String(i).padStart(3, '0')}.jpg`);
    }
    return paths;
}

export default function About() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const framePaths = useMemo(() => getFramePaths(), []);
    const frameCount = framePaths.length; // 126 actual frames

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Preload all images
    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            const loaded: HTMLImageElement[] = new Array(framePaths.length);

            await Promise.all(
                framePaths.map(
                    (src, idx) =>
                        new Promise<void>((resolve) => {
                            const img = new Image();
                            img.src = src;
                            img.onload = () => {
                                loaded[idx] = img;
                                resolve();
                            };
                            img.onerror = () => {
                                console.warn(`Failed: ${src}`);
                                resolve();
                            };
                        })
                )
            );

            if (!cancelled) {
                imagesRef.current = loaded;
                setIsLoaded(true);
            }
        };

        load();
        return () => { cancelled = true; };
    }, [framePaths]);

    // Canvas render loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !isLoaded) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const drawFrame = (index: number) => {
            const img = imagesRef.current[index];
            if (!img) return;

            const cw = canvas.width;
            const ch = canvas.height;
            const ir = img.width / img.height;
            const cr = cw / ch;

            let dw: number, dh: number, dx: number, dy: number;

            if (cr > ir) {
                dw = cw;
                dh = cw / ir;
                dx = 0;
                dy = (ch - dh) / 2;
            } else {
                dh = ch;
                dw = ch * ir;
                dx = (cw - dw) / 2;
                dy = 0;
            }

            ctx.clearRect(0, 0, cw, ch);
            ctx.drawImage(img, dx, dy, dw, dh);
        };

        const resize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;

            // Redraw after resize
            const p = scrollYProgress.get();
            drawFrame(Math.min(frameCount - 1, Math.max(0, Math.floor(p * (frameCount - 1)))));
        };

        resize();
        window.addEventListener('resize', resize);

        const unsub = scrollYProgress.on('change', (v) => {
            const idx = Math.min(frameCount - 1, Math.max(0, Math.floor(v * (frameCount - 1))));
            requestAnimationFrame(() => drawFrame(idx));
        });

        return () => {
            window.removeEventListener('resize', resize);
            unsub();
        };
    }, [isLoaded, scrollYProgress, frameCount]);

    return (
        <section ref={containerRef} className="h-[400vh] relative bg-black">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
                {/* Canvas Background */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                />

                {/* Black overlay for text readability */}
                <div className="absolute inset-0 bg-black/60 z-10" />

                {/* Content Container */}
                <div className="relative z-20 w-full h-full max-w-5xl mx-auto pointer-events-none">
                    {/* Component handles its own positioning */}
                    <SequentialParagraph progress={scrollYProgress} />
                </div>
            </div>
        </section>
    );
}

/* ─── Sequential Line Animation (Strict One-by-One) ─── */

function SequentialParagraph({ progress }: { progress: MotionValue<number> }) {
    // Exact 5 sentences as requested, max 2 rows each
    const lines = [
        "Sponge Global is a learning and capability partner founded in 2011.",
        "We design and deliver practical learning solutions for organizations\nacross industries and countries.",
        "Our work is supported by a multi-disciplinary team of experts.",
        "We build capability through keynote sessions, short-term workshops,\nand transformational learning programmes.",
        "Everything we do is aligned to business goals, role requirements,\nand measurable performance outcomes.",
    ];

    return (
        <div className="absolute bottom-10 md:bottom-20 left-0 right-0 h-40 md:h-56 lg:h-72 flex items-center justify-center overflow-hidden">
            {lines.map((line, i) => (
                <StrictSequentialLine
                    key={i}
                    index={i}
                    total={lines.length}
                    progress={progress}
                >
                    {line}
                </StrictSequentialLine>
            ))}
        </div>
    );
}

function StrictSequentialLine({
    children,
    index,
    total,
    progress
}: {
    children: string,
    index: number,
    total: number,
    progress: MotionValue<number>
}) {
    // Each line owns a slice of the scroll progress
    const slice = 1 / total;
    const start = index * slice;
    const end = start + slice;

    // Sub-timing within the slice:
    // 0% - 20%: Enter from bottom (Skipped for first line)
    // 20% - 80%: Hold valid
    // 80% - 100%: Exit to top
    const enterEnd = start + (slice * 0.2);
    const exitStart = end - (slice * 0.2);

    // Dynamic transforms based on index
    // If it's the first line, we want it visible FROM THE START (0), not animating in.
    const isFirst = index === 0;

    // Y Position:
    // Normal: 100% (below) -> 0% (center)
    // First Line: 0% (center) -> 0% (center) for the entrance phase, bypassing animation
    const y = useTransform(
        progress,
        [start, enterEnd, exitStart, end],
        [isFirst ? '0%' : '100%', '0%', '0%', '-100%']
    );

    // Opacity:
    // Normal: 0 -> 1
    // First Line: 1 -> 1 for the entrance phase
    const opacity = useTransform(
        progress,
        [start, enterEnd, exitStart, end],
        [isFirst ? 1 : 0, 1, 1, 0]
    );

    // Visibility toggle to ensure we don't see things outside their range
    const display = useTransform(progress, (v) => {
        if (isFirst) return v <= end ? "block" : "none";
        return (v >= start && v <= end) ? "block" : "none";
    });

    return (
        <motion.div
            style={{ y, opacity, display }}
            className="absolute w-full px-6 md:px-12 lg:px-24 will-change-transform"
        >
            <p className="text-2xl md:text-3xl lg:text-5xl font-medium leading-relaxed text-white text-center whitespace-pre-line">
                {children}
            </p>
        </motion.div>
    );
}
