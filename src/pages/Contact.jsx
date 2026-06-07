import { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Send email via mailto fallback — opens mail client with prefilled content
    const subject = encodeURIComponent(`Contact Inquiry from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\nMessage:\n${form.message}`);
    window.open(`mailto:920detailing@gmail.com?subject=${subject}&body=${body}`);
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-28 md:py-36">
        <p className="small-caps-label text-tech-grey mb-4">Get in Touch</p>
        <h1
          className="font-inter font-black text-ink-black mb-10"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', letterSpacing: '-0.04em', lineHeight: 1 }}
        >
          Contact Us
        </h1>

        <div className="space-y-8">
          {/* Phone */}
          <div className="border-t border-border pt-6">
            <p className="small-caps-label text-tech-grey mb-1">Phone / Text</p>
            <a
              href="tel:+19202553123"
              className="font-inter font-black text-ink-black text-2xl hover:text-tech-grey transition-colors"
              style={{ letterSpacing: '-0.03em' }}
            >
              (920) 255-3123
            </a>
            <p className="text-sm text-tech-grey mt-1">Call or text anytime — we'll get back to you promptly.</p>
          </div>

          {/* Email */}
          <div className="border-t border-border pt-6">
            <p className="small-caps-label text-tech-grey mb-1">Email</p>
            <a
              href="mailto:920detailing@gmail.com"
              className="font-inter font-black text-ink-black text-2xl hover:text-tech-grey transition-colors"
              style={{ letterSpacing: '-0.03em' }}
            >
              920detailing@gmail.com
            </a>
            <p className="text-sm text-tech-grey mt-1">For general inquiries, quotes, or questions about our services.</p>
          </div>

          {/* Location */}
          <div className="border-t border-border pt-6">
            <p className="small-caps-label text-tech-grey mb-1">Location</p>
            <p className="font-inter font-black text-ink-black text-2xl" style={{ letterSpacing: '-0.03em' }}>
              Kewaunee, Wisconsin
            </p>
            <p className="text-sm text-tech-grey mt-1">
              We are appointment-only. Exact address is confirmed upon booking.
            </p>
          </div>

          {/* Hours */}
          <div className="border-t border-border pt-6">
            <p className="small-caps-label text-tech-grey mb-1">Hours</p>
            <p className="font-inter font-black text-ink-black text-2xl" style={{ letterSpacing: '-0.03em' }}>
              By Appointment
            </p>
            <p className="text-sm text-tech-grey mt-1">
              Book online anytime — we'll confirm your preferred date and time within 24 hours.
            </p>
          </div>

          <div className="border-t border-border pt-8">
            <a href="/booking" className="btn-primary inline-flex">
              Book an Appointment →
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="mt-16 border-t border-border pt-12">
          <p className="small-caps-label text-tech-grey mb-4">Send a Message</p>
          <h2 className="font-inter font-black text-ink-black mb-8" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', letterSpacing: '-0.04em', lineHeight: 1 }}>
            Have a Question?
          </h2>

          {submitted ? (
            <div className="flex flex-col items-start gap-4 py-8">
              <CheckCircle size={40} style={{ color: 'hsl(214, 89%, 52%)' }} />
              <p className="font-inter font-black text-ink-black text-xl" style={{ letterSpacing: '-0.02em' }}>Message sent!</p>
              <p className="text-tech-grey text-sm">We'll get back to you as soon as possible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
              <div>
                <label className="small-caps-label block mb-2">Full Name *</label>
                <input type="text" placeholder="Your name" value={form.name} onChange={set('name')} className="input-underline" required />
              </div>
              <div>
                <label className="small-caps-label block mb-2">Email *</label>
                <input type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} className="input-underline" required />
              </div>
              <div>
                <label className="small-caps-label block mb-2">Phone</label>
                <input type="tel" placeholder="(920) —" value={form.phone} onChange={set('phone')} className="input-underline" />
              </div>
              <div>
                <label className="small-caps-label block mb-2">Message *</label>
                <textarea placeholder="How can we help you?" value={form.message} onChange={set('message')} rows={5} className="input-underline resize-none" required />
              </div>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send Message'}
                {!submitting && <ArrowRight size={16} />}
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}