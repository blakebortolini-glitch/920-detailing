import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const services = [
  {
    id: '01',
    name: 'Interior Detailing',
    tagline: 'Complete cabin restoration',
    description:
      'A true interior detail isn\'t just a vacuum and a wipe-down. We systematically disassemble, extract, and restore every surface inside your vehicle, treating leather, fabric, plastics, glass, and trim with chemistry-specific products. You\'re paying for hours of focused labor and professional-grade tools, not a 10-minute car wash add-on.',
    process: [
      { step: 'Deep Vacuum & Air Purge', detail: 'Compressed air extraction from every vent, seam, and crevice.' },
      { step: 'Fabric / Leather Extraction', detail: 'Hot-water extraction or pH-balanced leather cleaner, depending on material.' },
      { step: 'Surface Decontamination', detail: 'All hard surfaces wiped, scrubbed, and cleaned with appropriate solvents.' },
      { step: 'Glass Polish & Clarity', detail: 'Interior glass polished with a non-smearing glass cleaner for zero haze.' },
      { step: 'Conditioning & Protection', detail: 'Leather conditioned; plastics and vinyl protected against UV degradation.' },

    ],
    result: 'A cabin that smells, looks, and feels like new, chemically protected against future soiling.',
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=900&auto=format&fit=crop&q=80',
    imageAlt: 'Professional detailer vacuuming and cleaning car interior seats',
    specs: [{ label: 'Duration', value: '3–6 HRS' }, { label: 'Products', value: 'PH NEUTRAL' }],
  },
  {
    id: '02',
    name: 'Exterior Detailing & Paint Correction',
    tagline: 'Surface restoration at micron level',
    description:
      'Paint correction removes the swirl marks, wash marring, water spots, and oxidation that accumulate on every vehicle over time. These defects live inside your clear coat — the transparent layer above your actual paint. We use machine polishers with measured pad-and-compound combinations to cut, refine, and polish that clear coat back to a flawless, high-gloss finish. This process takes skill, time, and proper lighting. That\'s what you\'re investing in.',
    process: [
      { step: 'Foam Cannon Pre-Wash', detail: 'Thick snow foam dwell to soften and remove loose contamination.' },
      { step: 'Two-Bucket Hand Wash', detail: 'Grit-guard method to prevent cross-contamination during wash.' },
      { step: 'Iron & Tar Decontamination', detail: 'Chemical iron remover dissolves brake dust embedded in paint. Tar solvent removes adhesive residue.' },
      { step: 'Clay Bar Treatment', detail: 'Entire vehicle clayed to remove bonded surface contaminants not removed by washing.' },
      { step: 'Paint Depth Measurement', detail: 'Digital paint gauge confirms clear coat thickness before any machine work.' },
      { step: 'Stage 1 / Stage 2 Polish', detail: 'Single-stage (swirl removal) or two-stage (heavy cut + refine) depending on paint condition.' },
      { step: 'Panel Wipe & IPA Finish', detail: 'Isopropyl alcohol wipe removes all polish oils to reveal true corrected finish.' },
      { step: 'Final Light Inspection', detail: 'Multi-angle inspection under high-intensity LED lighting.' },
    ],
    result: 'Defect-free paint with a showroom-depth gloss. Typically 70–95% defect elimination depending on severity.',
    image: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=900&auto=format&fit=crop&q=80',
    imageAlt: 'Professional detailer using dual-action polisher on car paint with motion blur',
    specs: [{ label: 'Correction Level', value: '70–95%' }, { label: 'Paint Safe', value: 'GAUGE VERIFIED' }],
  },
  {
    id: '03',
    name: 'Ceramic Coating',
    tagline: 'Nanotechnology surface protection',
    description:
      'Ceramic coating is a liquid polymer that chemically bonds to your vehicle\'s paint, creating a permanent (or semi-permanent) hydrophobic layer of protection. Unlike wax or sealant, it does not wash off. It hardens on top of your paint to protect it from UV rays, chemical stains, light scratches, and environmental contaminants. We offer two tiers: a 3-year coating and a premium 8-year coating. Both are only applied after full paint correction — coating over defects locks them in permanently.\n\nCeramic Maintenance Detail ($150): Ceramic coating clients receive priority access to our maintenance detail service. This is a full interior + exterior detail using coating-safe, pH-neutral products, plus any add-ons you choose. Done periodically, it keeps your coating hydrophobic, glossy, and performing at its best for the full duration of its rated lifespan.',
    process: [
      { step: 'Full Paint Correction First', detail: 'Coating amplifies what is underneath. Defects must be removed prior.' },
      { step: 'IPA Panel Wipe', detail: 'Every panel wiped with isopropyl alcohol to remove all oils and polish residue.' },
      { step: 'Coating Application', detail: 'Applied panel-by-panel using an applicator block and suede cloth in a cross-hatch pattern.' },
      { step: 'Flash Time Management', detail: 'Each panel allowed to flash before leveling to ensure even bonding across the surface.' },

      { step: '24–48 Hour Cure Protocol', detail: 'Vehicle must remain dry and untouched during initial cure period.' },
      { step: 'Ongoing Maintenance Details', detail: 'Ceramic clients get full interior + exterior maintenance details for $150 (+ add-ons) using coating-safe products to preserve hydrophobic performance.' },
    ],
    result: '3-year or 8-year protection depending on tier. Hydrophobic, UV resistant, and self-cleaning. Maintained with periodic $150 detail visits.',
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=900&auto=format&fit=crop&q=80',
    imageAlt: 'Water beading in perfect spheres on a ceramic-coated dark car surface',
    specs: [{ label: 'Curing Time', value: '24–48 HRS' }, { label: 'Protection', value: '3 OR 8 YRS' }],
  },
];

