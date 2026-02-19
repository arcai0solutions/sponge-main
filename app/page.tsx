import HeroScroll from '@/components/HeroScroll';
import About from '@/components/About';
import Services from '@/components/Services';
import ServicesList from '@/components/ServicesList';
import TalentArchitecture from '@/components/TalentArchitecture';
import WhyChooseUs from '@/components/WhyChooseUs';
import Preloader from '@/components/Preloader';
import LMSSection from '@/components/LMSSection';
import LearningLounge from '@/components/LearningLounge';
import type { Metadata } from "next";

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
  openGraph: {
    title: "Sponge Global | Learning & Capability Partner",
    description: "Practical learning solutions for organizations across industries and countries.",
    url: "https://sponge-global.com",
    siteName: "Sponge Global",
    images: [
      {
        url: "/sponge-favicon.png", // Using favicon as placeholder if no OG image exists yet
        width: 1200,
        height: 630,
        alt: "Sponge Global Learning Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sponge Global | Learning & Capability Partner",
    description: "Building stronger leaders and teams for 200+ clients worldwide.",
    images: ["/sponge-favicon.png"],
  },
};

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
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
      </div>


    </main>
  );
}
