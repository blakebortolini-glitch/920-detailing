import { useState } from 'react';
import { base44 } from '@/api/base44Client';

const SERVICES = [
  { value: 'interior', label: 'Interior Detailing', description: 'Deep clean of all interior surfaces, carpets, seats, and panels.' },
  { value: 'exterior', label: 'Exterior Detailing & Paint Correction', description: 'Full exterior wash, decontamination, and paint correction.' },
  { value: 'full', label: 'Interior + Exterior Bundle', description: 'Complete inside and out — our most comprehensive detail.' },
  { value: 'ceramic', label: 'Ceramic Coating', description: 'Long-lasting ceramic protection applied over a fully prepared surface.' },
  { value: 'unsure', label: 'Not Sure — Need a Quote', description: "Not sure what you need? We'll assess and recommend the best option." },
];

export default function ChangeServiceModal({ booking, onClose, onSuccess }) {
  const [selected, setSelected] = useState(booking.service);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (selected === booking.service) { onClose(); return; }
    setSaving(true);
    const updated = await base44.entities.Booking.update(booking.id, { service: selected });
    onSuccess({ ...booking, service: selected });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white w-full max-w-lg p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-tech-grey hover:text-ink-black text-2xl leading-none"
          aria-label="Close"
        >
          ×
        </button>

        <p className="small-caps-label mb-2">Modify Appointment</p>
        <h2
          className="font-black text-ink-black mb-6"
          style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', letterSpacing: '-0.03em', lineHeight: 1 }}
        >
          CHANGE SERVICE
        </h2>

        <div className="space-y-2 mb-8">
          {SERVICES.map((svc) => {
            const isActive = selected === svc.value;
            return (
              <button
                key={svc.value}
                onClick={() => setSelected(svc.value)}
                className={`w-full text-left border p-4 transition-all duration-150 ${
                  isActive
                    ? 'border-ink-black bg-ink-black text-white'
                    : 'border-gray-200 hover:border-ink-black'
                }`}
              >
                <p className={`font-semibold text-sm tracking-tight ${isActive ? 'text-white' : 'text-ink-black'}`}>
                  {svc.label}
                </p>
                <p className={`text-xs mt-0.5 ${isActive ? 'text-gray-300' : 'text-tech-grey'}`}>
                  {svc.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-outline flex-1 justify-center text-xs py-3">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex-1 justify-center text-xs py-3"
          >
            {saving ? 'Saving…' : 'Confirm Change'}
          </button>
        </div>
      </div>
    </div>
  );
}