import React from 'react';
import type { Metadata } from "next";
import ServicesHero from '@/components/ServicesPage/ServicesHero';
import ServicesOverview from '@/components/ServicesPage/ServicesOverview';
import ProgrammesModules from '@/components/ServicesPage/ProgrammesModules';
import ServicesCTA from '@/components/ServicesPage/ServicesCTA';
import Services from '@/components/Services';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
    title: "Services | Sponge Global",
    description: "Comprehensive learning and development strategies designed around business priorities. Explore our leadership, skill-building, and organizational capability solutions.",
    keywords: ["Corporate Training Services", "Leadership Programs", "Skill Building", "Sponge Global Services", "Talent Development", "Workshops"],
    authors: [{ name: "Sponge Global" }],
    alternates: {
        canonical: "https://sponge-global.com/services",
    },
    openGraph: {
        title: "Services | Sponge Global",
        description: "Comprehensive learning and development strategies designed around business priorities.",
        url: "https://sponge-global.com/services",
        siteName: "Sponge Global",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Sponge Global — Corporate Training & Learning Services",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Services | Sponge Global",
        description: "Comprehensive learning and development strategies designed around business priorities.",
        images: ["/og-image.png"],
    },
};

const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sponge-global.com" },
        { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://sponge-global.com/services" }
    ]
};

const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Sponge Global Learning & Development Services",
    "url": "https://sponge-global.com/services",
    "itemListElement": [
        {
            "@type": "ListItem", "position": 1,
            "item": {
                "@type": "Service",
                "name": "Mindset Shaping Sessions",
                "description": "High-impact interventions designed to shift perspectives, challenge assumptions, and activate new ways of thinking that drive organizational capability.",
                "provider": { "@type": "Organization", "name": "Sponge Global", "url": "https://sponge-global.com" },
                "serviceType": "Corporate Training",
                "url": "https://sponge-global.com/services"
            }
        },
        {
            "@type": "ListItem", "position": 2,
            "item": {
                "@type": "Service",
                "name": "Upskilling & Reskilling Workshops",
                "description": "Targeted programs focused on equipping your workforce with critical new competencies and upgrading existing skills to stay ahead of industry demands.",
                "provider": { "@type": "Organization", "name": "Sponge Global", "url": "https://sponge-global.com" },
                "serviceType": "Workforce Training",
                "url": "https://sponge-global.com/services"
            }
        },
        {
            "@type": "ListItem", "position": 3,
            "item": {
                "@type": "Service",
                "name": "Succession Planning Solutions",
                "description": "Securing the future of your organization by strategically identifying, developing, and transitioning high-potential leaders into critical roles.",
                "provider": { "@type": "Organization", "name": "Sponge Global", "url": "https://sponge-global.com" },
                "serviceType": "Leadership Development",
                "url": "https://sponge-global.com/services"
            }
        },
        {
            "@type": "ListItem", "position": 4,
            "item": {
                "@type": "Service",
                "name": "Competency Frameworks",
                "description": "Customized structures defining the core behaviors, knowledge, and skills required for success across all levels of your organization.",
                "provider": { "@type": "Organization", "name": "Sponge Global", "url": "https://sponge-global.com" },
                "serviceType": "Organizational Capability",
                "url": "https://sponge-global.com/services"
            }
        },
        {
            "@type": "ListItem", "position": 5,
            "item": {
                "@type": "Service",
                "name": "Inhouse & Outbound Team Building",
                "description": "Immersive indoor and outdoor experiences engineered to build trust, strengthen collaboration, and improve cross-functional dynamics.",
                "provider": { "@type": "Organization", "name": "Sponge Global", "url": "https://sponge-global.com" },
                "serviceType": "Team Building",
                "url": "https://sponge-global.com/services"
            }
        },
        {
            "@type": "ListItem", "position": 6,
            "item": {
                "@type": "Service",
                "name": "E-Learning Content Creation",
                "description": "End-to-end digital learning design, delivering engaging, accessible, and highly interactive multimedia modules tailored to your operational needs.",
                "provider": { "@type": "Organization", "name": "Sponge Global", "url": "https://sponge-global.com" },
                "serviceType": "eLearning",
                "url": "https://sponge-global.com/services"
            }
        },
        {
            "@type": "ListItem", "position": 7,
            "item": {
                "@type": "Service",
                "name": "LMS — Learning Management Solutions",
                "description": "Robust centralized platforms designed to streamline training delivery, track developmental milestones, and provide deep analytics on learning ROI.",
                "provider": { "@type": "Organization", "name": "Sponge Global", "url": "https://sponge-global.com" },
                "serviceType": "Learning Technology",
                "url": "https://sponge-global.com/services"
            }
        },
        {
            "@type": "ListItem", "position": 8,
            "item": {
                "@type": "Service",
                "name": "Training Facilities & Locations",
                "description": "Dedicated physical spaces and environments optimized to foster focus, encourage deep learning, and facilitate effective cohort collaboration.",
                "provider": { "@type": "Organization", "name": "Sponge Global", "url": "https://sponge-global.com" },
                "serviceType": "Training Facilities",
                "url": "https://sponge-global.com/services"
            }
        }
    ]
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "What types of corporate training does Sponge Global offer?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Sponge Global offers a full range of learning and development solutions including leadership development, mindset shaping sessions, upskilling & reskilling workshops, succession planning, competency frameworks, team building, eLearning content creation, and Learning Management Systems (LMS)."
            }
        },
        {
            "@type": "Question",
            "name": "Does Sponge Global tailor training programmes to specific industries?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Sponge Global customizes all programmes to the specific context, industry, role requirements, and budget of each client. Whether you are a startup or a multinational, training is designed around your unique business priorities."
            }
        },
        {
            "@type": "Question",
            "name": "How many clients has Sponge Global worked with?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Sponge Global has partnered with over 200 clients across multiple geographies and industries since its founding in 2011."
            }
        },
        {
            "@type": "Question",
            "name": "Does Sponge Global offer eLearning and digital learning solutions?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Sponge Global provides end-to-end eLearning content creation including interactive multimedia modules, as well as full Learning Management System (LMS) implementation to track training delivery and learning ROI."
            }
        },
        {
            "@type": "Question",
            "name": "How can I get in touch with Sponge Global for a training inquiry?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "You can contact Sponge Global through the contact page at https://sponge-global.com/contact or via WhatsApp at +94 71 368 7386 to request a consultation."
            }
        }
    ]
};

export default function ServicesPage() {
    return (
        <main className="bg-black min-h-screen text-white pt-32">
            <JsonLd data={breadcrumbSchema} />
            <JsonLd data={servicesSchema} />
            <JsonLd data={faqSchema} />
            <ServicesHero />
            <ServicesOverview />
            <Services />
            <ProgrammesModules />
            <ServicesCTA />
        </main>
    );
}



