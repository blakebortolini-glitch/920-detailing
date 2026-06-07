import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Star, Upload, X, ArrowRight, CheckCircle } from 'lucide-react';

const serviceLabels = {
  interior: 'Interior Detailing',
  exterior: 'Exterior Detailing & Paint Correction',
  ceramic: 'Ceramic Coating',
  full: 'Interior + Exterior Bundle',
  unsure: 'Other',
};

export default function SubmitReview() {
  const [form, setForm] = useState({
    customer_name: '',
    rating: 0,
    review_text: '',
    service: '',
    vehicle: '',
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const uploaded = [];
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      uploaded.push(file_url);
    }
    setPhotos((prev) => [...prev, ...uploaded]);
    setUploading(false);
  };

  const removePhoto = (index) => setPhotos((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.rating === 0) return;
    setSubmitting(true);
    await base44.entities.Review.create({
      ...form,
      photo_urls: photos,
      approved: false,
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
          <CheckCircle size={56} style={{ color: 'hsl(214, 89%, 52%)' }} className="mb-6" />
          <h2 className="font-inter font-black text-ink-black mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.04em' }}>
            THANK YOU!
          </h2>
          <p className="text-tech-grey max-w-md" style={{ fontSize: '1rem', lineHeight: 1.7 }}>
            Your review has been submitted and will appear on our site once approved. We appreciate your feedback!
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="px-6 md:px-16 max-w-screen-md mx-auto py-24 md:py-36">
        {/* Header */}
        <div className="mb-16">
          <p className="small-caps-label mb-4" style={{ color: 'hsl(214, 89%, 52%)' }}>Share Your Experience</p>
          <h1
            className="font-inter font-black text-ink-black"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', lineHeight: 0.9, letterSpacing: '-0.04em' }}
          >
            LEAVE A<br />REVIEW.
          </h1>
          <p className="mt-6 text-tech-grey" style={{ fontSize: '1rem', lineHeight: 1.7 }}>
            How did we do? Share your experience and upload photos of your vehicle after the detail.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Star Rating */}
          <div className="mb-10">
            <p className="small-caps-label mb-4 pb-2 border-b border-border">Your Rating</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, rating: star }))}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  style={{ minHeight: 48, minWidth: 48 }}
                  className="focus:outline-none"
                >
                  <Star
                    size={36}
                    fill={(hoveredStar || form.rating) >= star ? 'hsl(214, 89%, 52%)' : 'none'}
                    stroke={(hoveredStar || form.rating) >= star ? 'hsl(214, 89%, 52%)' : '#CCCCCC'}
                    className="transition-colors"
                  />
                </button>
              ))}
            </div>
            {form.rating === 0 && (
              <p className="text-tech-grey mt-2" style={{ fontSize: '0.8rem' }}>Please select a rating</p>
            )}
          </div>

          {/* Review Text */}
          <div className="mb-10">
            <p className="small-caps-label mb-4 pb-2 border-b border-border">Your Review</p>
            <div className="space-y-6">
              <div>
                <label className="small-caps-label block mb-2">Full Name</label>
                <input
                  name="customer_name"
                  type="text"
                  placeholder="Your name"
                  value={form.customer_name}
                  onChange={handleChange}
                  className="input-underline"
                  required
                />
              </div>
              <div>
                <label className="small-caps-label block mb-2">Vehicle</label>
                <input
                  name="vehicle"
                  type="text"
                  placeholder="e.g. 2021 Honda Civic"
                  value={form.vehicle}
                  onChange={handleChange}
                  className="input-underline"
                />
              </div>
              <div>
                <label className="small-caps-label block mb-2">Service Received</label>
                <select
                  name="service"
                  value={form.service}
                  onChange={(e) => setForm((prev) => ({ ...prev, service: e.target.value }))}
                  className="input-underline"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">Select a service…</option>
                  {Object.entries(serviceLabels).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="small-caps-label block mb-2">Your Experience</label>
                <textarea
                  name="review_text"
                  placeholder="Tell us about your experience with 920 Detailing…"
                  value={form.review_text}
                  onChange={handleChange}
                  rows={5}
                  className="input-underline resize-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="mb-10">
            <p className="small-caps-label mb-4 pb-2 border-b border-border">Photos (Optional)</p>
            <p className="text-tech-grey mb-4" style={{ fontSize: '0.85rem' }}>
              Show off your freshly detailed ride — before & after shots welcome!
            </p>

            {/* Uploaded previews */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {photos.map((url, i) => (
                  <div key={i} className="relative aspect-square">
                    <img src={url} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 bg-ink-black text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                      style={{ minHeight: 24, minWidth: 24 }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="btn-outline cursor-pointer inline-flex items-center gap-3" style={{ fontSize: '0.75rem' }}>
              <Upload size={14} />
              {uploading ? 'Uploading…' : 'Upload Photos'}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handlePhotoUpload}
                disabled={uploading}
              />
            </label>
          </div>

          <button
            type="submit"
            className="btn-primary w-full justify-center"
            disabled={submitting || form.rating === 0}
            style={{ background: 'hsl(214, 89%, 52%)', borderColor: 'hsl(214, 89%, 52%)' }}
          >
            {submitting ? 'Submitting…' : 'Submit Review'}
            {!submitting && <ArrowRight size={16} />}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}