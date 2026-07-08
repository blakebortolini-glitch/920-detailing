import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const vehicleTypes = [
  { id: 'sedan', label: 'Sedan / Coupe', upcharge: 0, upchargeLabel: null, quoteOnly: false },
  { id: 'suv_small', label: 'Small SUV / Crossover', upcharge: 10, upchargeLabel: '+$10', quoteOnly: false },
  { id: 'suv_large', label: 'Large SUV / Truck', upcharge: 20, upchargeLabel: '+$20', quoteOnly: false },
  { id: 'van', label: 'Van / Minivan', upcharge: 35, upchargeLabel: '+$20–$50 depending on size', quoteOnly: false },
  { id: 'sports', label: 'Sports / Exotic', upcharge: 0, upchargeLabel: 'Quote varies', quoteOnly: true },
];

const services = [
  {
    id: 'interior',
    name: 'Interior Detailing',
    basePrice: 200,
    duration: '3–6 hrs',
    includes: ['Deep vacuum & air purge', 'Steam cleaning & sanitization', 'Fabric / leather extraction', 'Surface decontamination', 'Interior glass polish', 'UV conditioning'],
  },
  {
    id: 'full',
    name: 'Interior + Exterior Bundle',
    basePrice: 185,
    duration: '6–10 hrs',
    includes: ['Full interior refresh', 'Steam cleaning & sanitization', 'Foam cannon pre-wash', 'Two-bucket hand wash', 'Iron & tar decontam.', 'Best value package'],
    featured: true,
  },
  {
    id: 'exterior',
    name: 'Exterior & Paint Correction',
    basePrice: 300,
    duration: '1 day',
    includes: ['Steam cleaning & sanitization', 'Clay bar treatment', 'Paint depth measurement', 'Stage 1 / Stage 2 polish', 'IPA panel wipe finish', '70–95% defect removal'],
  },
  {
    id: 'ceramic',
    name: 'Ceramic Coating',
    basePrice: 600,
    duration: '1–2 days',
    includes: ['Full paint correction incl.', 'Basic interior detail incl.', 'Steam cleaning & sanitization', 'Panel-by-panel application', '24–48 hr cure protocol', '3–8 yr protection'],
  },
];

const addOns = [
  { id: 'pet_hair', name: 'Pet Hair Removal', priceLow: 25, priceHigh: 50, note: 'Depends on severity' },
  { id: 'stain', name: 'Stain Removal & Carpet Extraction', priceLow: 15, priceHigh: 50, note: 'Depends on stain severity' },
  { id: 'odor', name: 'Odor Elimination', priceLow: 25, priceHigh: 60, note: 'Depends on odor severity' },
];

