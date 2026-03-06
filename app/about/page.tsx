import React from 'react';
import type { Metadata } from "next";
import PremiumAboutHero from '@/components/AboutPage/PremiumAboutHero';
import CompanyVision from '@/components/AboutPage/CompanyVision';
import AboutStats from '@/components/AboutPage/AboutStats';
import WhyChooseUs from '@/components/WhyChooseUs';
import TalentArchitecture from '@/components/TalentArchitecture';
import ContactForm from '@/components/ContactForm';
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
        <main className="bg-black min-h-screen text-white">
            <JsonLd data={breadcrumbSchema} />
            <JsonLd data={aboutPageSchema} />

            <PremiumAboutHero />
            <CompanyVision />
            <AboutStats />
            <WhyChooseUs />
            <TalentArchitecture />

            {/* Contact Form Section matching the user's request to add contact details */}
            <div className="bg-black pt-24 pb-12">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-12 h-[1px] bg-[#E31E24]"></span>
                        <span className="text-[#E31E24] font-bold tracking-widest text-sm uppercase">Get In Touch</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white">
                        LET'S CONNECT.
                    </h2>
                </div>
                <ContactForm />
            </div>

        </main>
    );
}
