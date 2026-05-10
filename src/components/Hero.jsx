import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDownRight } from 'lucide-react';

export default function Hero() {
  const heroRef = useRef(null);
  const navigate = useNavigate();

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden bg-ink-black"
      style={{ height: '100svh', minHeight: 600 }}
      aria-label="920 Detailing hero section"
    >
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1600705722738-cc8f1e56855a?w=1800&auto=format&fit=crop&q=80"
        alt="Macro photograph of water beads on a high-gloss ceramic-coated surface"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.45 }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.6) 100%)' }} />

      {/* Top-left brand mark */}
      <div className="absolute top-16 left-6 md:left-12">
        <p className="small-caps-label text-white/50">Est. 2024</p>
      </div>

      {/* Right vertical label */}
      <div
        className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-3"
        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
      >
        <span className="small-caps-label text-white/40 tracking-widest" style={{ fontSize: '0.6rem' }}>
          PREMIUM AUTO DETAILING
        </span>
      </div>

      {/* Center hero text */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 max-w-screen-xl mx-auto" style={{ left: 0, right: 0 }}>
        <div>
          <p className="small-caps-label mb-6" style={{ color: 'hsl(214, 89%, 65%)' }}>920 Detailing — Precision Surface Care</p>
          <h1
            className="hero-heading font-inter font-black text-white"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}
          >
            THE ART<br />OF THE<br />SURFACE.
          </h1>
          <p className="mt-8 text-white/60 font-inter font-light max-w-md" style={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
            Interior restoration. Exterior correction. Ceramic protection. Every vehicle treated with clinical precision.
          </p>
        </div>
      </div>

      {/* Bottom-left CTA */}
      <div className="absolute bottom-10 left-6 md:left-16 flex items-end gap-8">
        <button onClick={() => navigate('/booking')} className="btn-primary" style={{ background: 'hsl(214, 89%, 52%)', borderColor: 'hsl(214, 89%, 52%)' }}>
          Book Your Detail
          <ArrowDownRight size={16} />
        </button>
        <div className="hidden md:block">
          <p className="small-caps-label text-white/30">Scroll to explore</p>
        </div>
      </div>

      {/* Bottom technical rule */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
    </section>
  );
}