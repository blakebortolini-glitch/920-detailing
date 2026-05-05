import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import WhyUs from '../components/WhyUs';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main className="font-inter">
      <Navbar />
      <Hero />
      <div className="technical-rule" />
      <Services />
      <div className="technical-rule" />
      <WhyUs />
      <div className="technical-rule" />
      <Contact />
      <Footer />
    </main>
  );
}