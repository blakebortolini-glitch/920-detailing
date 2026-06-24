import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addMonths, subMonths, addDays, isBefore, isSameDay, isSameMonth,
} from 'date-fns';
import { base44 } from '@/api/base44Client';

const today = new Date();
today.setHours(0, 0, 0, 0);

export default function CalendarPicker({ selectedDate, onDateChange }) {
  const [blockedSet, setBlockedSet] = useState(new Set());
  const [bookedMap, setBookedMap] = useState({}); // { 'yyyy-MM-dd': { name, time } }

  useEffect(() => {
    Promise.all([
      base44.entities.Booking.filter({ status: 'confirmed' }),
      base44.entities.BlockedDate.list(),
    ]).then(([bookings, blocked]) => {
      setBlockedSet(new Set(blocked.map((b) => b.date?.slice(0, 10)).filter(Boolean)));
      const map = {};
      bookings.forEach((b) => {
        const raw = b.date || b.data?.date;
        if (!raw) return;
        const d = raw.slice(0, 10);
        if (d) map[d] = { name: b.name, time: b.time };
      });
      setBookedMap(map);
    });
  }, []);

  // May 2026: only Sat/Sun open; Jun–Aug 2026: Mon–Sun open; all other months: Mon–Sat open, Sun closed
  const isDisabled = (date) => {
    if (isBefore(date, today)) return true;
    const dateStr = format(date, 'yyyy-MM-dd');
    if (blockedSet.has(dateStr)) return true;
    if (bookedMap[dateStr]) return true;
    const year = date.getFullYear();
    const month = date.getMonth();
    const isMay2026 = year === 2026 && month === 4;
    const isJunToAug2026 = year === 2026 && month >= 5 && month <= 7;
    if (isMay2026) return date.getDay() !== 0 && date.getDay() !== 6;
    if (isJunToAug2026) return false; // all days open
    return date.getDay() === 0;
  };
  const [viewMonth, setViewMonth] = useState(selectedDate ? new Date(selectedDate + 'T12:00:00') : new Date());

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);

  // Build weeks array
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

  const handleDayClick = (date) => {
    if (isDisabled(date)) return;
    onDateChange(format(date, 'yyyy-MM-dd'));
  };

  const parsedSelected = selectedDate ? new Date(selectedDate + 'T12:00:00') : null;

  return (
    <div>
      {/* Month navigator */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setViewMonth(subMonths(viewMonth, 1))}
          className="p-2 hover:bg-secondary transition-colors"
          style={{ minHeight: 40, minWidth: 40 }}
          aria-label="Previous month"
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
          aria-label="Next month"
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

      {/* Calendar grid */}
      <div className="border-t border-l border-border">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((date, di) => {
              const disabled = isDisabled(date);
              const isSelected = parsedSelected && isSameDay(date, parsedSelected);
              const isToday = isSameDay(date, today);
              const inMonth = isSameMonth(date, viewMonth);
              const dateStr = format(date, 'yyyy-MM-dd');
              const isBlocked = blockedSet.has(dateStr);
              const isBooked = !!bookedMap[dateStr];
              const booking = bookedMap[dateStr];

              return (
                <button
                  key={di}
                  type="button"
                  onClick={() => handleDayClick(date)}
                  disabled={disabled}
                  className="border-b border-r border-border aspect-square flex flex-col items-center justify-center transition-colors relative"
                  style={{
                    fontSize: '0.85rem',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: isSelected ? 700 : 400,
                    background: isSelected
                      ? 'hsl(214, 89%, 52%)'
                      : isBlocked
                      ? '#0A0A0A'
                      : isBooked
                      ? 'hsl(214, 89%, 97%)'
                      : 'transparent',
                    color: isSelected
                      ? '#FFFFFF'
                      : isBlocked
                      ? '#FFFFFF'
                      : disabled
                      ? '#CCCCCC'
                      : !inMonth
                      ? '#CCCCCC'
                      : isToday
                      ? 'hsl(214, 89%, 52%)'
                      : '#0A0A0A',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    minHeight: 44,
                  }}
                  aria-label={format(date, 'MMMM d, yyyy')}
                  aria-pressed={isSelected}
                  title={isBlocked ? 'Unavailable' : isBooked ? `Booked: ${booking.name || ''} ${booking.time || ''}` : ''}
                >
                  <span>{format(date, 'd')}</span>
                  {isBooked && !isBlocked && !isSelected && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full" style={{ background: 'hsl(214, 89%, 52%)' }} />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border border-border bg-white" />
          <span className="font-mono text-tech-grey" style={{ fontSize: '0.6rem', letterSpacing: '0.08em' }}>OPEN</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-ink-black" />
          <span className="font-mono text-tech-grey" style={{ fontSize: '0.6rem', letterSpacing: '0.08em' }}>BLOCKED</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 relative border border-border" style={{ background: 'hsl(214, 89%, 97%)' }}>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ background: 'hsl(214, 89%, 52%)' }} />
          </div>
          <span className="font-mono text-tech-grey" style={{ fontSize: '0.6rem', letterSpacing: '0.08em' }}>BOOKED</span>
        </div>
      </div>

      {/* Confirmation of selected date */}
      {selectedDate && (
        <div className="mt-4 p-3 border border-ink-black bg-secondary">
          <p className="small-caps-label text-ink-black">
            Selected — {parsedSelected ? format(parsedSelected, 'EEEE, MMMM d, yyyy') : ''}
          </p>
        </div>
      )}
    </div>
  );
}