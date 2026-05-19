import { useState } from 'react';

const SERVICE_LABELS = {
  interior: 'Interior Detailing',
  exterior: 'Exterior Detailing & Paint Correction',
  ceramic: 'Ceramic Coating',
  full: 'Interior + Exterior Bundle',
  unsure: 'Not Sure — Need a Quote',
};

const STATUS_CONFIG = {
  new: { label: 'Pending Confirmation', color: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
  confirmed: { label: 'Confirmed', color: 'bg-green-50 text-green-800 border-green-200' },
  completed: { label: 'Completed', color: 'bg-gray-100 text-gray-600 border-gray-200' },
  cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-700 border-red-200' },
};

export default function MyBookingCard({ booking, onCancel, onReschedule, onChangeService }) {
  const [confirming, setConfirming] = useState(false);

  const serviceLabel = SERVICE_LABELS[booking.service] || booking.service;
  const vehicleStr = `${booking.year ? booking.year + ' ' : ''}${booking.vehicle}`;
  const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.new;
  const isPast = booking.status === 'cancelled' || booking.status === 'completed';

  const handleCancelClick = () => {
    if (confirming) {
      onCancel(booking);
      setConfirming(false);
    } else {
      setConfirming(true);
    }
  };

  return (
    <div className={`border p-6 md:p-8 flex flex-col md:flex-row md:items-start md:justify-between gap-6 ${isPast ? 'opacity-60' : ''}`}>
      <div className="space-y-3 flex-1">
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`text-xs font-mono border px-2 py-0.5 ${status.color}`}>
            {status.label}
          </span>
        </div>
        <div>
          <p className="font-black text-xl md:text-2xl tracking-tight">{serviceLabel}</p>
          <p className="text-tech-grey mt-1" style={{ fontSize: '0.9rem' }}>{vehicleStr}</p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm font-mono text-tech-grey">
          <span>📅 {booking.date}</span>
          <span>🕐 {booking.time}</span>
        </div>
        {booking.notes && (
          <p className="text-sm text-tech-grey border-l-2 border-gray-200 pl-3">{booking.notes}</p>
        )}
      </div>

      {!isPast && onCancel && onReschedule && (
        <div className="flex flex-col gap-2 min-w-[160px]">
          <button
            onClick={() => onReschedule(booking)}
            className="btn-outline text-xs py-3 px-5 justify-center"
          >
            Reschedule
          </button>
          {onChangeService && (
            <button
              onClick={() => onChangeService(booking)}
              className="btn-outline text-xs py-3 px-5 justify-center"
            >
              Modify Service
            </button>
          )}
          <button
            onClick={handleCancelClick}
            className={`text-xs font-semibold tracking-widest uppercase border py-3 px-5 transition-all duration-200 ${
              confirming
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-red-600 border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600'
            }`}
          >
            {confirming ? 'Tap to Confirm' : 'Cancel'}
          </button>
          {confirming && (
            <button
              onClick={() => setConfirming(false)}
              className="text-xs text-tech-grey underline text-center mt-1"
            >
              Never mind
            </button>
          )}
        </div>
      )}
    </div>
  );
}