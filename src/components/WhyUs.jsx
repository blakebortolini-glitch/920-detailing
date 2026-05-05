const pillars = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#0A0A0A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="16" r="13" />
        <path d="M16 8v8l5 3" />
        <circle cx="16" cy="16" r="2" fill="#0A0A0A" />
      </svg>
    ),
    label: 'TIME INVESTMENT',
    title: 'Hours, Not Minutes',
    body: 'A proper detail takes 4–12 hours. We never cut corners to fit more appointments.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#0A0A0A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 26l8-20 8 20" />
        <path d="M9.5 18h9" />
      </svg>
    ),
    label: 'CHEMICAL PRECISION',
    title: 'Right Product. Right Surface.',
    body: 'We match every chemical to the exact material — no guessing, no damage risk.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#0A0A0A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4l3 8h9l-7 5 3 8-8-5-8 5 3-8-7-5h9z" />
      </svg>
    ),
    label: 'SURFACE LONGEVITY',
    title: 'Protection That Lasts',
    body: 'Our coatings and treatments are applied to last years, not weeks.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#0A0A0A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="5" width="22" height="22" rx="1" />
        <path d="M5 14h22" />
        <path d="M14 5v22" />
      </svg>
    ),
    label: 'PAINT GAUGE VERIFIED',
    title: 'Measured, Not Guessed',
    body: 'Paint depth is measured before any machine work to protect your clear coat.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#0A0A0A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 3C9 3 4 8.5 4 16c0 7 4.5 12 12 13 7.5-1 12-6 12-13 0-7.5-5-13-12-13z" />
        <path d="M11 16l3 3 7-7" />
      </svg>
    ),
    label: 'INSPECTION STANDARD',
    title: 'LED Light Check',
    body: 'Every vehicle inspected under high-intensity LED before handoff. No defect goes unseen.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#0A0A0A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 28l6-6" />
        <path d="M10 4l18 18-4 4L6 8z" />
        <path d="M22 4l2 2" />
        <path d="M17 9l2 2" />
      </svg>
    ),
    label: 'SINGLE OPERATOR',
    title: 'One Person. Full Accountability.',
    body: 'Your car is handled by one detailer start to finish — not a rotating crew.',
  },
];

export default function WhyUs() {
  return (
    <section id="process" className="bg-[#F5F5F5] py-24 md:py-36">
      <div className="px-6 md:px-16 max-w-screen-xl mx-auto">
        <div className="mb-16">
          <p className="small-caps-label mb-4">Why 920</p>
          <h2
            className="font-inter font-black text-ink-black"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', lineHeight: 0.9, letterSpacing: '-0.04em' }}
          >
            THE STANDARD<br />WE SET.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-border">
          {pillars.map((p) => (
            <div key={p.label} className="border-b border-r border-border p-8 md:p-10 bg-white hover:bg-[#FAFAFA] transition-colors">
              <div className="mb-6">{p.icon}</div>
              <p className="small-caps-label mb-3">{p.label}</p>
              <h3 className="font-inter font-bold text-ink-black mb-3" style={{ fontSize: '1.15rem', letterSpacing: '-0.02em' }}>
                {p.title}
              </h3>
              <p className="text-tech-grey" style={{ fontSize: '0.9rem', lineHeight: 1.65 }}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}