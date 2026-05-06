import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addMonths, subMonths, addDays, isBefore, isSameDay, isSameMonth,
} from 'date-fns';

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
];

const today = new Date();
today.setHours(0, 0, 0, 0);

// Fully booked dates (yyyy-MM-dd)
const BOOKED_DATES = new Set([
  '2026-05-09', '2026-05-10', '2026-05-16', '2026-05-17', '2026-05-23', '2026-05-24',
]);

// May 2026: only Sat/Sun open; all other months: Mon–Sat open, Sun closed
const isDisabled = (date) => {
  if (isBefore(date, today)) return true;
  if (BOOKED_DATES.has(format(date, 'yyyy-MM-dd'))) return true;
  const isMay2026 = date.getFullYear() === 2026 && date.getMonth() === 4;
  if (isMay2026) return date.getDay() !== 0 && date.getDay() !== 6;
  return date.getDay() === 0;
};

export default function CalendarPicker({ selectedDate, selectedTime, onDateChange, onTimeChange }) {
  const [viewMonth, setViewMonth] = useState(selectedDate ? new Date(selectedDate) : new Date());

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
    onTimeChange(''); // reset time when date changes
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

              return (
                <button
                  key={di}
                  type="button"
                  onClick={() => handleDayClick(date)}
                  disabled={disabled}
                  className="border-b border-r border-border aspect-square flex items-center justify-center transition-colors"
                  style={{
                    fontSize: '0.85rem',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: isSelected ? 700 : 400,
                    background: isSelected ? 'hsl(214, 89%, 52%)' : 'transparent',
                    color: isSelected
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
                >
                  {format(date, 'd')}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Time slot picker — shown after date is selected */}
      {selectedDate && (
        <div className="mt-6">
          <p className="small-caps-label mb-3">
            Available Times — {parsedSelected ? format(parsedSelected, 'EEEE, MMMM d') : ''}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => onTimeChange(slot)}
                className="py-3 px-2 border text-center transition-colors"
                style={{
                  fontSize: '0.78rem',
                  fontFamily: 'IBM Plex Mono, monospace',
                  letterSpacing: '0.06em',
                  borderColor: selectedTime === slot ? '#0A0A0A' : 'hsl(var(--border))',
                  background: selectedTime === slot ? '#0A0A0A' : '#FFFFFF',
                  color: selectedTime === slot ? '#FFFFFF' : '#0A0A0A',
                  minHeight: 44,
                }}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}