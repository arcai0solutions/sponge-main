import HeroScroll from '@/components/HeroScroll';
import About from '@/components/About';
import Services from '@/components/Services';
import ServicesList from '@/components/ServicesList';
import TalentArchitecture from '@/components/TalentArchitecture';
import WhyChooseUs from '@/components/WhyChooseUs';
import Preloader from '@/components/Preloader';

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <Preloader />
      <HeroScroll />
      <div className="relative z-20">
        <About />
        <Services />
        <ServicesList />
        <TalentArchitecture />
        <WhyChooseUs />
      </div>


    </main>
  );
}
