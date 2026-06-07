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
      </div>
      <Footer />
    </div>
  );
}