import { useState } from 'react';
import { ArrowRight, CalendarDays, Car, User, CheckCircle, Check, Sparkles, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import CalendarPicker from './CalendarPicker';
import { useRecaptcha } from '@/hooks/useRecaptcha';

const TIME_SLOTS = [
  '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
];

const services = [
  { value: 'interior', label: 'Interior Detailing', price: 'From $150' },
  { value: 'full', label: 'Interior + Exterior Bundle', price: 'From $185' },
  { value: 'exterior', label: 'Exterior & Paint Correction', price: 'From $200' },
  { value: 'ceramic', label: 'Ceramic Coating', price: 'From $600' },
  { value: 'maintenance', label: 'Maintenance Detail', price: 'Member Discount', badge: 'Members Only', note: 'Interior + exterior upkeep at a discounted rate for returning customers.' },
  { value: 'unsure', label: 'Not Sure — Need a Quote', price: '' },
];

const vehicleTypes = [
  { value: 'sedan', label: 'Sedan / Coupe', note: 'Standard upcharge' },
  { value: 'suv_small', label: 'Small SUV / Crossover', note: '+$10' },
  { value: 'suv_large', label: 'Large SUV / Truck', note: '+$20' },
  { value: 'van', label: 'Van / Minivan', note: '+$20–$50' },
  { value: 'sports', label: 'Sports / Exotic', note: 'Custom quote' },
];

const addOns = [
  { id: 'pet_hair', name: 'Pet Hair Removal', price: '$25–$50', note: 'Depends on severity' },
  { id: 'steam', name: 'Steam Cleaning', price: '$15', note: 'Full interior sanitization' },
  { id: 'stain', name: 'Stain Removal & Carpet Extraction', price: '$15–$50', note: 'Depends on stain severity' },
  { id: 'odor', name: 'Odor Elimination', price: '$10–$40', note: 'Depends on odor severity' },
];


export default function BookingForm() {
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    vehicle: '', year: '', vehicleType: '',
    service: '', date: '', time: '',
    notes: '',
  });
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const RECAPTCHA_CONTAINER_ID = 'recaptcha-booking';
  const { ready, getToken, reset } = useRecaptcha(RECAPTCHA_CONTAINER_ID);

  const toggleAddOn = (id) =>
    setSelectedAddOns((prev) => prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const setDirect = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.phone || !form.vehicle || !form.service || !form.date) {
      setError('Please fill in all required fields.');
      return;
    }
    let recaptchaToken = null;
    try {
      recaptchaToken = getToken();
    } catch (err) {
      // reCAPTCHA not ready (e.g. domain restriction in preview) — proceed without token
      recaptchaToken = null;
    }
    setLoading(true);
    const addOnNames = addOns.filter((a) => selectedAddOns.includes(a.id)).map((a) => a.name);
    const res = await base44.functions.invoke('sendBooking', { ...form, addOns: addOnNames.join(', ') || '', add_ons: addOnNames, vehicleType: form.vehicleType, recaptchaToken });
    setLoading(false);
    if (res.data?.success) {
      setSubmitted(true);
    } else {
      reset();
      setError('Something went wrong. Please call us directly at (920) 255-3123.');
    }
  };

  if (submitted) {
    return (
      <div className="border border-ink-black p-10 text-center max-w-lg mx-auto">
        <CheckCircle className="mx-auto mb-4 text-ink-black" size={40} strokeWidth={1.5} />
        <p className="small-caps-label mb-3 text-tech-grey">Booking Request Sent</p>
        <h3 className="font-inter font-black text-ink-black mb-3" style={{ fontSize: '2rem', letterSpacing: '-0.03em' }}>
          We'll confirm shortly.
        </h3>
        <p className="text-tech-grey" style={{ fontSize: '0.95rem' }}>
          You'll hear from us within a few hours. For urgent requests, call or text{' '}
          <a href="tel:+19202553123" className="text-ink-black font-semibold">(920) 255-3123</a>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl mx-auto">

      {/* Vehicle Type */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-border">
          <Car size={14} className="text-tech-grey" />
          <p className="small-caps-label">Vehicle Type</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {vehicleTypes.map((v) => (
            <button
              key={v.value}
              type="button"
              onClick={() => setDirect('vehicleType', v.value)}
              className="text-left p-4 border transition-colors"
              style={{
                borderColor: form.vehicleType === v.value ? '#0A0A0A' : 'hsl(var(--border))',
                background: form.vehicleType === v.value ? '#0A0A0A' : '#FFFFFF',
              }}
            >
              <p className="font-inter font-semibold" style={{ fontSize: '0.88rem', color: form.vehicleType === v.value ? '#FFF' : '#0A0A0A' }}>
                {v.label}
              </p>
              <p className="font-mono mt-1" style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: form.vehicleType === v.value ? 'rgba(255,255,255,0.5)' : 'hsl(214, 89%, 52%)' }}>
                {v.note}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Service Selection */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-border">
          <Car size={14} className="text-tech-grey" />
          <p className="small-caps-label">Service</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {services.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setDirect('service', s.value)}
              className="text-left p-4 border transition-colors"
              style={{
                borderColor: form.service === s.value ? '#0A0A0A' : 'hsl(var(--border))',
                background: form.service === s.value ? '#0A0A0A' : '#FFFFFF',
              }}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <p
                  className="font-inter font-semibold"
                  style={{ fontSize: '0.88rem', color: form.service === s.value ? '#FFF' : '#0A0A0A' }}
                >
                  {s.label}
                </p>
                {s.badge && (
                  <span
                    className="font-mono"
                    style={{ fontSize: '0.55rem', letterSpacing: '0.1em', padding: '2px 6px', background: form.service === s.value ? 'rgba(255,255,255,0.15)' : '#EFF6FF', color: form.service === s.value ? '#FFF' : 'hsl(214, 89%, 52%)', border: `1px solid ${form.service === s.value ? 'rgba(255,255,255,0.2)' : '#BFDBFE'}` }}
                  >
                    {s.badge}
                  </span>
                )}
              </div>
              {s.note && (
                <p className="mt-1" style={{ fontSize: '0.72rem', color: form.service === s.value ? 'rgba(255,255,255,0.6)' : '#767676', lineHeight: 1.4 }}>
                  {s.note}
                </p>
              )}
              {s.price && (
                <p className="font-mono mt-1" style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: form.service === s.value ? 'rgba(255,255,255,0.5)' : '#767676' }}>
                  {s.price}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Add-Ons */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-border">
          <Sparkles size={14} className="text-tech-grey" />
          <p className="small-caps-label">Add-Ons</p>
          <span className="font-mono text-tech-grey ml-auto" style={{ fontSize: '0.6rem', letterSpacing: '0.1em' }}>OPTIONAL</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {addOns.map((a) => {
            const active = selectedAddOns.includes(a.id);
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => toggleAddOn(a.id)}
                className="text-left p-4 border transition-colors flex items-start gap-3"
                style={{
                  borderColor: active ? '#0A0A0A' : 'hsl(var(--border))',
                  background: active ? '#0A0A0A' : '#FFFFFF',
                }}
              >
                <div
                  className="flex-shrink-0 w-4 h-4 border flex items-center justify-center mt-0.5 transition-all"
                  style={{ borderColor: active ? 'rgba(255,255,255,0.5)' : 'hsl(var(--border))', background: active ? 'hsl(214, 89%, 52%)' : 'transparent' }}
                >
                  {active && <Check size={10} color="#FFF" strokeWidth={3} />}
                </div>
                <div className="flex-1">
                  <p className="font-inter font-semibold" style={{ fontSize: '0.88rem', color: active ? '#FFF' : '#0A0A0A' }}>
                    {a.name}
                  </p>
                  <p className="font-mono mt-0.5" style={{ fontSize: '0.6rem', letterSpacing: '0.08em', color: active ? 'rgba(255,255,255,0.5)' : '#AAAAAA' }}>
                    {a.note}
                  </p>
                </div>
                <span className="font-mono flex-shrink-0" style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: active ? 'rgba(255,255,255,0.6)' : 'hsl(214, 89%, 52%)' }}>
                  {a.price}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date & Time */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-border">
          <CalendarDays size={14} className="text-tech-grey" />
          <p className="small-caps-label">Preferred Date</p>
        </div>
        <CalendarPicker
          selectedDate={form.date}
          onDateChange={(val) => setDirect('date', val)}
        />
      </div>

      {/* Time Slot */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-border">
          <Clock size={14} className="text-tech-grey" />
          <p className="small-caps-label">Preferred Time</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => setDirect('time', slot)}
              className="text-center p-3 border transition-colors"
              style={{
                borderColor: form.time === slot ? '#0A0A0A' : 'hsl(var(--border))',
                background: form.time === slot ? '#0A0A0A' : '#FFFFFF',
              }}
            >
              <p className="font-mono" style={{ fontSize: '0.72rem', letterSpacing: '0.05em', color: form.time === slot ? '#FFF' : '#0A0A0A' }}>
                {slot}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-border">
          <Car size={14} className="text-tech-grey" />
          <p className="small-caps-label">Vehicle</p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="small-caps-label block mb-2">Make & Model *</label>
            <input type="text" placeholder="e.g. Honda Civic" value={form.vehicle} onChange={set('vehicle')} className="input-underline" required />
          </div>
          <div>
            <label className="small-caps-label block mb-2">Year</label>
            <input type="text" placeholder="e.g. 2021" value={form.year} onChange={set('year')} className="input-underline" />
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-border">
          <User size={14} className="text-tech-grey" />
          <p className="small-caps-label">Your Details</p>
        </div>
        <div className="space-y-6">
          <div>
            <label className="small-caps-label block mb-2">Full Name *</label>
            <input type="text" placeholder="Your name" value={form.name} onChange={set('name')} className="input-underline" required />
          </div>
          <div>
            <label className="small-caps-label block mb-2">Phone *</label>
            <input type="tel" placeholder="(920) —" value={form.phone} onChange={set('phone')} className="input-underline" required />
          </div>
          <div>
            <label className="small-caps-label block mb-2">Email</label>
            <input type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} className="input-underline" />
          </div>
          <div>
            <label className="small-caps-label block mb-2">Notes / Condition</label>
            <textarea
              placeholder="Describe the current condition or any specific concerns…"
              value={form.notes}
              onChange={set('notes')}
              rows={3}
              className="input-underline resize-none"
            />
          </div>
        </div>
      </div>

      {/* reCAPTCHA v2 widget — only shown when ready (hidden on unsupported domains) */}
      <div id="recaptcha-booking" className={ready ? 'mb-4' : 'hidden'}></div>

      {error && (
        <p className="font-mono text-destructive mb-4" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>{error}</p>
      )}

      <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
        {loading ? 'Sending…' : 'Request Booking'}
        {!loading && <ArrowRight size={16} />}
      </button>

      <p className="text-center text-tech-grey mt-4" style={{ fontSize: '0.78rem' }}>
        We'll confirm your appointment within a few hours.
      </p>
    </form>
  );
}