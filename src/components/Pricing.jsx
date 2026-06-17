import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const tiers = [
  {
    id: '01',
    name: 'Interior Detail',
    tagline: 'Complete cabin restoration',
    startingAt: 150,
    duration: '3–5 HRS',
    includes: [
      'Deep vacuum & air purge',
      'Carpet & seat refresh/cleaning',
      'Surface decontamination',
      'Interior glass polish',
      'Conditioning & UV protection',
      'LED final inspection',
    ],
    note: 'Pricing varies by vehicle size and condition.',
  },
  {
    id: '02',
    name: 'Interior + Exterior Bundle',
    tagline: 'Most popular, best value',
    startingAt: 185,
    duration: '6–10 HRS',
    featured: true,
    includes: [
      'Full interior refresh & clean',
      'Carpet & seat cleaning',
      'Foam cannon pre-wash',
      'Two-bucket hand wash',
      'Iron & tar decontamination',
    ],
    note: 'Best value for a complete inside-and-out transformation.',
  },
  {
    id: '03',
    name: 'Exterior & Paint Correction',
    tagline: 'Surface restoration at micron level',
    startingAt: 300,
    duration: '5–8 HRS',
    includes: [
      'Foam cannon pre-wash',
      'Two-bucket hand wash',
      'Iron & tar decontamination',
      'Clay bar treatment',
      'Paint gauge measurement',
      'Stage 1 / Stage 2 polish',
    ],
    note: 'Final price based on paint condition severity.',
  },
  {
    id: '04',
    name: 'Ceramic Coating',
    tagline: 'Nanotechnology surface protection',
    startingAt: 600,
    duration: '1–2 DAYS',
    includes: [
      'Full paint correction included',
      'IPA panel wipe prep',
      'Coating application',
      'Flash time management',
      'IR cure (optional)',
      '24–48 hr cure protocol',
    ],
    note: 'Applied only after paint correction. 2–5 yr protection.',
  },
];

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-24 md:py-36 border-t border-border">
      <div className="px-6 md:px-16 max-w-screen-xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <p className="small-caps-label mb-4" style={{ color: 'hsl(214, 89%, 52%)' }}>Investment</p>
          <h2
            className="font-inter font-black text-ink-black"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', lineHeight: 0.9, letterSpacing: '-0.04em' }}
          >
            STARTING<br />PRICES.
          </h2>
          <p className="mt-6 text-tech-grey max-w-xl" style={{ fontSize: '1rem' }}>
            Every vehicle is different. These are starting points — final quotes are based on size, condition, and scope of work.
          </p>
        </div>

        {/* Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-border">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className="border-b border-r border-border flex flex-col"
              style={{ background: tier.featured ? '#0A0A0A' : '#FFFFFF', ...(tier.featured ? { outline: '2px solid hsl(214, 89%, 52%)', outlineOffset: '-2px' } : {}) }}
            >
              {/* Top */}
              <div className="p-8 md:p-10 flex-1">
                {/* ID + label */}
                <div className="flex items-start justify-between mb-8">
                  <span
                    className="font-mono"
                    style={{ fontSize: '0.65rem', letterSpacing: '0.12em', color: tier.featured ? '#767676' : '#767676' }}
                  >
                    {tier.id}
                  </span>
                  {tier.featured && (
                    <span
                      className="font-mono border border-white/20 px-2 py-1 text-white"
                      style={{ fontSize: '0.55rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}
                    >
                      Most Popular
                    </span>
                  )}
                </div>

                {/* Service name */}
                <p className="small-caps-label mb-2" style={{ color: tier.featured ? '#767676' : undefined }}>
                  {tier.tagline}
                </p>
                <h3
                  className="font-inter font-black mb-8"
                  style={{
                    fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.05,
                    color: tier.featured ? '#FFFFFF' : '#0A0A0A',
                  }}
                >
                  {tier.name}
                </h3>

                {/* Price */}
                <div className="mb-8">
                  <p
                    className="small-caps-label mb-1"
                    style={{ color: tier.featured ? '#767676' : undefined }}
                  >
                    Starting At
                  </p>
                  <div className="flex items-end gap-1">
                    <span
                      className="font-inter font-black"
                      style={{
                        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                        lineHeight: 1,
                        letterSpacing: '-0.04em',
                        color: tier.featured ? '#FFFFFF' : '#0A0A0A',
                      }}
                    >
                      ${tier.startingAt}
                    </span>
                  </div>
                  <p
                    className="font-mono mt-2"
                    style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: 'hsl(214, 89%, 52%)' }}
                  >
                    {tier.duration}
                  </p>
                </div>

                {/* Divider */}
                <div
                  className="mb-6 h-px"
                  style={{ background: tier.featured ? 'rgba(255,255,255,0.12)' : 'hsl(var(--border))' }}
                />

                {/* Includes */}
                <ul className="space-y-3">
                  {tier.includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="font-mono flex-shrink-0 mt-0.5"
                        style={{ fontSize: '0.6rem', color: tier.featured ? '#555' : '#BDBDBD' }}
                      >
                        /{String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        style={{
                          fontSize: '0.85rem',
                          lineHeight: 1.5,
                          color: tier.featured ? 'rgba(255,255,255,0.75)' : '#444',
                        }}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom */}
              <div className="px-8 md:px-10 pb-8 md:pb-10">
                <p
                  className="font-mono mb-6"
                  style={{
                    fontSize: '0.7rem',
                    lineHeight: 1.55,
                    color: tier.featured ? 'rgba(255,255,255,0.35)' : '#AAAAAA',
                  }}
                >
                  * {tier.note}
                </p>
                <button
                  onClick={() => navigate('/booking')}
                  className={tier.featured ? 'btn-outline w-full justify-center' : 'btn-primary w-full justify-center'}
                  style={
                    tier.featured
                      ? { borderColor: 'rgba(255,255,255,0.3)', color: '#FFFFFF' }
                      : undefined
                  }
                  onMouseEnter={(e) => {
                    if (tier.featured) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (tier.featured) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  Book Now
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add-Ons */}
        <div className="mt-0 border-t border-l border-border">
          <div className="border-b border-r border-border p-8 md:p-10">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="small-caps-label mb-2">Interior Add-Ons</p>
                <h3
                  className="font-inter font-black text-ink-black"
                  style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', letterSpacing: '-0.03em', lineHeight: 1.05 }}
                >
                  Customize Your Detail
                </h3>
              </div>
              <span className="font-mono text-tech-grey" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>ADD TO ANY SERVICE</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-0 border-t border-l border-border">
              {[
                { name: 'Two-Step Paint Correction', price: '+$150', note: 'Add-on for Exterior & Paint Correction. Deeper polishing stage for heavily swirled or oxidized paint.' },
                { name: 'Pet Hair Removal', price: '$25–$50', note: 'Price depends on severity and coverage area.' },
                { name: 'Steam Cleaning', price: '$15', note: 'Full interior steam sanitization.' },
                { name: 'Stain Removal & Carpet Extraction', price: '$15–$50', note: 'Price depends on stain severity and area.' },
                { name: 'Odor Elimination', price: '$10–$40', note: 'Price depends on severity of odor.' },
              ].map((addon, i) => (
                <div key={i} className="border-b border-r border-border p-6">
                  <p className="font-mono text-tech-grey mb-3" style={{ fontSize: '0.6rem', letterSpacing: '0.12em' }}>
                    /{String(i + 1).padStart(2, '0')}
                  </p>

                  <p className="font-inter font-bold text-ink-black mb-2" style={{ fontSize: '0.95rem', letterSpacing: '-0.01em' }}>
                    {addon.name}
                  </p>
                  <p className="font-inter font-black text-ink-black mb-3" style={{ fontSize: '1.5rem', letterSpacing: '-0.03em', lineHeight: 1 }}>
                    {addon.price}
                  </p>
                  <p className="text-tech-grey" style={{ fontSize: '0.78rem', lineHeight: 1.5 }}>
                    {addon.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-8 border-t border-border">
          <p className="text-tech-grey" style={{ fontSize: '0.85rem' }}>
            Not sure what you need?{' '}
            <button
              onClick={() => navigate('/booking')}
              className="text-ink-black font-semibold underline underline-offset-2 hover:no-underline"
            >
              Book now
            </button>{' '}
            and we'll put together the right package for your vehicle.
          </p>
          <p className="font-mono text-tech-grey flex-shrink-0" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>
            FREE QUOTES — NO OBLIGATION
          </p>
        </div>

      </div>
    </section>
  );
}