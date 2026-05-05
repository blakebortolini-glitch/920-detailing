import { useState } from 'react';
import { Phone, ArrowRight, CheckCircle } from 'lucide-react';

const PHONE = '(920) 000-0000';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    vehicle: '',
    year: '',
    color: '',
    service: '',
    condition: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 md:py-36 border-t border-border">
      <div className="px-6 md:px-16 max-w-screen-xl mx-auto">
        <div className="mb-16">
          <p className="small-caps-label mb-4">Get In Touch</p>
          <h2
            className="font-inter font-black text-ink-black"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', lineHeight: 0.9, letterSpacing: '-0.04em' }}
          >
            BOOK YOUR<br />DETAIL.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          {/* Left — Static contact info */}
          <aside>
            <div className="mb-14">
              <p className="small-caps-label mb-4">Call or Text</p>
              <a
                href={`tel:${PHONE.replace(/\D/g, '')}`}
                className="font-inter font-black text-ink-black block hover:text-tech-grey transition-colors"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.04em', lineHeight: 1 }}
              >
                {PHONE}
              </a>
            </div>

            <div className="h-px bg-border w-full mb-14" />

            <div className="space-y-10">
              <div>
                <p className="small-caps-label mb-2">Response Time</p>
                <p className="font-inter font-semibold text-ink-black" style={{ fontSize: '1rem' }}>Within 24 hours</p>
              </div>
              <div>
                <p className="small-caps-label mb-2">Service Area</p>
                <p className="font-inter font-semibold text-ink-black" style={{ fontSize: '1rem' }}>Greater 920 Region</p>
              </div>
              <div>
                <p className="small-caps-label mb-2">Hours</p>
                <p className="font-inter font-semibold text-ink-black" style={{ fontSize: '1rem' }}>Mon–Sat, By Appointment</p>
              </div>
            </div>

            <div className="mt-14 p-6 border border-border bg-[#F9F9F9]">
              <p className="small-caps-label mb-3">Note</p>
              <p className="text-tech-grey" style={{ fontSize: '0.9rem', lineHeight: 1.65 }}>
                Ceramic coating is only applied after a full paint correction. If you're requesting coating, that service will be included in your quote.
              </p>
            </div>
          </aside>

          {/* Right — Contact form */}
          <div>
            {submitted ? (
              <div className="flex flex-col items-start gap-6 py-16">
                <CheckCircle size={40} className="text-ink-black" />
                <h3 className="font-inter font-black text-ink-black" style={{ fontSize: '2rem', letterSpacing: '-0.03em' }}>
                  Message Received.
                </h3>
                <p className="text-tech-grey" style={{ fontSize: '1rem' }}>
                  We'll review your vehicle details and get back to you within 24 hours with a quote and available dates.
                </p>
                <button onClick={() => setSubmitted(false)} className="btn-outline mt-4">
                  Submit Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {/* The Vehicle */}
                <fieldset className="mb-12 border-none p-0 m-0">
                  <legend className="small-caps-label mb-6 block">The Vehicle</legend>
                  <div className="space-y-8">
                    <div>
                      <label htmlFor="vehicle" className="small-caps-label block mb-1" style={{ fontSize: '0.6rem' }}>Year / Make / Model</label>
                      <input
                        id="vehicle"
                        name="vehicle"
                        type="text"
                        placeholder="e.g. 2021 Honda Accord"
                        value={form.vehicle}
                        onChange={handleChange}
                        className="input-underline"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <label htmlFor="color" className="small-caps-label block mb-1" style={{ fontSize: '0.6rem' }}>Paint Color</label>
                        <input
                          id="color"
                          name="color"
                          type="text"
                          placeholder="e.g. Midnight Black"
                          value={form.color}
                          onChange={handleChange}
                          className="input-underline"
                        />
                      </div>
                      <div>
                        <label htmlFor="condition" className="small-caps-label block mb-1" style={{ fontSize: '0.6rem' }}>Paint Condition</label>
                        <select
                          id="condition"
                          name="condition"
                          value={form.condition}
                          onChange={handleChange}
                          className="input-underline"
                        >
                          <option value="">Select...</option>
                          <option value="like-new">Like New</option>
                          <option value="light-swirls">Light Swirls</option>
                          <option value="heavy-swirls">Heavy Swirls / Scratches</option>
                          <option value="oxidized">Oxidized / Faded</option>
                          <option value="unknown">Not Sure</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </fieldset>

                {/* The Service */}
                <fieldset className="mb-12 border-none p-0 m-0">
                  <legend className="small-caps-label mb-6 block">The Service</legend>
                  <div>
                    <label htmlFor="service" className="small-caps-label block mb-1" style={{ fontSize: '0.6rem' }}>Service Requested</label>
                    <select
                      id="service"
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      className="input-underline"
                      required
                    >
                      <option value="">Select a service...</option>
                      <option value="interior">Interior Detail</option>
                      <option value="exterior">Exterior Detail & Paint Correction</option>
                      <option value="ceramic">Ceramic Coating (includes Paint Correction)</option>
                      <option value="full">Full Detail (Interior + Exterior)</option>
                      <option value="unsure">Not Sure — Need a Quote</option>
                    </select>
                  </div>
                </fieldset>

                {/* Contact Info */}
                <fieldset className="mb-12 border-none p-0 m-0">
                  <legend className="small-caps-label mb-6 block">Your Contact</legend>
                  <div className="space-y-8">
                    <div>
                      <label htmlFor="name" className="small-caps-label block mb-1" style={{ fontSize: '0.6rem' }}>Full Name</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Your name"
                        value={form.name}
                        onChange={handleChange}
                        className="input-underline"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <label htmlFor="email" className="small-caps-label block mb-1" style={{ fontSize: '0.6rem' }}>Email</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@email.com"
                          value={form.email}
                          onChange={handleChange}
                          className="input-underline"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="small-caps-label block mb-1" style={{ fontSize: '0.6rem' }}>Phone</label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="(000) 000-0000"
                          value={form.phone}
                          onChange={handleChange}
                          className="input-underline"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="notes" className="small-caps-label block mb-1" style={{ fontSize: '0.6rem' }}>Additional Notes</label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        placeholder="Anything else we should know about your vehicle or goals..."
                        value={form.notes}
                        onChange={handleChange}
                        className="input-underline resize-none"
                        style={{ borderBottom: '1px solid #0A0A0A', paddingBottom: 8 }}
                      />
                    </div>
                  </div>
                </fieldset>

                <button type="submit" className="btn-primary w-full justify-center">
                  Send Inquiry
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}