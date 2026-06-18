import { useState, useEffect } from 'react';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addMonths, subMonths, addDays, isBefore, isSameDay, isSameMonth,
} from 'date-fns';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const today = new Date();
today.setHours(0, 0, 0, 0);

export default function CalendarManager() {
  const [blockedDates, setBlockedDates] = useState([]); // array of { id, date, reason }
  const [viewMonth, setViewMonth] = useState(new Date());
  const [saving, setSaving] = useState(null); // date string being toggled

  const fetchBlocked = async () => {
    const data = await base44.entities.BlockedDate.list();
    setBlockedDates(data);
  };

  useEffect(() => {
    fetchBlocked();
  }, []);

  const blockedSet = new Set(blockedDates.map((b) => b.date?.slice(0, 10)));

  const toggleDate = async (dateStr) => {
    setSaving(dateStr);
    const existing = blockedDates.find((b) => b.date?.slice(0, 10) === dateStr);
    if (existing) {
      await base44.entities.BlockedDate.delete(existing.id);
    } else {
      await base44.entities.BlockedDate.create({ date: dateStr });
    }
    await fetchBlocked();
    setSaving(null);
  };

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);

  const weeks = [];
  let day = calStart;
  while (day <= calEnd) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(day));
      day = addDays(day, 1);
    }
    weeks.push(week);
  }

  const upcomingBlocked = blockedDates
    .filter((b) => !isBefore(new Date(b.date + 'T12:00:00'), today))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="grid md:grid-cols-2 gap-12">
      {/* Calendar */}
      <div>
        <p className="small-caps-label mb-2">Click a date to block or unblock it</p>
        <p className="text-tech-grey mb-6" style={{ fontSize: '0.82rem' }}>
          Blocked dates appear greyed out to customers in the booking form.
        </p>

        {/* Month navigator */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => setViewMonth(subMonths(viewMonth, 1))}
            className="p-2 hover:bg-secondary transition-colors"
            style={{ minHeight: 40, minWidth: 40 }}
          >
            <ChevronLeft size={16} className="text-ink-black" />
          </button>
          <p className="font-inter font-bold text-ink-black" style={{ fontSize: '0.9rem', letterSpacing: '-0.01em' }}>
            {format(viewMonth, 'MMMM yyyy')}
          </p>
          <button
            type="button"
            onClick={() => setViewMonth(addMonths(viewMonth, 1))}
            className="p-2 hover:bg-secondary transition-colors"
            style={{ minHeight: 40, minWidth: 40 }}
          >
            <ChevronRight size={16} className="text-ink-black" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="text-center font-mono text-tech-grey" style={{ fontSize: '0.6rem', letterSpacing: '0.1em', padding: '4px 0' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="border-t border-l border-border">
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7">
              {week.map((date, di) => {
                const dateStr = format(date, 'yyyy-MM-dd');
                const isPast = isBefore(date, today);
                const inMonth = isSameMonth(date, viewMonth);
                const isBlocked = blockedSet.has(dateStr);
                const isSaving = saving === dateStr;

                return (
                  <button
                    key={di}
                    type="button"
                    onClick={() => !isPast && toggleDate(dateStr)}
                    disabled={isPast || isSaving}
                    className="border-b border-r border-border aspect-square flex items-center justify-center transition-colors relative"
                    style={{
                      fontSize: '0.85rem',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      background: isSaving
                        ? '#F5F5F5'
                        : isBlocked
                        ? '#0A0A0A'
                        : 'transparent',
                      color: isSaving
                        ? '#CCCCCC'
                        : isBlocked
                        ? '#FFFFFF'
                        : isPast || !inMonth
                        ? '#CCCCCC'
                        : '#0A0A0A',
                      cursor: isPast ? 'not-allowed' : 'pointer',
                      minHeight: 44,
                    }}
                    aria-label={`${isBlocked ? 'Unblock' : 'Block'} ${format(date, 'MMMM d, yyyy')}`}
                    title={isBlocked ? 'Click to unblock' : 'Click to block'}
                  >
                    {isSaving ? (
                      <div className="w-3 h-3 border border-border border-t-tech-grey rounded-full animate-spin" />
                    ) : (
                      format(date, 'd')
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border border-border bg-white" />
            <span className="font-mono text-tech-grey" style={{ fontSize: '0.6rem', letterSpacing: '0.08em' }}>OPEN</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-ink-black" />
            <span className="font-mono text-tech-grey" style={{ fontSize: '0.6rem', letterSpacing: '0.08em' }}>BLOCKED</span>
          </div>
        </div>
      </div>

      {/* Blocked dates list */}
      <div>
        <p className="small-caps-label mb-6">Upcoming Blocked Dates ({upcomingBlocked.length})</p>
        {upcomingBlocked.length === 0 ? (
          <div className="border border-dashed border-border p-8 text-center">
            <p className="text-tech-grey" style={{ fontSize: '0.85rem' }}>No dates currently blocked.</p>
          </div>
        ) : (
          <div className="space-y-0 border-t border-border">
            {upcomingBlocked.map((b) => (
              <div key={b.id} className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-inter font-semibold text-ink-black" style={{ fontSize: '0.9rem' }}>
                    {format(new Date(b.date + 'T12:00:00'), 'EEEE, MMMM d, yyyy')}
                  </p>
                  {b.reason && (
                    <p className="text-tech-grey mt-0.5" style={{ fontSize: '0.78rem' }}>{b.reason}</p>
                  )}
                </div>
                <button
                  onClick={() => toggleDate(b.date.slice(0, 10))}
                  className="p-2 hover:bg-secondary transition-colors text-tech-grey hover:text-ink-black"
                  title="Unblock this date"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}