function ServiceCard({ service, index }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="border-b border-border">
      {/* Header row */}
      <button
        className="w-full text-left py-8 md:py-10 flex items-start gap-6 md:gap-10 group focus:outline-none"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{ minHeight: 48 }}
      >
        <span className="service-number flex-shrink-0 w-16 md:w-28">{service.id}</span>
        <div className="flex-1 pt-1">
          <p className="small-caps-label mb-2">{service.tagline}</p>
          <h2 className="font-inter font-black text-ink-black" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.8rem)', lineHeight: 1, letterSpacing: '-0.03em' }}>
            {service.name}
          </h2>
          <div className="flex gap-6 mt-4">
            {service.specs.map((s) => (
              <div key={s.label}>
                <p className="small-caps-label">{s.label}</p>
                <p className="font-mono font-medium" style={{ fontSize: '0.75rem', letterSpacing: '0.08em', color: 'hsl(214, 89%, 52%)' }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
        <ChevronDown
          size={20}
          className="flex-shrink-0 mt-2 text-tech-grey transition-transform duration-300"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {/* Expanded content */}
      {open && (
        <div className="pb-12 grid md:grid-cols-2 gap-8 md:gap-16 px-0">
          {/* Left: description + process */}
          <div>
            <p className="text-ink-black mb-10 leading-relaxed" style={{ fontSize: '1rem', color: '#333' }}>
              {service.description}
            </p>

            <p className="small-caps-label mb-5">The Process</p>
            <ol className="space-y-0">
              {service.process.map((p, i) => (
                <li key={i} className="flex gap-4 py-4 border-t border-border">
                  <span className="font-mono flex-shrink-0" style={{ fontSize: '0.65rem', marginTop: '2px', color: 'hsl(214, 89%, 52%)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="font-inter font-semibold text-ink-black" style={{ fontSize: '0.9rem' }}>{p.step}</p>
                    <p className="text-tech-grey mt-1" style={{ fontSize: '0.85rem', lineHeight: 1.55 }}>{p.detail}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 p-5 border" style={{ borderColor: 'hsl(214, 89%, 52%)' }}>
              <p className="small-caps-label mb-2">The Result</p>
              <p className="text-ink-black font-medium" style={{ fontSize: '0.95rem' }}>{service.result}</p>
            </div>
          </div>

          {/* Right: image */}
          <div className="order-first md:order-last">
            <img
              src={service.image}
              alt={service.imageAlt}
              className="w-full h-64 md:h-full object-cover"
              style={{ maxHeight: 520 }}
            />
          </div>
        </div>
      )}
    </article>
  );
}

export default function Services() {
  return (
    <section id="services" className="px-6 md:px-16 max-w-screen-xl mx-auto py-24 md:py-36">
      {/* Pricing Table */}
      <div className="mb-16 border-t border-l border-border">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b border-r border-border" style={{ borderRight: 'none' }}>
          {[
            {
              num: '01',
              name: 'Interior Detail',
              price: '$165',
              duration: '3–6 hrs',
              highlights: ['Deep vacuum & air purge', 'Steam cleaning & sanitization', 'Fabric / leather extraction', 'Surface decontamination', 'Interior glass polish', 'UV conditioning & protection'],
            },
            {
              num: '02',
              name: 'Interior + Exterior Bundle',
              price: '$200',
              duration: '6–10 hrs',
              highlights: ['Full interior refresh', 'Steam cleaning & sanitization', 'Foam cannon pre-wash', 'Two-bucket hand wash', 'Iron & tar decontam.', 'Best value package'],
              featured: true,
            },
            {
              num: '03',
              name: 'Exterior & Paint Correction',
              price: '$300',
              duration: '1 day',
              highlights: ['Steam cleaning & sanitization', 'Clay bar treatment', 'Paint depth measurement', 'Stage 1 / Stage 2 polish', 'IPA panel wipe finish', '70–95% defect removal'],
            },
            {
              num: '04',
              name: 'Ceramic Coating',
              price: '$600',
              duration: '1–2 days',
              highlights: ['Full paint correction incl.', 'Basic interior detail incl.', 'Steam cleaning & sanitization', 'Panel-by-panel application', 'IR cure option', '24–48 hr cure protocol', '3–8 yr protection'],
            },
          ].map((pkg) => (
            <div
              key={pkg.num}
              className="border-b border-r border-border flex flex-col"
              style={{
                background: pkg.featured ? '#0A0A0A' : '#FFFFFF',
                ...(pkg.featured ? { outline: '2px solid hsl(214, 89%, 52%)', outlineOffset: '-2px', zIndex: 1, position: 'relative' } : {}),
              }}
            >
              <div className="p-6 md:p-8 flex-1">
                <div className="flex items-start justify-between mb-5">
                  <span className="font-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: '#767676' }}>{pkg.num}</span>
                  {pkg.featured && (
                    <span className="font-mono border border-white/20 px-2 py-0.5 text-white" style={{ fontSize: '0.5rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                      Best Value
                    </span>
                  )}
                </div>

                <p className="small-caps-label mb-2" style={{ color: pkg.featured ? '#767676' : undefined }}>{pkg.name}</p>

                <div className="mb-5">
                  <span
                    className="font-inter font-black"
                    style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1, letterSpacing: '-0.04em', color: pkg.featured ? '#FFFFFF' : '#0A0A0A' }}
                  >
                    {pkg.price}
                  </span>
                  <span className="font-mono ml-2" style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: 'hsl(214, 89%, 52%)' }}>STARTING AT</span>
                  <p className="font-mono mt-1" style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: pkg.featured ? '#555' : '#AAAAAA' }}>{pkg.duration}</p>
                </div>

                <div className="h-px mb-5" style={{ background: pkg.featured ? 'rgba(255,255,255,0.1)' : 'hsl(var(--border))' }} />

                <ul className="space-y-2">
                  {pkg.highlights.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-mono flex-shrink-0 mt-0.5" style={{ fontSize: '0.55rem', color: 'hsl(214, 89%, 52%)' }}>—</span>
                      <span style={{ fontSize: '0.82rem', lineHeight: 1.5, color: pkg.featured ? 'rgba(255,255,255,0.75)' : '#444' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <p className="font-mono text-tech-grey py-4 border-r border-border px-1" style={{ fontSize: '0.65rem', letterSpacing: '0.08em' }}>
          * Final price varies by vehicle size and condition. Scroll down for full pricing details.
        </p>
      </div>

      <div>
        {services.map((s, i) => (
          <ServiceCard key={s.id} service={s} index={i} />
        ))}
      </div>
    </section>
  );
}