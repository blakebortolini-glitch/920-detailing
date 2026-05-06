import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import BookingsTable from '@/components/admin/BookingsTable';
import { useAuth } from '@/lib/AuthContext';

export default function Admin() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchBookings = async () => {
    setLoading(true);
    const data = await base44.entities.Booking.list('-created_date', 100);
    setBookings(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    await base44.entities.Booking.update(id, { status });
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center border border-border p-12">
          <p className="small-caps-label text-tech-grey mb-3">Access Denied</p>
          <h1 className="font-inter font-black text-ink-black text-3xl" style={{ letterSpacing: '-0.03em' }}>
            Admins Only
          </h1>
        </div>
      </div>
    );
  }

  const filtered = statusFilter === 'all' ? bookings : bookings.filter((b) => b.status === statusFilter);

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Header */}
      <div className="border-b border-border px-6 md:px-16 py-6 flex items-center justify-between">
        <div>
          <p className="small-caps-label text-tech-grey mb-1">920 Detailing</p>
          <h1 className="font-inter font-black text-ink-black text-2xl" style={{ letterSpacing: '-0.03em' }}>
            Booking Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {['all', 'new', 'confirmed', 'completed', 'cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="small-caps-label px-3 py-2 border transition-colors"
              style={{
                fontSize: '0.6rem',
                background: statusFilter === s ? '#0A0A0A' : 'transparent',
                color: statusFilter === s ? '#FFFFFF' : '#767676',
                borderColor: statusFilter === s ? '#0A0A0A' : '#E8E8E8',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="px-6 md:px-16 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 border-2 border-border border-t-ink-black rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 border border-border">
            <p className="small-caps-label text-tech-grey">No bookings found</p>
          </div>
        ) : (
          <BookingsTable bookings={filtered} onUpdateStatus={updateStatus} />
        )}
      </div>
    </div>
  );
}