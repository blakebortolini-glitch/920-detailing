import { useState } from 'react';
import { ArrowRight, Phone } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', vehicle: '', year: '', service: '', notes: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate a brief delay for UX
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 md:py-36 border-t border-border">
      <div className="px-6 md:px-16 max-w-screen-xl mx-auto">

        {/* Section header */}
        <div className="mb-16">
          <p className="small-caps-label mb-4" style={{ color: 'hsl(214, 89%, 52%)' }}>Get In Touch</p>
          <h2
            className="font-inter font-black text-ink-black"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', lineHeight: 0.9, letterSpacing: '-0.04em' }}
          >
            THE INQUIRY<br />PORTAL.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-16 md:gap-24">

          {/* Left — static contact info */}
          <aside>
            <p className="text-tech-grey mb-10" style={{ fontSize: '1rem', lineHeight: 1.7 }}>
              Ready to restore your vehicle? Reach out directly or fill out the form and we'll get back to you within 24 hours.
            </p>

            <div className="mb-10">
              <p className="small-caps-label mb-3">Direct Line</p>
              <a
                href="tel:+19202553123"
                className="font-inter font-black transition-colors block"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1, letterSpacing: '-0.04em', color: 'hsl(214, 89%, 52%)' }}
                aria-label="Call 920 Detailing"
              >
                (920) 255-3123
              </a>
              <p className="small-caps-label mt-2 text-tech-grey">Call or text — we respond fast</p>
            </div>

            <div className="mb-10">
              <p className="small-caps-label mb-2">Location</p>
              <p className="font-inter font-semibold text-ink-black" style={{ fontSize: '1rem' }}>920 Detailing</p>
              <p className="text-tech-grey" style={{ fontSize: '0.95rem' }}>Kewaunee, Wisconsin</p>
            </div>

            <div>
              <p className="small-caps-label mb-2">Hours</p>
              <p className="font-inter text-ink-black" style={{ fontSize: '0.95rem' }}>Mon – Sat &nbsp; 8:00 AM – 6:00 PM</p>
              <p className="text-tech-grey" style={{ fontSize: '0.85rem', marginTop: 4 }}>By appointment only</p>
            </div>

            <div className="mt-12 p-6 border border-border">
              <p className="small-caps-label mb-2">Response Time</p>
              <p className="font-mono text-ink-black font-medium" style={{ fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                &lt; 24 HRS GUARANTEED
              </p>
            </div>
          </aside>

          {/* Right — contact form */}
          <div>
            {submitted ? (
              <div className="h-full flex flex-col justify-center">
                <div className="border border-ink-black p-10">
                  <p className="small-caps-label mb-4 text-tech-grey">Message Received</p>
                  <h3 className="font-inter font-black text-ink-black mb-4" style={{ fontSize: '2rem', letterSpacing: '-0.03em' }}>
                    We'll be in touch.
                  </h3>
                  <p className="text-tech-grey" style={{ fontSize: '0.95rem' }}>
                    Expect a response within 24 hours. For faster service, call or text us directly.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>

                {/* Group 1: The Vehicle */}
                <div className="mb-10">
                  <p className="small-caps-label mb-6 pb-2 border-b border-border">The Vehicle</p>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="vehicle" className="small-caps-label block mb-2">Make & Model</label>
                      <input
                        id="vehicle"
                        name="vehicle"
                        type="text"
                        placeholder="e.g. Honda Civic"
                        value={form.vehicle}
                        onChange={handleChange}
                        className="input-underline"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="year" className="small-caps-label block mb-2">Year</label>
                      <input
                        id="year"
                        name="year"
                        type="text"
                        placeholder="e.g. 2021"
                        value={form.year}
                        onChange={handleChange}
                        className="input-underline"
                      />
                    </div>
                  </div>
                </div>

                {/* Group 2: The Service */}
                <div className="mb-10">
                  <p className="small-caps-label mb-6 pb-2 border-b border-border">The Service</p>
                  <div>
                    <label htmlFor="service" className="small-caps-label block mb-2">Service Requested</label>
                    <select
                      id="service"
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      className="input-underline"
                      required
                    >
                      <option value="">Select a service…</option>
                      <option value="interior">Interior Detailing</option>
                      <option value="exterior">Exterior Detailing & Paint Correction</option>
                      <option value="ceramic">Ceramic Coating</option>
                      <option value="full">Full Detail (Interior + Exterior)</option>
                      <option value="unsure">Not Sure — Need a Quote</option>
                    </select>
                  </div>
                </div>

                {/* Group 3: The Contact */}
                <div className="mb-10">
                  <p className="small-caps-label mb-6 pb-2 border-b border-border">Your Details</p>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="small-caps-label block mb-2">Full Name</label>
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
                    <div>
                      <label htmlFor="phone" className="small-caps-label block mb-2">Phone</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="(920) —"
                        value={form.phone}
                        onChange={handleChange}
                        className="input-underline"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="small-caps-label block mb-2">Email</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={handleChange}
                        className="input-underline"
                      />
                    </div>
                    <div>
                      <label htmlFor="notes" className="small-caps-label block mb-2">Notes / Condition</label>
                      <textarea
                        id="notes"
                        name="notes"
                        placeholder="Describe the current condition of your vehicle or any specific concerns…"
                        value={form.notes}
                        onChange={handleChange}
                        rows={3}
                        className="input-underline resize-none"
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full justify-center" disabled={loading} style={{ background: 'hsl(214, 89%, 52%)', borderColor: 'hsl(214, 89%, 52%)' }}>
                  {loading ? 'Sending…' : 'Submit Inquiry'}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}