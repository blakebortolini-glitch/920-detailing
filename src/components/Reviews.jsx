import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Star, ArrowRight } from 'lucide-react';
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

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Review.filter({ approved: true }, '-created_date', 6)
      .then(setReviews)
      .finally(() => setLoading(false));
  }, []);

  if (loading || reviews.length === 0) return null;

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

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-border">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-r border-border p-8 flex flex-col gap-4">
              {/* Stars + service */}
              <div className="flex items-center justify-between">
                <StarDisplay rating={review.rating} />
                {review.service && (
                  <span className="font-mono text-tech-grey" style={{ fontSize: '0.6rem', letterSpacing: '0.1em' }}>
                    {serviceLabels[review.service] || review.service}
                  </span>
                )}
              </div>

              {/* Review text */}
              <p className="text-ink-black flex-1" style={{ fontSize: '0.95rem', lineHeight: 1.65 }}>
                "{review.review_text}"
              </p>

              {/* Photos */}
              {review.photo_urls?.length > 0 && (
                <div className="grid grid-cols-3 gap-1.5">
                  {review.photo_urls.slice(0, 3).map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`${review.customer_name} vehicle photo`}
                      className="aspect-square object-cover w-full"
                    />
                  ))}
                </div>
              )}

              {/* Customer name + vehicle */}
              <div className="pt-3 border-t border-border">
                <p className="font-inter font-bold text-ink-black" style={{ fontSize: '0.9rem' }}>
                  {review.customer_name}
                </p>
                {review.vehicle && (
                  <p className="font-mono text-tech-grey" style={{ fontSize: '0.65rem', letterSpacing: '0.08em', marginTop: 2 }}>
                    {review.vehicle}
                  </p>
                )}
              </div>
            </div>
          ))}
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