import { useEffect, useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Star, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const serviceLabels = {
  interior: 'Interior Detailing',
  exterior: 'Exterior & Paint Correction',
  ceramic: 'Ceramic Coating',
  full: 'Interior + Exterior Bundle',
  unsure: 'Other',
};

function StarDisplay({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          fill={rating >= s ? 'hsl(214, 89%, 52%)' : 'none'}
          stroke={rating >= s ? 'hsl(214, 89%, 52%)' : '#CCCCCC'}
        />
      ))}
    </div>
  );
}

export default function ReviewsCarousel() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoplayRef = useRef(null);

  useEffect(() => {
    base44.entities.Review.filter({ approved: true }, '-created_date', 20)
      .then(setReviews)
      .finally(() => setLoading(false));
  }, []);

  const total = reviews.length;

  const go = (dir) => {
    if (isAnimating || total === 0) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev + dir + total) % total);
    setTimeout(() => setIsAnimating(false), 400);
  };

  // Autoplay every 5s
  useEffect(() => {
    if (total <= 1) return;
    autoplayRef.current = setInterval(() => go(1), 5000);
    return () => clearInterval(autoplayRef.current);
  }, [total, isAnimating]);

  const resetAutoplay = (dir) => {
    clearInterval(autoplayRef.current);
    go(dir);
  };

  if (loading || total === 0) return null;

  const review = reviews[current];

  return (
    <section id="reviews" className="py-24 md:py-36 border-t border-border">
      <div className="px-6 md:px-16 max-w-screen-xl mx-auto">

        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="small-caps-label mb-4" style={{ color: 'hsl(214, 89%, 52%)' }}>Client Feedback</p>
            <h2
              className="font-inter font-black text-ink-black"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', lineHeight: 0.9, letterSpacing: '-0.04em' }}
            >
              THE WORD<br />ON THE STREET.
            </h2>
          </div>
          <Link
            to="/submit-review"
            className="btn-primary flex-shrink-0"
            style={{ background: 'hsl(214, 89%, 52%)', borderColor: 'hsl(214, 89%, 52%)' }}
          >
            Leave a Review
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative border border-border">
          {/* Main review card */}
          <div
            key={current}
            className="p-10 md:p-16 flex flex-col gap-6 transition-opacity duration-300"
            style={{ opacity: isAnimating ? 0 : 1, minHeight: 280 }}
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <StarDisplay rating={review.rating} />
              {review.service && (
                <span className="font-mono text-tech-grey" style={{ fontSize: '0.6rem', letterSpacing: '0.1em' }}>
                  {serviceLabels[review.service] || review.service}
                </span>
              )}
            </div>

            <p
              className="text-ink-black font-inter flex-1"
              style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', lineHeight: 1.5, letterSpacing: '-0.01em', maxWidth: '80ch' }}
            >
              "{review.review_text}"
            </p>

            {review.photo_urls?.length > 0 && (
              <div className="flex gap-2">
                {review.photo_urls.slice(0, 4).map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`${review.customer_name} vehicle`}
                    className="w-20 h-20 object-cover"
                  />
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <div>
                <p className="font-inter font-bold text-ink-black" style={{ fontSize: '0.95rem' }}>
                  {review.customer_name}
                </p>
                {review.vehicle && (
                  <p className="font-mono text-tech-grey" style={{ fontSize: '0.65rem', letterSpacing: '0.08em', marginTop: 2 }}>
                    {review.vehicle}
                  </p>
                )}
              </div>

              {/* Counter */}
              <p className="font-mono text-tech-grey" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>
                {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </p>
            </div>
          </div>

          {/* Nav arrows */}
          {total > 1 && (
            <div className="border-t border-border flex">
              <button
                onClick={() => resetAutoplay(-1)}
                className="flex-1 flex items-center justify-center py-4 border-r border-border hover:bg-secondary transition-colors"
                aria-label="Previous review"
                style={{ minHeight: 52 }}
              >
                <ChevronLeft size={18} className="text-ink-black" />
              </button>
              {/* Dot indicators */}
              <div className="flex items-center gap-1.5 px-6">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { clearInterval(autoplayRef.current); setCurrent(i); }}
                    className="transition-all"
                    style={{
                      width: i === current ? 20 : 6,
                      height: 6,
                      background: i === current ? '#0A0A0A' : '#CCCCCC',
                    }}
                    aria-label={`Go to review ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => resetAutoplay(1)}
                className="flex-1 flex items-center justify-center py-4 border-l border-border hover:bg-secondary transition-colors"
                aria-label="Next review"
                style={{ minHeight: 52 }}
              >
                <ChevronRight size={18} className="text-ink-black" />
              </button>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-10 pt-8 border-t border-border text-center">
          <p className="text-tech-grey mb-4" style={{ fontSize: '0.9rem' }}>
            Had your vehicle detailed with us?
          </p>
          <Link to="/submit-review" className="btn-outline inline-flex">
            Share Your Experience
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}