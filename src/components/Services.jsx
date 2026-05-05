import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const services = [
  {
    id: '01',
    name: 'Interior Detailing',
    tagline: 'Complete cabin restoration',
    description:
      'A true interior detail isn\'t just a vacuum and a wipe-down. We systematically disassemble, extract, and restore every surface inside your vehicle — treating leather, fabric, plastics, glass, and trim with chemistry-specific products. You\'re paying for hours of focused labor and professional-grade tools, not a 10-minute car wash add-on.',
    process: [
      { step: 'Deep Vacuum & Air Purge', detail: 'Compressed air extraction from every vent, seam, and crevice.' },
      { step: 'Fabric / Leather Extraction', detail: 'Hot-water extraction or pH-balanced leather cleaner, depending on material.' },
      { step: 'Surface Decontamination', detail: 'All hard surfaces wiped, scrubbed, and cleaned with appropriate solvents.' },
      { step: 'Glass Polish & Clarity', detail: 'Interior glass polished with a non-smearing glass cleaner for zero haze.' },
      { step: 'Conditioning & Protection', detail: 'Leather conditioned; plastics and vinyl protected against UV degradation.' },
      { step: 'Final Inspection', detail: 'White-glove check under LED lighting. Zero tolerance for missed spots.' },
    ],
    result: 'A cabin that smells, looks, and feels like new — chemically protected against future soiling.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&auto=format&fit=crop&q=80',
    imageAlt: 'Macro shot of clean leather interior stitching with pristine matte finish',
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
      'Ceramic coating is a liquid polymer that chemically bonds to your vehicle\'s paint, creating a permanent (or semi-permanent) hydrophobic layer of protection. Unlike wax or sealant, it does not wash off. It hardens on top of your paint to protect it from UV rays, chemical stains, light scratches, and environmental contaminants. The result is a surface that is dramatically easier to maintain and stays cleaner for longer. This is only applied after paint correction — applying coating over defects locks them in permanently.',
    process: [
      { step: 'Full Paint Correction First', detail: 'Coating amplifies what is underneath. Defects must be removed prior.' },
      { step: 'IPA Panel Wipe', detail: 'Every panel wiped with isopropyl alcohol to remove all oils and polish residue.' },
      { step: 'Coating Application', detail: 'Applied panel-by-panel using an applicator block and suede cloth in a cross-hatch pattern.' },
      { step: 'Flash Time Management', detail: 'Each panel allowed to flash before leveling to ensure even bonding across the surface.' },
      { step: 'Infrared Cure (Optional)', detail: 'IR lamps accelerate the curing process for stronger, faster bonding.' },
      { step: '24–48 Hour Cure Protocol', detail: 'Vehicle must remain dry and untouched during initial cure period.' },
    ],
    result: '2–5 year protection depending on product tier. Hydrophobic, UV resistant, and self-cleaning properties.',
    image: 'https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?w=900&auto=format&fit=crop&q=80',
    imageAlt: 'Water beading in perfect spheres on a ceramic-coated dark car surface',
    specs: [{ label: 'Curing Time', value: '24–48 HRS' }, { label: 'Protection', value: '2–5 YRS' }],
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
                <p className="font-mono text-ink-black font-medium" style={{ fontSize: '0.75rem', letterSpacing: '0.08em' }}>{s.value}</p>
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
                  <span className="font-mono text-tech-grey flex-shrink-0" style={{ fontSize: '0.65rem', marginTop: '2px' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="font-inter font-semibold text-ink-black" style={{ fontSize: '0.9rem' }}>{p.step}</p>
                    <p className="text-tech-grey mt-1" style={{ fontSize: '0.85rem', lineHeight: 1.55 }}>{p.detail}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 p-5 border border-ink-black">
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
      <div className="mb-16">
        <p className="small-caps-label mb-4">What We Do</p>
        <h2
          className="font-inter font-black text-ink-black"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', lineHeight: 0.9, letterSpacing: '-0.04em' }}
        >
          THE SERVICE<br />LEDGER.
        </h2>
        <p className="mt-6 text-tech-grey max-w-xl" style={{ fontSize: '1rem' }}>
          Every service explained in full — the process, the chemistry, and the outcome. You deserve to know what you're paying for.
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