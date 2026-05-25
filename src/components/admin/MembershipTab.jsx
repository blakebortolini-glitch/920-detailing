import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { format, differenceInDays } from 'date-fns';
import { AlertTriangle } from 'lucide-react';

export default function MembershipTab() {
  const [memberships, setMemberships] = useState([]);
  const [flaggedBookings, setFlaggedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customer_email: '', customer_name: '', customer_phone: '', eligibility_start_date: '', status: 'active', notes: '' });
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const [m, b] = await Promise.all([
      base44.entities.Membership.list('-eligibility_start_date', 100),
      base44.entities.Booking.filter({ membership_flagged: true }, '-created_date', 50),
    ]);
    setMemberships(m);
    setFlaggedBookings(b);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.Membership.create(form);
    setShowForm(false);
    setForm({ customer_email: '', customer_name: '', customer_phone: '', eligibility_start_date: '', status: 'active', notes: '' });
    await fetchAll();
    setSaving(false);
  };

  const toggleStatus = async (m) => {
    const newStatus = m.status === 'active' ? 'expired' : 'active';
    await base44.entities.Membership.update(m.id, { status: newStatus });
    setMemberships((prev) => prev.map((x) => x.id === m.id ? { ...x, status: newStatus } : x));
  };

  const getDaysLeft = (startDate) => {
    const start = new Date(startDate);
    const today = new Date();
    const diff = 30 - differenceInDays(today, start);
    return diff;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-border border-t-ink-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12">

      {/* Flagged Bookings */}
      {flaggedBookings.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-amber-600" />
            <p className="small-caps-label text-amber-600" style={{ fontSize: '0.65rem' }}>
              Flagged Maintenance Bookings — Outside 30-Day Window
            </p>
          </div>
          <div className="border border-amber-200 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-amber-200 bg-amber-50">
                  {['Customer', 'Email', 'Vehicle', 'Date Booked', 'Membership Status'].map((h) => (
                    <th key={h} className="py-3 px-4 text-left small-caps-label text-amber-700" style={{ fontSize: '0.58rem' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {flaggedBookings.map((b) => {
                  const membership = memberships.find((m) => m.customer_email === b.email);
                  return (
                    <tr key={b.id} className="border-b border-amber-100 bg-amber-50/40">
                      <td className="py-3 px-4 text-sm font-semibold text-ink-black">{b.name}</td>
                      <td className="py-3 px-4 text-sm text-tech-grey">{b.email || '—'}</td>
                      <td className="py-3 px-4 text-sm text-ink-black">{b.year ? `${b.year} ` : ''}{b.vehicle}</td>
                      <td className="py-3 px-4 text-sm text-ink-black">{b.date}</td>
                      <td className="py-3 px-4">
                        {membership ? (
                          <span className="small-caps-label px-2 py-1" style={{ fontSize: '0.58rem', background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A' }}>
                            Eligible from {membership.eligibility_start_date}
                          </span>
                        ) : (
                          <span className="small-caps-label px-2 py-1" style={{ fontSize: '0.58rem', background: '#FEE2E2', color: '#B91C1C', border: '1px solid #FECACA' }}>
                            No Membership Found
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Memberships List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="small-caps-label" style={{ fontSize: '0.65rem' }}>Active Memberships</p>
          <button
            onClick={() => setShowForm(!showForm)}
            className="small-caps-label px-4 py-2 border transition-colors"
            style={{ fontSize: '0.6rem', background: showForm ? '#0A0A0A' : 'transparent', color: showForm ? '#FFF' : '#0A0A0A', borderColor: '#0A0A0A' }}
          >
            {showForm ? 'Cancel' : '+ Add Membership'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="border border-border p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="small-caps-label block mb-1" style={{ fontSize: '0.58rem' }}>Customer Name *</label>
              <input value={form.customer_name} onChange={(e) => setForm(f => ({ ...f, customer_name: e.target.value }))} className="input-underline text-sm" placeholder="Full name" required />
            </div>
            <div>
              <label className="small-caps-label block mb-1" style={{ fontSize: '0.58rem' }}>Email *</label>
              <input value={form.customer_email} onChange={(e) => setForm(f => ({ ...f, customer_email: e.target.value }))} className="input-underline text-sm" placeholder="customer@email.com" required />
            </div>
            <div>
              <label className="small-caps-label block mb-1" style={{ fontSize: '0.58rem' }}>Phone</label>
              <input value={form.customer_phone} onChange={(e) => setForm(f => ({ ...f, customer_phone: e.target.value }))} className="input-underline text-sm" placeholder="(920) —" />
            </div>
            <div>
              <label className="small-caps-label block mb-1" style={{ fontSize: '0.58rem' }}>Eligibility Start Date *</label>
              <input type="date" value={form.eligibility_start_date} onChange={(e) => setForm(f => ({ ...f, eligibility_start_date: e.target.value }))} className="input-underline text-sm" required />
            </div>
            <div className="md:col-span-2">
              <label className="small-caps-label block mb-1" style={{ fontSize: '0.58rem' }}>Notes</label>
              <input value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} className="input-underline text-sm" placeholder="e.g. Qualifying booking ID, service date" />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '12px 32px', fontSize: '0.75rem' }}>
                {saving ? 'Saving…' : 'Create Membership'}
              </button>
            </div>
          </form>
        )}

        {memberships.length === 0 ? (
          <div className="text-center py-16 border border-border">
            <p className="small-caps-label text-tech-grey">No memberships yet</p>
          </div>
        ) : (
          <div className="border border-border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Customer', 'Email', 'Phone', 'Eligibility Start', 'Days Left', 'Status', ''].map((h) => (
                    <th key={h} className="py-3 px-4 text-left small-caps-label text-tech-grey" style={{ fontSize: '0.6rem' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {memberships.map((m) => {
                  const daysLeft = getDaysLeft(m.eligibility_start_date);
                  const isWithinWindow = daysLeft > 0;
                  return (
                    <tr key={m.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-4 text-sm font-semibold text-ink-black">{m.customer_name}</td>
                      <td className="py-4 px-4 text-sm text-tech-grey">{m.customer_email}</td>
                      <td className="py-4 px-4 text-sm text-tech-grey">{m.customer_phone || '—'}</td>
                      <td className="py-4 px-4 text-sm text-ink-black">{m.eligibility_start_date}</td>
                      <td className="py-4 px-4">
                        {isWithinWindow ? (
                          <span className="font-mono text-xs" style={{ color: '#15803D' }}>{daysLeft}d remaining</span>
                        ) : (
                          <span className="font-mono text-xs text-tech-grey">Expired {Math.abs(daysLeft)}d ago</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className="small-caps-label px-2 py-1"
                          style={{
                            fontSize: '0.58rem',
                            background: m.status === 'active' ? '#F0FDF4' : '#F3F4F6',
                            color: m.status === 'active' ? '#15803D' : '#767676',
                            border: `1px solid ${m.status === 'active' ? '#BBF7D0' : '#E5E7EB'}`,
                          }}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => toggleStatus(m)}
                          className="small-caps-label px-2 py-1 border transition-colors"
                          style={{ fontSize: '0.55rem', borderColor: '#E5E7EB', color: '#767676' }}
                        >
                          {m.status === 'active' ? 'Expire' : 'Reactivate'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}