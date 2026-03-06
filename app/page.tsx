import HeroScroll from '@/components/HeroScroll';
import About from '@/components/About';
import Services from '@/components/Services';
import ServicesList from '@/components/ServicesList';
import TalentArchitecture from '@/components/TalentArchitecture';
import WhyChooseUs from '@/components/WhyChooseUs';
import Preloader from '@/components/Preloader';
import LMSSection from '@/components/LMSSection';
import LearningLounge from '@/components/LearningLounge';
import ContactForm from '@/components/ContactForm';
import type { Metadata } from "next";
import JsonLd from '@/components/JsonLd';

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://sponge-global.com/#organization",
  "name": "Sponge Global",
  "url": "https://sponge-global.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://sponge-global.com/og-image.png",
    "width": 1200,
    "height": 630
  },
  "description": "Sponge Global is a learning and capability partner building stronger leaders and teams for 200+ clients worldwide. Founded in 2011, we deliver corporate training, leadership development, eLearning, and talent solutions.",
  "foundingDate": "2011",
  "slogan": "Transforming Talent, Driving Performance",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "url": "https://sponge-global.com/contact",
    "availableLanguage": "English"
  },
  "sameAs": [
    "https://www.linkedin.com/company/3069879/",
    "https://www.youtube.com/@sponge_global_training/shorts",
    "https://www.instagram.com/spongeglobal"
  ]
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://sponge-global.com/#website",
  "url": "https://sponge-global.com",
  "name": "Sponge Global",
  "description": "Learning & Capability Partner for 200+ clients worldwide.",
  "publisher": {
    "@id": "https://sponge-global.com/#organization"
  }
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://sponge-global.com/#localbusiness",
  "name": "Sponge Global",
  "url": "https://sponge-global.com",
  "image": "https://sponge-global.com/og-image.png",
  "description": "Corporate training, leadership development, and eLearning solutions provider based in Sri Lanka serving clients globally since 2011.",
  "foundingDate": "2011",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "LK",
    "addressRegion": "Western Province"
  },
  "priceRange": "$$",
  "openingHours": "Mo-Fr 09:00-18:00",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5",
    "reviewCount": "2",
    "bestRating": "5",
    "worstRating": "1"
  },
  "sameAs": [
    "https://www.linkedin.com/company/3069879/",
    "https://www.youtube.com/@sponge_global_training/shorts",
    "https://www.instagram.com/spongeglobal"
  ]
};

export const metadata: Metadata = {
  title: "Sponge Global | Learning & Capability Partner",
  description: "Sponge Global is a trusted learning partner building stronger leaders and teams for 200+ clients worldwide through expert facilitation and transformational training.",
  keywords: [
    "corporate training",
    "leadership development",
    "organizational capability",
    "Sponge Global",
    "transformational learning",
    "employee training",
    "business outcomes",
    "skill building workshops",
    "keynote sessions",
    "outbound training"
  ],
  authors: [{ name: "Sponge Global" }],
  alternates: {
    canonical: "https://sponge-global.com",
  },
  openGraph: {
    title: "Sponge Global | Learning & Capability Partner",
    description: "Practical learning solutions for organizations across industries and countries.",
    url: "https://sponge-global.com",
    siteName: "Sponge Global",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sponge Global — Learning & Capability Partner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sponge Global | Learning & Capability Partner",
    description: "Building stronger leaders and teams for 200+ clients worldwide.",
    images: ["/og-image.png"],
  },
};

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <JsonLd data={organizationSchema} />
      <JsonLd data={webSiteSchema} />
      <JsonLd data={localBusinessSchema} />
      <Preloader />
      <HeroScroll />
      <div className="relative z-20">
        <About />
        <Services />
        <ServicesList />
        <WhyChooseUs />
        <TalentArchitecture />
        <LMSSection />
        <LearningLounge />
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
      </div>
    </main>
  );
}
