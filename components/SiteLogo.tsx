"use client";

import NextImage from "next/image";
import Link from "next/link";
import React from "react";

interface SiteLogoProps {
    logoUrl?: string;
    className?: string;
}

export default function SiteLogo({ logoUrl = '/new-logo.jpeg', className = '' }: SiteLogoProps) {
    // The positioning classes (absolute top-4 left-6...) are standard for both sticky and non-sticky 
    // usage if we want them to overlay the hero. If non-sticky, they need to be absolute relative to the body/page.

    return (
        <div className={`absolute top-4 left-6 md:top-8 md:left-12 lg:top-10 lg:left-16 z-50 rounded-2xl overflow-hidden sm-logo pointer-events-auto ${className}`} aria-label="Logo">
            <Link href="/" aria-label="Go to homepage">
                <NextImage
                    src={logoUrl}
                    alt="Logo"
                    width={160}
                    height={160}
                    className="w-32 md:w-40 h-auto object-contain cursor-pointer"
                    draggable={false}
                    priority // Priority loading for LCP
                />
            </Link>
        </div>
    );
}
