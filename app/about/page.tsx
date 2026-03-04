import React from 'react';
import type { Metadata } from "next";
import AboutHero from '@/components/AboutPage/AboutHero';
import SustainLearning from '@/components/AboutPage/SustainLearning';
import WhySponge from '@/components/AboutPage/WhySponge';
import JsonLd from '@/components/JsonLd';

const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sponge-global.com" },
        { "@type": "ListItem", "position": 2, "name": "About Us", "item": "https://sponge-global.com/about" }
    ]
};

const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": "https://sponge-global.com/about",
    "url": "https://sponge-global.com/about",
    "name": "About Sponge Global",
    "description": "Sponge Global is a learning and capability partner founded in 2011. We design and deliver practical learning solutions for organizations across industries and countries, supported by a multi-disciplinary team.",
    "inLanguage": "en",
    "isPartOf": { "@id": "https://sponge-global.com/#website" },
    "about": {
        "@type": "Organization",
        "@id": "https://sponge-global.com/#organization",
        "name": "Sponge Global",
        "foundingDate": "2011",
        "description": "An end-to-end learning partner dedicated to addressing your most critical workforce performance challenges through the seamless integration of learning, talent, and technology.",
        "numberOfEmployees": { "@type": "QuantitativeValue", "minValue": 10 },
        "knowsAbout": [
            "Corporate Training", "Leadership Development", "eLearning",
            "Talent Management", "Organizational Capability", "Team Building",
            "Succession Planning", "Competency Frameworks"
        ]
    }
};


export const metadata: Metadata = {
    title: "About Us | Sponge Global",
    description: "Sponge Global is a learning and capability partner building stronger leaders and teams since 2011.",
    keywords: ["About Sponge Global", "Organizational Capability", "Leadership Development", "Learning Partner", "Employee Training"],
    authors: [{ name: "Sponge Global" }],
    alternates: {
        canonical: "https://sponge-global.com/about",
    },
    openGraph: {
        title: "About Us | Sponge Global",
        description: "Sponge Global is a learning and capability partner building stronger leaders and teams since 2011.",
        url: "https://sponge-global.com/about",
        siteName: "Sponge Global",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "About Sponge Global — Learning Partner Since 2011",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "About Us | Sponge Global",
        description: "Sponge Global is a learning and capability partner building stronger leaders and teams since 2011.",
        images: ["/og-image.png"],
    },
};

export default function AboutPage() {
    return (
        <main className="bg-black min-h-screen text-white pt-48">
            <JsonLd data={breadcrumbSchema} />
            <JsonLd data={aboutPageSchema} />
            <AboutHero />
            <SustainLearning />
            <WhySponge />
        </main>
    );
}
