import React from 'react';
import type { Metadata } from 'next';
import ClientsHero from '@/components/ClientsPage/ClientsHero';
import JsonLd from '@/components/JsonLd';
import FeedbackSection from '@/components/ClientsPage/FeedbackSection';

const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sponge-global.com" },
        { "@type": "ListItem", "position": 2, "name": "Our Clients", "item": "https://sponge-global.com/clients" }
    ]
};

const reviewsSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://sponge-global.com/#localbusiness",
    "name": "Sponge Global",
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5",
        "reviewCount": "2",
        "bestRating": "5",
        "worstRating": "1"
    },
    "review": [
        {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Tharushka Fernando" },
            "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
            "name": "Excellent Training for Ceylinco Life Insurance",
            "reviewBody": "We concluded the final round last week, and the senior board members were extremely impressed with the quality of the presentations, particularly the confidence, structure, and language used. They even inquired about the trainer behind the sessions, as they clearly noticed a significant improvement compared to previous competitions.",
            "publisher": { "@type": "Organization", "name": "Ceylinco Life Insurance Ltd" }
        },
        {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Isuru Chandradasa" },
            "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
            "name": "Outstanding HR Analytics Bootcamp Contribution",
            "reviewBody": "Based on student feedback, the bootcamp has been a resounding success. Participants highly appreciated the clarity, relevance, and practical orientation of the sessions. Your contribution played a vital role in creating this meaningful learning experience.",
            "publisher": { "@type": "Organization", "name": "University of Colombo — Department of Human Resources Management" }
        }
    ]
};


export const metadata: Metadata = {
    title: "Our Clients | Sponge Global",
    description: "See what 200+ clients across industries and geographies say about Sponge Global's corporate training and leadership development programmes.",
    keywords: ["Sponge Global Clients", "Corporate Training Testimonials", "Leadership Development Reviews", "Client Feedback", "Training Success Stories"],
    authors: [{ name: "Sponge Global" }],
    alternates: {
        canonical: "https://sponge-global.com/clients",
    },
    openGraph: {
        title: "Our Clients | Sponge Global",
        description: "See what 200+ clients across industries and geographies say about Sponge Global's training programmes.",
        url: "https://sponge-global.com/clients",
        siteName: "Sponge Global",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Sponge Global — Trusted by 200+ Clients",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Our Clients | Sponge Global",
        description: "See what 200+ clients across industries say about Sponge Global's training programmes.",
        images: ["/og-image.png"],
    },
};

export default function ClientsPage() {
    return (
        <main className="bg-black min-h-screen text-white pt-24 md:pt-0">
            <JsonLd data={breadcrumbSchema} />
            <JsonLd data={reviewsSchema} />
            <ClientsHero />
            <FeedbackSection />
        </main>
    );
}
