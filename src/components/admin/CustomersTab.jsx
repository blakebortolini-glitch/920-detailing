import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { format } from 'date-fns';

const SERVICE_LABELS = {
  interior: 'Interior',
  exterior: 'Exterior / Paint',
  ceramic: 'Ceramic Coating',
  full: 'Full Detail',
  unsure: 'Needs Quote',
};



function CustomerRow({ customer }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr
        className="border-b border-border hover:bg-muted/40 cursor-pointer transition-colors"
        onClick={() => setOpen(!open)}
      >
        <td className="py-4 px-4">
          <p className="font-semibold text-ink-black text-sm">{customer.name}</p>
          <p className="text-tech-grey text-xs mt-0.5">{customer.phone}</p>
          {customer.email && <p className="text-tech-grey text-xs">{customer.email}</p>}
        </td>
        <td className="py-4 px-4 text-sm text-ink-black text-center">
          {customer.totalBookings}
        </td>
        <td className="py-4 px-4 text-sm text-ink-black text-center">
          {customer.completedBookings}
        </td>
        <td className="py-4 px-4 text-sm font-semibold text-ink-black text-center">
          {customer.lifetimeValue > 0 ? `$${customer.lifetimeValue.toLocaleString()}` : <span className="text-tech-grey text-xs">—</span>}
        </td>
        <td className="py-4 px-4 text-xs text-tech-grey">
          {customer.lastBookingDate
            ? format(new Date(customer.lastBookingDate), 'MMM d, yyyy')
            : '—'}
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
          <td colSpan={6} className="px-6 py-5">
            <p className="small-caps-label mb-3">Booking History</p>
            <div className="space-y-2">
              {customer.bookings.map((b) => (
                <div
                  key={b.id}
                  className="flex items-start justify-between border border-border p-3 bg-white"
                >
                  <div>
                    <p className="text-sm text-ink-black font-medium">
                      {SERVICE_LABELS[b.service] || b.service}
                      {b.year ? ` — ${b.year} ${b.vehicle}` : ` — ${b.vehicle}`}
                    </p>
                    {b.add_ons && b.add_ons.length > 0 && (
                      <p className="text-xs text-tech-grey mt-0.5">Add-ons: {b.add_ons.join(', ')}</p>
                    )}
                    {b.notes && (
                      <p className="text-xs text-tech-grey mt-0.5 italic">"{b.notes}"</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-xs text-ink-black">{b.date?.split('T')[0]} @ {b.time}</p>
                    {b.total_price > 0 && (
                      <p className="font-mono text-sm font-semibold text-ink-black mt-0.5">${b.total_price.toLocaleString()}</p>
                    )}
                    <span
                      className="small-caps-label px-2 py-0.5 mt-1 inline-block"
                      style={{
                        fontSize: '0.55rem',
                        background: b.status === 'completed' ? '#F0FDF4' : b.status === 'confirmed' ? '#EFF6FF' : b.status === 'cancelled' ? '#FEF2F2' : '#FFF7ED',
                        color: b.status === 'completed' ? '#15803D' : b.status === 'confirmed' ? '#1D4ED8' : b.status === 'cancelled' ? '#B91C1C' : '#C2410C',
                      }}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function CustomersTab({ bookings }) {
  const [search, setSearch] = useState('');

  const customers = useMemo(() => {
    const map = {};
    for (const b of bookings) {
      const key = b.phone?.replace(/\D/g, '') || b.name;
      if (!map[key]) {
        map[key] = {
          phone: b.phone,
          name: b.name,
          email: b.email || null,
          bookings: [],
          lifetimeValue: 0,
          totalBookings: 0,
          completedBookings: 0,
          lastBookingDate: null,
        };
      }
      const c = map[key];
      c.bookings.push(b);
      c.totalBookings++;
      if (b.status === 'completed') {
        c.completedBookings++;
        if (b.total_price > 0) c.lifetimeValue += b.total_price;
      }
      if (!c.lastBookingDate || new Date(b.date) > new Date(c.lastBookingDate)) {
        c.lastBookingDate = b.date;
        // Use the most recent name/email
        c.name = b.name;
        if (b.email) c.email = b.email;
      }
    }
    return Object.values(map).sort((a, b) => b.totalBookings - a.totalBookings);
  }, [bookings]);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      !q ||
      c.name?.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      c.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, phone, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-underline"
          style={{ maxWidth: 400 }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-0 border-t border-l border-border mb-8">
        {[
          { label: 'Total Customers', value: customers.length },
          { label: 'Repeat Customers', value: customers.filter((c) => c.totalBookings > 1).length },
          { label: 'Actual Lifetime Revenue', value: `$${customers.reduce((s, c) => s + c.lifetimeValue, 0).toLocaleString()}` },
        ].map((stat) => (
          <div key={stat.label} className="border-b border-r border-border p-6">
            <p className="small-caps-label text-tech-grey mb-1">{stat.label}</p>
            <p className="font-inter font-black text-ink-black text-2xl" style={{ letterSpacing: '-0.03em' }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="border border-border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {['Customer', 'Total Bookings', 'Completed', 'Actual LTV', 'Last Booking', ''].map((h) => (
                <th
                  key={h}
                  className="py-3 px-4 text-left small-caps-label text-tech-grey"
                  style={{ fontSize: '0.6rem' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-tech-grey small-caps-label">
                  No customers found
                </td>
              </tr>
            ) : (
              filtered.map((c) => <CustomerRow key={c.phone || c.name} customer={c} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}