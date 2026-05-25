import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format } from 'date-fns';

const SERVICE_LABELS = {
  interior: 'Interior',
  exterior: 'Exterior / Paint',
  ceramic: 'Ceramic Coating',
  full: 'Full Detail',
  unsure: 'Needs Quote',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const BAR_COLOR = '#0A0A0A';

export default function RevenueTab({ bookings }) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const completedBookings = useMemo(
    () => bookings.filter((b) => b.status === 'completed' && b.total_price > 0),
    [bookings]
  );

  const years = useMemo(() => {
    const set = new Set(completedBookings.map((b) => new Date(b.date).getFullYear()));
    set.add(currentYear);
    return Array.from(set).sort((a, b) => b - a);
  }, [completedBookings, currentYear]);

  const yearBookings = useMemo(
    () => completedBookings.filter((b) => new Date(b.date).getFullYear() === selectedYear),
    [completedBookings, selectedYear]
  );

  // Monthly revenue data
  const monthlyData = useMemo(() => {
    const map = Array.from({ length: 12 }, (_, i) => ({ month: MONTHS[i], revenue: 0, count: 0 }));
    for (const b of yearBookings) {
      const m = new Date(b.date).getMonth();
      map[m].revenue += b.total_price;
      map[m].count += 1;
    }
    return map;
  }, [yearBookings]);

  // Service type breakdown
  const serviceBreakdown = useMemo(() => {
    const map = {};
    for (const b of yearBookings) {
      const key = b.service || 'unsure';
      if (!map[key]) map[key] = { label: SERVICE_LABELS[key] || key, revenue: 0, count: 0 };
      map[key].revenue += b.total_price;
      map[key].count += 1;
    }
    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  }, [yearBookings]);

  // Add-on breakdown
  const addOnBreakdown = useMemo(() => {
    const map = {};
    for (const b of yearBookings) {
      if (b.add_ons && b.add_ons.length > 0) {
        for (const addon of b.add_ons) {
          if (!map[addon]) map[addon] = { label: addon, count: 0 };
          map[addon].count += 1;
        }
      }
    }
    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [yearBookings]);

  const totalRevenue = yearBookings.reduce((s, b) => s + b.total_price, 0);
  const avgJob = yearBookings.length > 0 ? totalRevenue / yearBookings.length : 0;
  const bestMonth = monthlyData.reduce((best, m) => (m.revenue > best.revenue ? m : best), monthlyData[0]);

  return (
    <div className="space-y-10">
      {/* Year Selector */}
      <div className="flex items-center gap-2">
        {years.map((y) => (
          <button
            key={y}
            onClick={() => setSelectedYear(y)}
            className="small-caps-label px-4 py-2 border transition-colors"
            style={{
              fontSize: '0.6rem',
              background: selectedYear === y ? '#0A0A0A' : 'transparent',
              color: selectedYear === y ? '#FFFFFF' : '#767676',
              borderColor: selectedYear === y ? '#0A0A0A' : '#E8E8E8',
            }}
          >
            {y}
          </button>
        ))}
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-l border-border">
        {[
          { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}` },
          { label: 'Jobs Completed', value: yearBookings.length },
          { label: 'Avg. Per Job', value: `$${avgJob.toFixed(0)}` },
          { label: 'Best Month', value: bestMonth.revenue > 0 ? `${bestMonth.month} ($${bestMonth.revenue.toLocaleString()})` : '—' },
        ].map((stat) => (
          <div key={stat.label} className="border-b border-r border-border p-6">
            <p className="small-caps-label text-tech-grey mb-1">{stat.label}</p>
            <p className="font-inter font-black text-ink-black text-2xl" style={{ letterSpacing: '-0.03em' }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Monthly Revenue Chart */}
      <div>
        <p className="small-caps-label text-tech-grey mb-4">Monthly Revenue — {selectedYear}</p>
        <div className="border border-border p-6" style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} barSize={28}>
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono', fill: '#767676' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono', fill: '#767676' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']}
                contentStyle={{ fontFamily: 'IBM Plex Mono', fontSize: 11, border: '1px solid #E8E8E8' }}
              />
              <Bar dataKey="revenue" fill={BAR_COLOR} radius={0} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Service + Add-On Breakdown Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Service Breakdown */}
        <div>
          <p className="small-caps-label text-tech-grey mb-4">Revenue by Service Type</p>
          <div className="border border-border">
            {serviceBreakdown.length === 0 ? (
              <p className="text-sm text-tech-grey p-6">No data yet</p>
            ) : (
              serviceBreakdown.map((s, i) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between px-5 py-4 border-b border-border last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-semibold text-ink-black">{s.label}</p>
                    <p className="text-xs text-tech-grey mt-0.5">{s.count} job{s.count !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-semibold text-ink-black">${s.revenue.toLocaleString()}</p>
                    {totalRevenue > 0 && (
                      <p className="text-xs text-tech-grey mt-0.5">{((s.revenue / totalRevenue) * 100).toFixed(0)}%</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add-On Breakdown */}
        <div>
          <p className="small-caps-label text-tech-grey mb-4">Add-On Usage</p>
          <div className="border border-border">
            {addOnBreakdown.length === 0 ? (
              <p className="text-sm text-tech-grey p-6">No add-ons recorded yet</p>
            ) : (
              addOnBreakdown.map((a) => (
                <div
                  key={a.label}
                  className="flex items-center justify-between px-5 py-4 border-b border-border last:border-b-0"
                >
                  <p className="text-sm text-ink-black">{a.label}</p>
                  <p className="font-mono text-sm font-semibold text-ink-black">{a.count}×</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}