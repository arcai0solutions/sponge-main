import type { Metadata } from 'next';
import ContactHero from '@/components/ContactHero';
import ContactForm from '@/components/ContactForm';
import JsonLd from '@/components/JsonLd';

const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sponge-global.com" },
        { "@type": "ListItem", "position": 2, "name": "Contact Us", "item": "https://sponge-global.com/contact" }
    ]
};

const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": "https://sponge-global.com/contact",
    "url": "https://sponge-global.com/contact",
    "name": "Contact Sponge Global",
    "description": "Get in touch with Sponge Global for expert corporate training and leadership development solutions. Book a consultation today.",
    "inLanguage": "en",
    "isPartOf": { "@id": "https://sponge-global.com/#website" },
    "about": { "@id": "https://sponge-global.com/#organization" }
};

export const metadata: Metadata = {
    title: 'Contact Us | Sponge Global',
    description: 'Get in touch with Sponge Global for expert corporate training and leadership development solutions. Book a consultation today.',
    keywords: ["Contact Sponge Global", "Training Inquiry", "Consultation", "Global Presence", "Book a Meeting"],
    authors: [{ name: "Sponge Global" }],
    alternates: {
        canonical: "https://sponge-global.com/contact",
    },
    openGraph: {
        title: 'Contact Us | Sponge Global',
        description: 'Get in touch with Sponge Global for expert corporate training and leadership development solutions.',
        url: "https://sponge-global.com/contact",
        siteName: "Sponge Global",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Contact Sponge Global",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: 'Contact Us | Sponge Global',
        description: 'Get in touch with Sponge Global for expert corporate training and leadership development solutions.',
        images: ["/og-image.png"],
    },
};

export default function ContactPage() {
    return (
        <main className="bg-black min-h-screen">
            <JsonLd data={breadcrumbSchema} />
            <JsonLd data={contactPageSchema} />
            <ContactHero />
            <ContactForm />
        </main>
    );
}


