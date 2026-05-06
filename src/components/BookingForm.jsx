import { useState } from 'react';
import { ArrowRight, CalendarDays, Car, User, CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import CalendarPicker from './CalendarPicker';

const services = [
  { value: 'interior', label: 'Interior Detailing', price: 'From $150' },
  { value: 'full', label: 'Interior + Exterior Bundle', price: 'From $185' },
  { value: 'exterior', label: 'Exterior & Paint Correction', price: 'From $200' },
  { value: 'ceramic', label: 'Ceramic Coating', price: 'From $600' },
  { value: 'unsure', label: 'Not Sure — Need a Quote', price: '' },
];


export default function BookingForm() {
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    vehicle: '', year: '',
    service: '', date: '', time: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const setDirect = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.phone || !form.vehicle || !form.service || !form.date) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    const res = await base44.functions.invoke('sendBooking', form);
    setLoading(false);
    if (res.data?.success) {
      setSubmitted(true);
    } else {
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
              <p
                className="font-inter font-semibold"
                style={{ fontSize: '0.88rem', color: form.service === s.value ? '#FFF' : '#0A0A0A' }}
              >
                {s.label}
              </p>
              {s.price && (
                <p className="font-mono mt-1" style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: form.service === s.value ? 'rgba(255,255,255,0.5)' : '#767676' }}>
                  {s.price}
                </p>
              )}
            </button>
          ))}
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