export default function PriceEstimator() {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  const toggleAddOn = (id) =>
    setSelectedAddOns((prev) => prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]);

  const getEstimate = () => {
    if (!selectedVehicle || !selectedService) return null;
    const vehicle = vehicleTypes.find((v) => v.id === selectedVehicle);
    const service = services.find((s) => s.id === selectedService);
    if (!vehicle || !service) return null;
    if (vehicle.quoteOnly) return { quoteOnly: true, service, vehicle };

    const baseLow = service.basePrice + vehicle.upcharge;
    const baseHigh = Math.round(baseLow * 1.25 / 5) * 5;

    const activeAddOns = addOns.filter((a) => selectedAddOns.includes(a.id));
    const addOnLow = activeAddOns.reduce((sum, a) => sum + a.priceLow, 0);
    const addOnHigh = activeAddOns.reduce((sum, a) => sum + a.priceHigh, 0);

    return {
      low: baseLow + addOnLow,
      high: baseHigh + addOnHigh,
      baseLow,
      baseHigh,
      service,
      vehicle,
      activeAddOns,
      quoteOnly: false,
    };
  };

  const estimate = getEstimate();

  return (
    <section id="estimator" className="py-24 md:py-36 border-t border-border bg-secondary">
      <div className="px-6 md:px-16 max-w-screen-xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <p className="small-caps-label mb-4" style={{ color: 'hsl(214, 89%, 52%)' }}>Instant Quote</p>
          <h2
            className="font-inter font-black text-ink-black"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', lineHeight: 0.9, letterSpacing: '-0.04em' }}
          >
            PRICE<br />ESTIMATOR.
          </h2>
          <p className="mt-6 text-tech-grey max-w-xl" style={{ fontSize: '1rem' }}>
            Select your vehicle type, service, and any add-ons to get an instant estimate. Final pricing confirmed at booking.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">

          {/* Left — Selectors */}
          <div>
            {/* Vehicle Type */}
            <div className="mb-10">
              <p className="small-caps-label mb-5 pb-2 border-b border-border">Step 1 — Vehicle Type</p>
              <div className="space-y-2">
                {vehicleTypes.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVehicle(v.id)}
                    className="w-full text-left px-5 py-4 border transition-all"
                    style={{
                      borderColor: selectedVehicle === v.id ? '#0A0A0A' : 'hsl(var(--border))',
                      background: selectedVehicle === v.id ? '#0A0A0A' : '#FFFFFF',
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-inter font-semibold" style={{ fontSize: '0.9rem', color: selectedVehicle === v.id ? '#FFF' : '#0A0A0A' }}>
                        {v.label}
                      </span>
                      {v.upchargeLabel && (
                        <span className="font-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: selectedVehicle === v.id ? 'rgba(255,255,255,0.65)' : 'hsl(214, 89%, 52%)' }}>
                          {v.upchargeLabel}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Service */}
            <div className="mb-10">
              <p className="small-caps-label mb-5 pb-2 border-b border-border">Step 2 — Service Package</p>
              <div className="space-y-2">
                {services.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedService(s.id)}
                    className="w-full text-left px-5 py-4 border transition-all"
                    style={{
                      borderColor: selectedService === s.id ? 'hsl(214, 89%, 52%)' : 'hsl(var(--border))',
                      background: selectedService === s.id ? 'hsl(214, 89%, 52%)' : '#FFFFFF',
                      outline: s.featured && selectedService !== s.id ? '1px solid hsl(214, 89%, 52%)' : 'none',
                      outlineOffset: '-1px',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-inter font-semibold" style={{ fontSize: '0.9rem', color: selectedService === s.id ? '#FFF' : '#0A0A0A' }}>
                        {s.name}
                      </span>
                      <span className="font-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: selectedService === s.id ? 'rgba(255,255,255,0.7)' : 'hsl(214, 89%, 52%)' }}>
                        FROM ${s.basePrice}
                      </span>
                    </div>
                    {s.featured && selectedService !== s.id && (
                      <span className="font-mono" style={{ fontSize: '0.55rem', letterSpacing: '0.12em', color: 'hsl(214, 89%, 52%)' }}>BEST VALUE</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Add-Ons */}
            <div>
              <p className="small-caps-label mb-5 pb-2 border-b border-border">Step 3 — Customize Your Detail</p>
              <p className="text-tech-grey mb-4" style={{ fontSize: '0.82rem' }}>Optional add-ons. Can be added to any service.</p>
              <div className="space-y-2">
                {addOns.map((a) => {
                  const active = selectedAddOns.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => toggleAddOn(a.id)}
                      className="w-full text-left px-5 py-4 border transition-all flex items-center gap-4"
                      style={{
                        borderColor: active ? '#0A0A0A' : 'hsl(var(--border))',
                        background: active ? '#0A0A0A' : '#FFFFFF',
                      }}
                    >
                      <div
                        className="flex-shrink-0 w-5 h-5 border flex items-center justify-center transition-all"
                        style={{ borderColor: active ? '#FFF' : 'hsl(var(--border))', background: active ? 'hsl(214, 89%, 52%)' : 'transparent' }}
                      >
                        {active && <Check size={11} color="#FFF" strokeWidth={3} />}
                      </div>
                      <div className="flex-1">
                        <span className="font-inter font-semibold" style={{ fontSize: '0.88rem', color: active ? '#FFF' : '#0A0A0A' }}>
                          {a.name}
                        </span>
                        <span className="block font-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.08em', color: active ? 'rgba(255,255,255,0.5)' : '#AAAAAA', marginTop: 2 }}>
                          {a.note}
                        </span>
                      </div>
                      <span className="font-mono flex-shrink-0" style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: active ? 'rgba(255,255,255,0.7)' : 'hsl(214, 89%, 52%)' }}>
                        {a.priceLow === a.priceHigh ? `+$${a.priceLow}` : `+$${a.priceLow}–$${a.priceHigh}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right — Estimate Output */}
          <div className="sticky top-24">
            {!estimate ? (
              <div className="border border-dashed border-border p-10 text-center">
                <p className="small-caps-label text-tech-grey mb-3">Your Estimate</p>
                <p className="text-tech-grey" style={{ fontSize: '0.9rem' }}>
                  Select a vehicle type and service package to see your instant estimate.
                </p>
              </div>
            ) : estimate.quoteOnly ? (
              <div className="border border-ink-black p-8 md:p-10">
                <p className="small-caps-label text-tech-grey mb-6">Estimate for {estimate.vehicle.label}</p>
                <p className="small-caps-label mb-2">{estimate.service.name}</p>
                <p className="font-inter font-black text-ink-black mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1, letterSpacing: '-0.04em' }}>
                  Custom Quote
                </p>
                <p className="text-tech-grey mb-8" style={{ fontSize: '0.9rem', lineHeight: 1.65 }}>
                  Sports and exotic vehicles vary widely in panel complexity, paint type, and surface area. We provide a personalized quote after a quick consultation.
                </p>
                <Link to="/booking" className="btn-primary w-full justify-center" style={{ background: 'hsl(214, 89%, 52%)', borderColor: 'hsl(214, 89%, 52%)' }}>
                  Request a Quote <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="border border-ink-black p-8 md:p-10">
                <p className="small-caps-label text-tech-grey mb-6">Estimate for {estimate.vehicle.label}</p>

                {/* Price */}
                <div className="mb-6">
                  <p className="small-caps-label mb-1">{estimate.service.name}</p>
                  <div className="flex items-end gap-3 mt-3">
                    <span className="font-inter font-black text-ink-black" style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', lineHeight: 1, letterSpacing: '-0.05em' }}>
                      ${estimate.low}
                    </span>
                    <span className="font-inter font-black text-tech-grey mb-1" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', letterSpacing: '-0.03em' }}>
                      – ${estimate.high}
                    </span>
                  </div>
                  <p className="font-mono mt-2" style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: 'hsl(214, 89%, 52%)' }}>
                    EST. DURATION: {estimate.service.duration}
                  </p>
                </div>

                <div className="h-px bg-border mb-6" />

                {/* Price Breakdown */}
                <p className="small-caps-label mb-3">Price Breakdown</p>
                <div className="space-y-2 mb-2">
                  <div className="flex justify-between">
                    <span style={{ fontSize: '0.85rem', color: '#444' }}>{estimate.service.name}</span>
                    <span className="font-mono" style={{ fontSize: '0.75rem', color: '#444' }}>${estimate.baseLow}–${estimate.baseHigh}</span>
                  </div>
                  {estimate.vehicle.upcharge > 0 && (
                    <div className="flex justify-between">
                      <span style={{ fontSize: '0.85rem', color: '#444' }}>{estimate.vehicle.label} upcharge</span>
                      <span className="font-mono" style={{ fontSize: '0.75rem', color: '#444' }}>+${estimate.vehicle.upcharge}</span>
                    </div>
                  )}
                  {estimate.activeAddOns.map((a) => (
                    <div key={a.id} className="flex justify-between">
                      <span style={{ fontSize: '0.85rem', color: '#444' }}>{a.name}</span>
                      <span className="font-mono" style={{ fontSize: '0.75rem', color: 'hsl(214, 89%, 52%)' }}>
                        {a.priceLow === a.priceHigh ? `+$${a.priceLow}` : `+$${a.priceLow}–$${a.priceHigh}`}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between py-3 border-t border-border mb-6">
                  <span className="font-inter font-bold text-ink-black" style={{ fontSize: '0.9rem' }}>Total Estimate</span>
                  <span className="font-inter font-black text-ink-black" style={{ fontSize: '0.9rem' }}>${estimate.low}–${estimate.high}</span>
                </div>

                {/* What's Included */}
                <p className="small-caps-label mb-3">What's Included</p>
                <ul className="space-y-2 mb-6">
                  {estimate.service.includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-mono flex-shrink-0" style={{ fontSize: '0.55rem', marginTop: 3, color: 'hsl(214, 89%, 52%)' }}>—</span>
                      <span style={{ fontSize: '0.85rem', color: '#444' }}>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="p-4 border-l-2 mb-8" style={{ borderColor: 'hsl(214, 89%, 52%)', background: '#F8F8F8' }}>
                  <p className="font-mono text-tech-grey" style={{ fontSize: '0.65rem', letterSpacing: '0.06em', lineHeight: 1.6 }}>
                    Final price confirmed after vehicle inspection. Heavily neglected interiors or severe paint defects may affect final cost.
                  </p>
                </div>

                <Link to="/booking" className="btn-primary w-full justify-center" style={{ background: 'hsl(214, 89%, 52%)', borderColor: 'hsl(214, 89%, 52%)' }}>
                  Book This Service <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}