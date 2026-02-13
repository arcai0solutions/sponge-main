import React from 'react';
import type { Metadata } from "next";
import ServicesHero from '@/components/ServicesPage/ServicesHero';
import ServicesOverview from '@/components/ServicesPage/ServicesOverview';
import ProgrammesModules from '@/components/ServicesPage/ProgrammesModules';
import ServicesCTA from '@/components/ServicesPage/ServicesCTA';
import Services from '@/components/Services'; // Reusing existing component for "Service Areas"

export const metadata: Metadata = {
    title: "Services | Sponge Global",
    description: "Comprehensive learning and development strategies designed around business priorities. Explore our leadership, skill-building, and organizational capability solutions.",
    keywords: ["Corporate Training Services", "Leadership Programs", "Skill Building", "Sponge Global Services", "Talent Development", "Workshops"],
    authors: [{ name: "Sponge Global" }],
    openGraph: {
        title: "Services | Sponge Global",
        description: "Comprehensive learning and development strategies designed around business priorities.",
        url: "https://sponge-global.com/services",
        siteName: "Sponge Global",
        images: [
            {
                url: "/sponge-favicon.png",
                width: 1200,
                height: 630,
                alt: "Sponge Global Services",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Services | Sponge Global",
        description: "Comprehensive learning and development strategies designed around business priorities.",
        images: ["/sponge-favicon.png"],
    },
};

export default function ServicesPage() {
    return (
        <main className="bg-black min-h-screen text-white pt-32">
            <ServicesHero />
            <ServicesOverview />
            {/* We reuse the existing Services component for the 'Service Areas' section, 
            but we might need to wrap it or adjust styling if it expects a white background. 
            The existing component has 'bg-white text-black'. Perfect contrast. */}
            <Services />
            <ProgrammesModules />
            <ServicesCTA />
        </main>
    );
}
