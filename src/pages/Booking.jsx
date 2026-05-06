import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingForm from '../components/BookingForm';

export default function Booking() {
  return (
    <main className="font-inter bg-white text-ink-black">
      <Navbar />
      <section className="py-24 md:py-36 px-6 md:px-16 max-w-screen-xl mx-auto">
        <div className="mb-16">
          <p className="small-caps-label mb-4">Schedule Service</p>
          <h1
            className="font-inter font-black text-ink-black"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', lineHeight: 0.9, letterSpacing: '-0.04em' }}
          >
            BOOK YOUR<br />DETAIL.
          </h1>
          <p className="mt-6 text-tech-grey max-w-xl" style={{ fontSize: '1rem' }}>
            Select your service, pick a date and time, and we'll confirm your appointment within a few hours.
          </p>
        </div>
        <BookingForm />
      </section>
      <Footer />
    </main>
  );
}