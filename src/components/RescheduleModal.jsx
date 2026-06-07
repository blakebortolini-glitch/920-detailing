import { useState } from 'react';
import { base44 } from '@/api/base44Client';

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
];

export default function RescheduleModal({ booking, onClose, onSuccess }) {
  const [date, setDate] = useState(booking.date || '');
  const [time, setTime] = useState(booking.time || '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !time) {
      setError('Please select a date and time.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const updated = await base44.entities.Booking.update(booking.id, {
        date,
        time,
        status: 'new',
        notes: notes ? `[Reschedule request] ${notes}` : booking.notes,
      });
      onSuccess({ ...booking, date, time, status: 'new', notes: updated.notes });
    } catch (err) {
      setError('Failed to reschedule. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white w-full max-w-lg p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-tech-grey hover:text-ink-black text-2xl leading-none"
          aria-label="Close"
        >
          ×
        </button>

        <p className="small-caps-label mb-3">Reschedule</p>
        <h2
          className="font-black text-ink-black mb-8"
          style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', lineHeight: 0.95, letterSpacing: '-0.03em' }}
        >
          REQUEST A<br />NEW TIME.
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="small-caps-label block mb-2">New Date</label>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setDate(e.target.value)}
              className="input-underline"
              required
            />
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

          <div>
            <label className="small-caps-label block mb-2">Reason / Notes (optional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Let us know why you're rescheduling..."
              rows={3}
              className="input-underline resize-none"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? 'Submitting...' : 'Request Reschedule'}
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