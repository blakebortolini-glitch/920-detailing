import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MyBookingCard from '../components/MyBookingCard';
import RescheduleModal from '../components/RescheduleModal';
import ChangeServiceModal from '../components/ChangeServiceModal';
import AdminRescheduleModal from '../components/admin/AdminRescheduleModal';

export default function MyBookings() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleBooking, setRescheduleBooking] = useState(null);
  const [changeServiceBooking, setChangeServiceBooking] = useState(null);

  useEffect(() => {
    const init = async () => {
      const authed = await base44.auth.isAuthenticated();
      if (!authed) {
        base44.auth.redirectToLogin(window.location.href);
        return;
      }
      const me = await base44.auth.me();
      setUser(me);
      const results = await base44.entities.Booking.list('-created_date', 50);
      setBookings(results);
      setLoading(false);
    };
    init();
  }, []);

  const handleCancel = async (booking) => {
    await base44.entities.Booking.update(booking.id, { status: 'cancelled' });
    setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: 'cancelled' } : b));
  };

  const handleRescheduleSuccess = (updatedBooking) => {
    setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
    setRescheduleBooking(null);
  };

  const handleChangeServiceSuccess = (updatedBooking) => {
    setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
    setChangeServiceBooking(null);
  };

  const active = bookings.filter(b => b.status !== 'cancelled' && b.status !== 'completed');
  const past = bookings.filter(b => b.status === 'cancelled' || b.status === 'completed');

  if (loading) {
    return (
      <main className="font-inter bg-white text-ink-black min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-ink-black rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  return (
    <main className="font-inter bg-white text-ink-black">
      <Navbar />
      <section className="py-24 md:py-36 px-6 md:px-16 max-w-screen-xl mx-auto">
        <div className="mb-16">
          <p className="small-caps-label mb-4">Your Appointments</p>
          <h1
            className="font-inter font-black text-ink-black"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', lineHeight: 0.9, letterSpacing: '-0.04em' }}
          >
            MY<br />BOOKINGS.
          </h1>
          {user && (
            <p className="mt-6 text-tech-grey max-w-xl" style={{ fontSize: '1rem' }}>
              Viewing appointments for <span className="text-ink-black font-semibold">{user.full_name}</span>.
            </p>
          )}
        </div>

        {bookings.length === 0 ? (
          <div className="border border-gray-200 p-12 text-center">
            <p className="text-tech-grey" style={{ fontSize: '1rem' }}>You don't have any bookings yet.</p>
            <a href="/booking" className="btn-primary inline-flex mt-6" style={{ fontSize: '0.75rem' }}>
              Book an Appointment
            </a>
          </div>
        ) : (
          <div className="space-y-16">
            {active.length > 0 && (
              <div>
                <p className="small-caps-label mb-6">Upcoming</p>
                <div className="space-y-4">
                  {active.map(b => (
                    <MyBookingCard
                      key={b.id}
                      booking={b}
                      onCancel={handleCancel}
                      onReschedule={setRescheduleBooking}
                      onChangeService={setChangeServiceBooking}
                    />
                  ))}
                </div>
              </div>
            )}
            {past.length > 0 && (
              <div>
                <p className="small-caps-label mb-6">Past & Cancelled</p>
                <div className="space-y-4">
                  {past.map(b => (
                    <MyBookingCard key={b.id} booking={b} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {rescheduleBooking && (
        user?.role === 'admin' ? (
          <AdminRescheduleModal
            booking={rescheduleBooking}
            onClose={() => setRescheduleBooking(null)}
            onSuccess={handleRescheduleSuccess}
          />
        ) : (
          <RescheduleModal
            booking={rescheduleBooking}
            onClose={() => setRescheduleBooking(null)}
            onSuccess={handleRescheduleSuccess}
          />
        )
      )}

      {changeServiceBooking && (
        <ChangeServiceModal
          booking={changeServiceBooking}
          onClose={() => setChangeServiceBooking(null)}
          onSuccess={handleChangeServiceSuccess}
        />
      )}

      <Footer />
    </main>
  );
}