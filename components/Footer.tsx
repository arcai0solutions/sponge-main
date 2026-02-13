"use client";

import React from "react";
import NextImage from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full text-white pt-20 pb-10 px-6 md:px-12 lg:px-24 bg-gradient-to-t from-red-950/40 via-black to-black">
            <div className="max-w-[1400px] mx-auto flex flex-col gap-20">

                {/* Top Section: Logo & Tagline + Socials */}
                <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-24">

                    {/* Left: Logo & Tagline */}
                    <div className="flex flex-col gap-8 max-w-2xl">
                        {/* Logo */}
                        <div className="w-48 md:w-64">
                            <NextImage
                                src="/new-logo.jpeg"
                                alt="Sponge Global Logo"
                                width={200}
                                height={66}
                                className="w-full h-auto object-contain rounded-2xl"
                            />
                        </div>

                        {/* Tagline */}
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-5xl font-medium tracking-tight leading-tight">
                                Strengthening Organizations,<br />
                                Shaping Leaders.
                            </h2>
                            {/* Gradient Line */}
                            <div className="w-full h-px bg-white/20 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-l from-black to-[#E31E24] w-1/2" />
                            </div>
                        </div>
                    </div>

                    {/* Right: Socials & Links */}
                    <div className="flex flex-col md:flex-row gap-12 lg:gap-24 min-w-[300px]">

                        {/* Social Links column */}
                        <div className="flex flex-col gap-4 min-w-[140px]">
                            <SocialLink href="https://facebook.com" icon={Facebook} label="Facebook" />
                            <SocialLink href="https://instagram.com" icon={Instagram} label="Instagram" />
                            <SocialLink href="https://linkedin.com" icon={Linkedin} label="LinkedIn" />
                        </div>

                        {/* Navigation Links column */}
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <span className="text-[#E31E24] text-sm font-bold">//</span>
                                <span className="text-white font-semibold text-lg">Quick Links</span>
                            </div>

                            <div className="flex flex-col gap-3 text-white/70">
                                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                                <Link href="/about" className="hover:text-white transition-colors">About us</Link>
                                <Link href="/services" className="hover:text-white transition-colors">Services</Link>
                                <Link href="/job" className="hover:text-white transition-colors">Opportunity</Link>
                                <Link href="/contact" className="hover:text-white transition-colors">Contact us</Link>
                                <Link href="/404" className="hover:text-white transition-colors">404</Link>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Bottom Section: Branding & Credits */}
                <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <a
                        href="https://www.arcai.agency"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 group"
                    >
                        <span className="text-white/75 text-sm group-hover:text-white transition-colors">Designed by</span>
                        <div className="w-24 h-9 relative translate-y-1">
                            <NextImage
                                src="/arc logo.png"
                                alt="ARC AI Logo"
                                fill
                                className="object-contain object-left"
                            />
                        </div>
                    </a>

                    <p className="text-white/75 text-sm">
                        Powered by Next.js
                    </p>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon: Icon, label }: { href: string, icon: any, label: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-3"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-white" />
                    <span className="text-white/75 group-hover:text-white transition-colors">{label}</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor">
                        <path d="M1 11L11 1M11 1H1M11 1V11" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
            {/* Divider Line */}
            <div className="h-px w-full bg-white/20 group-hover:bg-[#E31E24] transition-colors duration-300" />
        </a>
    )
}
