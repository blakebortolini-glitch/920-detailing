import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #E8E8E8' : 'none',
      }}
    >
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        <Link to="/">
          <img
            src="https://media.base44.com/images/public/69fa3a1ac5d3dd52dfa6a6c6/2e6205b93_A9FC99FF-3B15-4B74-89A3-67498ADDFCF3.png"
            alt="920 Detailing logo"
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <Link to="/" className="small-caps-label text-ink-black hover:text-tech-grey transition-colors">
            home
          </Link>
          {['services', 'process', 'contact'].map((s) => (
            <button
              key={s}
              onClick={() => scrollTo(s)}
              className="small-caps-label text-ink-black hover:text-tech-grey transition-colors"
            >
              {s}
            </button>
          ))}
          <Link to="/booking" className="btn-primary" style={{ padding: '10px 28px', fontSize: '0.7rem', background: 'hsl(214, 89%, 52%)', borderColor: 'hsl(214, 89%, 52%)' }}>
            Book Now
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 text-ink-black"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{ minWidth: 48, minHeight: 48 }}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-border px-6 py-6 flex flex-col gap-6">
          <Link to="/" className="small-caps-label text-ink-black text-left" onClick={() => setMenuOpen(false)}>
            home
          </Link>
          {['services', 'process', 'contact'].map((s) => (
            <button
              key={s}
              onClick={() => scrollTo(s)}
              className="small-caps-label text-ink-black text-left"
            >
              {s}
            </button>
          ))}
          <Link to="/booking" className="btn-primary w-full justify-center" style={{ background: 'hsl(214, 89%, 52%)', borderColor: 'hsl(214, 89%, 52%)' }} onClick={() => setMenuOpen(false)}>
            Book Now
          </Link>
        </div>
      )}
    </nav>
  );
}