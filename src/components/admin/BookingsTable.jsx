import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { format } from 'date-fns';

const SERVICE_LABELS = {
  interior: 'Interior',
  exterior: 'Exterior / Paint',
  ceramic: 'Ceramic Coating',
  full: 'Full Detail',
  unsure: 'Needs Quote',
};

const STATUS_COLORS = {
  new: { bg: '#FFF7ED', color: '#C2410C', border: '#FED7AA' },
  confirmed: { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  completed: { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' },
  cancelled: { bg: '#FEF2F2', color: '#B91C1C', border: '#FECACA' },
};

function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || {};
  return (
    <span
      className="small-caps-label px-2 py-1"
      style={{ fontSize: '0.58rem', background: c.bg, color: c.color, border: `1px solid ${c.border}` }}
    >
      {status}
    </span>
  );
}

function BookingRow({ booking, onUpdateStatus }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr
        className="border-b border-border hover:bg-muted/40 cursor-pointer transition-colors"
        onClick={() => setOpen(!open)}
      >
        <td className="py-4 px-4">
          <p className="font-semibold text-ink-black text-sm">{booking.name}</p>
          <p className="text-tech-grey text-xs mt-0.5">{booking.phone}</p>
        </td>
        <td className="py-4 px-4 text-sm text-ink-black">
          {booking.year ? `${booking.year} ` : ''}{booking.vehicle}
        </td>
        <td className="py-4 px-4 text-sm text-ink-black">
          {SERVICE_LABELS[booking.service] || booking.service}
        </td>
        <td className="py-4 px-4 text-sm text-ink-black">
          <p>{booking.date}</p>
          <p className="text-tech-grey text-xs">{booking.time}</p>
        </td>
        <td className="py-4 px-4">
          <StatusBadge status={booking.status} />
        </td>
        <td className="py-4 px-4 text-tech-grey text-xs">
          {booking.created_date ? format(new Date(booking.created_date), 'MMM d, yyyy') : '—'}
        </td>
        <td className="py-4 px-4">
          <ChevronDown
            size={16}
            className="text-tech-grey transition-transform"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </td>
      </tr>

      {open && (
        <tr className="border-b border-border bg-muted/20">
          <td colSpan={7} className="px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Contact */}
              <div>
                <p className="small-caps-label mb-2">Contact</p>
                <p className="text-sm text-ink-black">{booking.name}</p>
                <p className="text-sm text-tech-grey">{booking.phone}</p>
                {booking.email && <p className="text-sm text-tech-grey">{booking.email}</p>}
              </div>

              {/* Add-Ons */}
              <div>
                <p className="small-caps-label mb-2">Add-Ons</p>
                {booking.add_ons && booking.add_ons.length > 0 ? (
                  <ul className="space-y-0.5">
                    {booking.add_ons.map((a, i) => (
                      <li key={i} className="text-sm text-ink-black">— {a}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-tech-grey">None</p>
                )}
                {booking.notes && (
                  <div className="mt-3">
                    <p className="small-caps-label mb-1">Notes</p>
                    <p className="text-sm text-tech-grey">{booking.notes}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div>
                <p className="small-caps-label mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {['confirmed', 'completed', 'cancelled'].map((s) => (
                    <button
                      key={s}
                      onClick={(e) => { e.stopPropagation(); onUpdateStatus(booking.id, s); }}
                      disabled={booking.status === s}
                      className="small-caps-label px-3 py-2 border transition-colors"
                      style={{
                        fontSize: '0.6rem',
                        background: booking.status === s ? '#0A0A0A' : 'transparent',
                        color: booking.status === s ? '#FFFFFF' : '#0A0A0A',
                        borderColor: '#0A0A0A',
                        opacity: booking.status === s ? 0.5 : 1,
                        cursor: booking.status === s ? 'default' : 'pointer',
                      }}
                    >
                      Mark {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function BookingsTable({ bookings, onUpdateStatus }) {
  return (
    <div className="border border-border overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            {['Customer', 'Vehicle', 'Service', 'Appointment', 'Status', 'Submitted', ''].map((h) => (
              <th key={h} className="py-3 px-4 text-left small-caps-label text-tech-grey" style={{ fontSize: '0.6rem' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <BookingRow key={b.id} booking={b} onUpdateStatus={onUpdateStatus} />
          ))}
        </tbody>
      </table>
    </div>
  );
}