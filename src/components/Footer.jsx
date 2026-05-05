export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border px-6 md:px-16 py-12">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="font-inter font-black text-ink-black" style={{ fontSize: '1.4rem', letterSpacing: '-0.04em' }}>
            920 DETAILING
          </span>
          <p className="small-caps-label mt-1">Precision Surface Care</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-10 items-start md:items-center">
          {['services', 'process', 'contact'].map((s) => (
            <button
              key={s}
              onClick={() => document.getElementById(s)?.scrollIntoView({ behavior: 'smooth' })}
              className="small-caps-label text-ink-black hover:text-tech-grey transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        <p className="small-caps-label text-tech-grey" style={{ fontSize: '0.6rem' }}>
          © {year} 920 Detailing. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}