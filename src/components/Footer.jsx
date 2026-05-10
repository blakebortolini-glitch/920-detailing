export default function Footer() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer className="border-t border-border bg-ink-black text-white">
      <div className="px-6 md:px-16 max-w-screen-xl mx-auto py-16 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Brand */}
        <div>
          <p className="font-inter font-black text-white text-2xl mb-3" style={{ letterSpacing: '-0.04em' }}>920</p>
          <p className="small-caps-label text-white/40 mb-4">Precision Surface Care</p>
          <p className="text-white/50" style={{ fontSize: '0.85rem', lineHeight: 1.7 }}>
            Professional auto detailing. Interior, exterior, and ceramic protection done right the first time.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <p className="small-caps-label text-white/40 mb-6">Navigate</p>
          <ul className="space-y-3">
            {[['services', 'Services'], ['process', 'Why 920']].map(([id, label]) => (
              <li key={id}>
                <button
                  onClick={() => scrollTo(id)}
                  className="text-white/60 hover:text-white transition-colors"
                  style={{ fontSize: '0.9rem' }}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="small-caps-label text-white/40 mb-6">Contact</p>
          <a href="tel:+19202553123" className="font-inter font-bold transition-colors block mb-2" style={{ fontSize: '1.1rem', color: 'hsl(214, 89%, 65%)' }}>
            (920) 255-3123
          </a>
          <p className="text-white/50" style={{ fontSize: '0.85rem' }}>Kewaunee, Wisconsin</p>
          <p className="text-white/40 mt-1" style={{ fontSize: '0.8rem' }}>By Appointment Only</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-6 md:px-16 py-5 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="small-caps-label text-white/30" style={{ fontSize: '0.6rem' }}>
          © {new Date().getFullYear()} 920 Detailing. All rights reserved.
        </p>
        <p className="small-caps-label text-white/20" style={{ fontSize: '0.6rem' }}>
          Kewaunee, Wisconsin
        </p>
      </div>
    </footer>
  );
}