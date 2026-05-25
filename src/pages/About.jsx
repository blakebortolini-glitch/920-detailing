export default function About() {
  return (
    <div className="min-h-screen bg-background font-inter">
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-20">
        <p className="small-caps-label text-tech-grey mb-4">About Us</p>
        <h1
          className="font-inter font-black text-ink-black mb-10"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', letterSpacing: '-0.04em', lineHeight: 1 }}
        >
          920 Detailing
        </h1>

        <div className="space-y-6 text-ink-black" style={{ fontSize: '1rem', lineHeight: 1.8 }}>
          <p>
            920 Detailing is a professional mobile auto detailing service based in Kewaunee, Wisconsin.
            We specialize in bringing your vehicle back to its best — whether that means a thorough
            interior deep clean, a precision exterior wash and paint correction, a long-lasting ceramic
            coating, or a complete interior and exterior bundle.
          </p>
          <p>
            We are built for car owners who care about their investment. Whether you drive a daily
            commuter, a weekend sports car, a work truck, or a family SUV, we treat every vehicle with
            the same level of attention and craftsmanship. Our services are appointment-only, ensuring
            that every client receives our full, undivided focus during their scheduled slot.
          </p>
          <p>
            920 Detailing was founded and is operated by Blake, a detail-obsessed professional with
            years of hands-on experience restoring and protecting vehicles of all makes and models.
            Blake personally handles every appointment — there are no sub-contractors, no shortcuts,
            and no compromises on quality.
          </p>
          <p>
            We also offer a range of add-on services to address specific needs: pet hair removal,
            steam cleaning, stain treatment, odor elimination, and more. Every job is tailored to the
            condition of your vehicle and the results you want.
          </p>
          <p>
            Located in Kewaunee, Wisconsin, we proudly serve the surrounding communities across the
            920 area. Ready to book? Use our online booking system to request your appointment in
            minutes, or reach out directly with any questions.
          </p>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <a href="/booking" className="btn-primary inline-flex">
            Book an Appointment →
          </a>
        </div>
      </div>
    </div>
  );
}