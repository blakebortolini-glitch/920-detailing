import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import CalendarPicker from '@/components/CalendarPicker';

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
];

export default function AdminRescheduleModal({ booking, onClose, onSuccess }) {
  const [date, setDate] = useState(booking.date || '');
  const [time, setTime] = useState(booking.time || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !time) { setError('Please select a date and time.'); return; }
    setLoading(true);
    setError('');

    try {
      const oldDate = booking.date;

      await base44.entities.Booking.update(booking.id, { date, time, status: 'confirmed' });

      // Sync Google Calendar — pass old_data so the function knows the date changed
      await base44.functions.invoke('syncBookingToCalendar', {
        event: { type: 'update', entity_id: booking.id },
        data: { ...booking, date, time, status: 'confirmed' },
        old_data: { ...booking, date: oldDate },
      });

      onSuccess({ ...booking, date, time, status: 'confirmed' });
      onClose();
    } catch (err) {
      setError('Failed to reschedule. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white w-full max-w-lg p-8 relative overflow-y-auto" style={{ maxHeight: '90vh' }}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-tech-grey hover:text-ink-black text-2xl leading-none"
          aria-label="Close"
        >
          ×
        </button>

        <p className="small-caps-label mb-3">Admin — Reschedule</p>
        <h2
          className="font-black text-ink-black mb-6"
          style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', lineHeight: 0.95, letterSpacing: '-0.03em' }}
        >
          {booking.name}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="small-caps-label block mb-2">New Date</label>
            <CalendarPicker selectedDate={date} onDateChange={setDate} />
          </div>

          <div>
            <label className="small-caps-label block mb-2">New Time</label>
            <div className="grid grid-cols-4 gap-2">
              {TIME_SLOTS.map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  className={`border py-2 text-xs font-mono transition-all ${
                    time === slot
                      ? 'bg-ink-black text-white border-ink-black'
                      : 'bg-white text-ink-black border-gray-200 hover:border-ink-black'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? 'Saving…' : 'Confirm Reschedule'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline px-6">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}