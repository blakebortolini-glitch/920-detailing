import { useState, useRef, useCallback } from 'react';

const projects = [
  {
    id: '01',
    label: 'Paint Correction',
    vehicle: '2019 BMW 3 Series — Mineral White',
    before: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=900&auto=format&fit=crop&q=80',
    after: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&auto=format&fit=crop&q=80',
    beforeAlt: 'BMW 3 Series with heavy swirl marks and paint marring before correction',
    afterAlt: 'BMW 3 Series with mirror-gloss paint after professional correction',
    detail: 'Stage 2 Paint Correction — 85% defect elimination',
  },
  {
    id: '02',
    label: 'Interior Detail',
    vehicle: '2020 Ford F-150 — Crew Cab',
    before: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=900&auto=format&fit=crop&q=80',
    after: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&auto=format&fit=crop&q=80',
    beforeAlt: 'Dirty truck interior with debris and stained seats before detailing',
    afterAlt: 'Clean, restored truck interior with conditioned leather after detailing',
    detail: 'Full Interior — Extraction, leather treatment, glass polish',
  },
  {
    id: '03',
    label: 'Ceramic Coating',
    vehicle: '2022 Dodge Charger — Pitch Black',
    before: 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=900&auto=format&fit=crop&q=80',
    after: 'https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?w=900&auto=format&fit=crop&q=80',
    beforeAlt: 'Black Dodge Charger with dull oxidized paint before ceramic coating',
    afterAlt: 'Black Dodge Charger with deep gloss ceramic coating showing water beading',
    detail: '2-Year Ceramic Coating — Post correction application',
  },
];

function SliderCard({ project }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef(null);

  const updateSlider = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  const onMouseDown = (e) => { setDragging(true); updateSlider(e.clientX); };
  const onMouseMove = (e) => { if (dragging) updateSlider(e.clientX); };
  const onMouseUp = () => setDragging(false);

  const onTouchStart = (e) => { setDragging(true); updateSlider(e.touches[0].clientX); };
  const onTouchMove = (e) => { if (dragging) updateSlider(e.touches[0].clientX); };
  const onTouchEnd = () => setDragging(false);

  return (
    <div>
      {/* Slider container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden select-none cursor-col-resize"
        style={{ aspectRatio: '16/10' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        aria-label={`Before and after slider for ${project.vehicle}`}
      >
        {/* AFTER image (base) */}
        <img
          src={project.after}
          alt={project.afterAlt}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* BEFORE image (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={project.before}
            alt={project.beforeAlt}
            className="absolute inset-0 h-full object-cover"
            style={{ width: containerRef.current?.offsetWidth || '100%' }}
            draggable={false}
          />
        </div>

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 w-px bg-white z-10 pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        />

        {/* Handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center border border-border">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M5 4l-3 4 3 4M11 4l3 4-3 4" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute bottom-4 left-4 pointer-events-none">
          <span className="small-caps-label bg-black/70 text-white px-2 py-1" style={{ fontSize: '0.6rem' }}>Before</span>
        </div>
        <div className="absolute bottom-4 right-4 pointer-events-none">
          <span className="small-caps-label bg-black/70 text-white px-2 py-1" style={{ fontSize: '0.6rem' }}>After</span>
        </div>
      </div>

      {/* Card info */}
      <div className="pt-5 pb-8 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="small-caps-label mb-1">{project.label}</p>
            <p className="font-inter font-semibold text-ink-black" style={{ fontSize: '1rem', letterSpacing: '-0.01em' }}>
              {project.vehicle}
            </p>
          </div>
          <p className="font-mono text-tech-grey text-right flex-shrink-0" style={{ fontSize: '0.7rem', lineHeight: 1.5, maxWidth: 200 }}>
            {project.detail}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function BeforeAfter() {
  return (
    <section id="gallery" className="py-24 md:py-36 px-6 md:px-16 max-w-screen-xl mx-auto">
      <div className="mb-16">
        <p className="small-caps-label mb-4">The Work</p>
        <h2
          className="font-inter font-black text-ink-black"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', lineHeight: 0.9, letterSpacing: '-0.04em' }}
        >
          BEFORE &<br />AFTER.
        </h2>
        <p className="mt-6 text-tech-grey max-w-xl" style={{ fontSize: '1rem' }}>
          Drag the slider to see the transformation. Every result shown is real work from 920 Detailing — no filters, no staging.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        {projects.map((p) => (
          <div key={p.id} className={p.id === '01' ? 'md:col-span-2' : ''}>
            <div className="flex items-center gap-4 mb-5">
              <span className="font-mono text-tech-grey" style={{ fontSize: '0.65rem' }}>{p.id}</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <SliderCard project={p} />
          </div>
        ))}
      </div>
    </section>
  );
}