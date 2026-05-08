import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import WhyUs from '../components/WhyUs';
import BeforeAfter from '../components/BeforeAfter';
import Pricing from '../components/Pricing';
import PriceEstimator from '../components/PriceEstimator';
import Contact from '../components/Contact';
import Reviews from '../components/Reviews';
import Footer from '../components/Footer';
import AdvisorChat from '../components/AdvisorChat';

export default function Home() {
  return (
    <main className="font-inter bg-white text-ink-black">
      <Navbar />
      <Hero />
      <Services />
      <WhyUs />
      <BeforeAfter />
      <Pricing />
      <PriceEstimator />
      <Reviews />
      <Contact />
      <Footer />
      <AdvisorChat />
    </main>
  );
}