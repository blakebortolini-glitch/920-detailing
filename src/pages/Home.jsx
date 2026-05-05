import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import WhyUs from '../components/WhyUs';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main className="font-inter bg-white text-ink-black">
      <Navbar />
      <Hero />
      <Services />
      <WhyUs />
      <Contact />
      <Footer />
    </main>
  );
}