import { useState, useRef, useCallback } from 'react';

const projects = [
  {
    id: '01',
    label: 'Interior Detail',
    vehicle: 'GMC Sierra, Full Interior Restoration',
    before: 'https://media.base44.com/images/public/69fa3a1ac5d3dd52dfa6a6c6/e87403e81_IMG_5967.jpg',
    after: 'https://media.base44.com/images/public/69fa3a1ac5d3dd52dfa6a6c6/c5351c056_IMG_5978.jpg',
    beforeAlt: 'GMC Sierra dirty interior with mud and debris before detailing',
    afterAlt: 'GMC Sierra clean interior after professional detailing',
    detail: 'Full Interior, Deep clean, floor extraction, leather treatment',
  },
  {
    id: '02',
    label: 'Paint & Mirror Detail',
    vehicle: 'SUV, Exterior Paint Correction',
    before: 'https://media.base44.com/images/public/69fa3a1ac5d3dd52dfa6a6c6/e90fd2b7c_IMG_5467.jpg',
    after: 'https://media.base44.com/images/public/69fa3a1ac5d3dd52dfa6a6c6/94b146dfe_IMG_5487.jpg',
    beforeAlt: 'SUV mirror with water spots and contamination before detailing',
    afterAlt: 'SUV mirror with deep gloss finish after paint correction',
    detail: 'Exterior Detail, Decontamination, paint correction, gloss finish',
  },
  {
    id: '03',
    label: 'Cargo Interior',
    vehicle: 'Chevy Traverse, Full Interior Detail',
    before: 'https://media.base44.com/images/public/69fa3a1ac5d3dd52dfa6a6c6/b5de90ab0_IMG_4610.jpg',
    after: 'https://media.base44.com/images/public/69fa3a1ac5d3dd52dfa6a6c6/053dbe343_IMG_4630.jpg',
    beforeAlt: 'Dirty SUV cargo area with debris and grime before detailing',
    afterAlt: 'Clean SUV cargo area after professional interior detailing',
    detail: 'Full Interior, Carpet extraction, cargo restoration',
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
        style={{ aspectRatio: '4/3' }}
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
            style={{ width: '100%' }}
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
          <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center" style={{ border: '2px solid hsl(214, 89%, 52%)' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M5 4l-3 4 3 4M11 4l3 4-3 4" stroke="hsl(214, 89%, 52%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute bottom-4 left-4 pointer-events-none">
          <span className="small-caps-label px-2 py-1" style={{ fontSize: '0.6rem', background: 'hsl(214, 89%, 52%)', color: '#fff' }}>Before</span>
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
        <p className="small-caps-label mb-4" style={{ color: 'hsl(214, 89%, 52%)' }}>The Work</p>
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

      {/* After-only showcase */}
      <div className="mt-24">
        <div className="flex items-center gap-4 mb-10">
          <p className="small-caps-label" style={{ color: 'hsl(214, 89%, 52%)' }}>More Work</p>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              src: 'https://media.base44.com/images/public/69fa3a1ac5d3dd52dfa6a6c6/de8135675_07993D36-8599-46B5-8D43-5CC28B09D325.jpg',
              alt: 'GMC Denali HD exterior after full detail',
              label: 'GMC Denali HD, Full Exterior',
            },
            {
              src: 'https://media.base44.com/images/public/69fa3a1ac5d3dd52dfa6a6c6/7d212c82c_IMG_4453.jpg',
              alt: 'Chevy Suburban clean interior after detail',
              label: 'Chevy Suburban, Interior Detail',
            },
            {
              src: 'https://media.base44.com/images/public/69fa3a1ac5d3dd52dfa6a6c6/f3eb8b12f_IMG_4626.jpg',
              alt: 'Clean rear interior seats after professional detailing',
              label: 'SUV, Rear Interior Detail',
            },
          ].map((img, i) => (
            <div key={i} className="md:col-span-1">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full object-cover"
                style={{ aspectRatio: '4/3' }}
              />
              <div className="pt-4 pb-6 border-b border-border">
                <p className="small-caps-label mb-1">After</p>
                <p className="font-inter font-semibold text-ink-black" style={{ fontSize: '1rem', letterSpacing: '-0.01em' }}>
                  {img.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}