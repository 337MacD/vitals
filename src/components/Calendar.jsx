import { useState } from 'react';
import { getMonthDays, sameDay, MONTH_NAMES, DAY_ABBR, fmt } from '../helpers';
import { getSessionForDate, getPhase, PHASES } from '../data/cycling';

export default function CalendarModal({ selectedDate, onSelect, onClose, exercises }) {
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth());
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());
  const today = new Date();
  const days = getMonthDays(viewYear, viewMonth);

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); } else setViewMonth(viewMonth - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); } else setViewMonth(viewMonth + 1); };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <button className="btn-icon" onClick={prevMonth}>‹</button>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{MONTH_NAMES[viewMonth]} {viewYear}</span>
          <button className="btn-icon" onClick={nextMonth}>›</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 6 }}>
          {DAY_ABBR.map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.25)', fontWeight: 600, padding: 4 }}>{d}</div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
          {days.map((day, i) => {
            if (!day) return <div key={`e${i}`} />;
            const isSelected = sameDay(day, selectedDate);
            const isToday = sameDay(day, today);
            const session = getSessionForDate(day);
            const dateKey = fmt(day);
            const hasExtra = exercises.some(e => e.date === dateKey);
            const phase = session ? getPhase(session.week) : null;
            const isPast = day < today && !isToday;

            return (
              <button key={i} onClick={() => { onSelect(day); onClose(); }} style={{
                width: '100%', aspectRatio: '1', borderRadius: 12, cursor: 'pointer',
                background: isSelected ? 'rgba(129,140,248,0.2)' : 'transparent',
                border: isSelected ? '1.5px solid rgba(129,140,248,0.4)' : isToday ? '1.5px solid rgba(255,255,255,0.2)' : '1px solid transparent',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2
              }}>
                <span style={{
                  fontSize: 14, fontWeight: isToday ? 700 : 400,
                  color: isSelected ? '#818cf8' : isPast ? 'rgba(255,255,255,0.3)' : '#fff'
                }}>{day.getDate()}</span>
                <div style={{ display: 'flex', gap: 2 }}>
                  {session && <div style={{ width: 4, height: 4, borderRadius: '50%', background: phase.color, opacity: isPast ? 0.4 : 1 }} />}
                  {hasExtra && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#c084fc', opacity: isPast ? 0.4 : 1 }} />}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 14, flexWrap: 'wrap' }}>
          {Object.entries(PHASES).map(([id, p]) => (
            <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: p.color }} />
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>{p.name}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#c084fc' }} />
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>Other exercise</span>
          </div>
        </div>
      </div>
    </div>
  );
}
