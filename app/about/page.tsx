import React from 'react';
import type { Metadata } from "next";
import AboutHero from '@/components/AboutPage/AboutHero';
import SustainLearning from '@/components/AboutPage/SustainLearning';
import WhySponge from '@/components/AboutPage/WhySponge';

export const metadata: Metadata = {
    title: "About Us | Sponge Global",
    description: "Sponge Global is a learning and capability partner building stronger leaders and teams since 2011.",
    keywords: ["About Sponge Global", "Organizational Capability", "Leadership Development", "Learning Partner", "Employee Training"],
    authors: [{ name: "Sponge Global" }],
    openGraph: {
        title: "About Us | Sponge Global",
        description: "Sponge Global is a learning and capability partner building stronger leaders and teams since 2011.",
        url: "https://sponge-global.com/about",
        siteName: "Sponge Global",
        images: [
            {
                url: "/sponge-favicon.png",
                width: 1200,
                height: 630,
                alt: "About Sponge Global",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "About Us | Sponge Global",
        description: "Sponge Global is a learning and capability partner building stronger leaders and teams since 2011.",
        images: ["/sponge-favicon.png"],
    },
};

export default function AboutPage() {
    return (
        <main className="bg-black min-h-screen text-white pt-48">
            <AboutHero />
            <SustainLearning />
            <WhySponge />
        </main>
    );
}
