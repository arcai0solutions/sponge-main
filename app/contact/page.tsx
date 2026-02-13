import type { Metadata } from 'next';
import ContactHero from '@/components/ContactHero';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
    title: 'Contact Us | Sponge Global',
    description: 'Get in touch with Sponge Global for expert corporate training and leadership development solutions. Book a consultation today.',
    keywords: ["Contact Sponge Global", "Training Inquiry", "Consultation", "Global Presence", "Book a Meeting"],
    authors: [{ name: "Sponge Global" }],
    openGraph: {
        title: 'Contact Us | Sponge Global',
        description: 'Get in touch with Sponge Global for expert corporate training and leadership development solutions.',
        url: "https://sponge-global.com/contact",
        siteName: "Sponge Global",
        images: [
            {
                url: "/sponge-favicon.png",
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
        images: ["/sponge-favicon.png"],
    },
};

export default function ContactPage() {
    return (
        <main className="bg-black min-h-screen">
            <ContactHero />
            <ContactForm />
        </main>
    );
}
