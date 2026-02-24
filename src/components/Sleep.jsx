import { useState, useEffect } from 'react';
import { fmt, addDays, sameDay, calcSleepDuration, QUALITY_LABELS } from '../helpers';
import { saveSleepEntry, getSleepRange } from '../db';

export default function Sleep({ sleepEntry, selectedDate, reload }) {
  const dateKey = fmt(selectedDate);
  const [bedtime, setBedtime] = useState('');
  const [waketime, setWaketime] = useState('');
  const [quality, setQuality] = useState(null);
  const [interruptions, setInterruptions] = useState('');
  const [notes, setNotes] = useState('');
  const [weekSleep, setWeekSleep] = useState([]);
  const [saved, setSaved] = useState(false);

  // Load existing entry
  useEffect(() => {
    if (sleepEntry) {
      setBedtime(sleepEntry.bedtime || '');
      setWaketime(sleepEntry.waketime || '');
      setQuality(sleepEntry.quality || null);
      setInterruptions(sleepEntry.interruptions ?? '');
      setNotes(sleepEntry.notes || '');
    } else {
      setBedtime(''); setWaketime(''); setQuality(null); setInterruptions(''); setNotes('');
    }
    setSaved(false);
  }, [dateKey, sleepEntry]);

  // Load week data
  useEffect(() => {
    const start = fmt(addDays(selectedDate, -6));
    const end = fmt(selectedDate);
    getSleepRange(start, end).then(entries => {
      const map = {};
      entries.forEach(e => { map[e.date] = e; });
      const week = Array.from({ length: 7 }, (_, i) => {
        const d = addDays(selectedDate, i - 6);
        const dk = fmt(d);
        const s = map[dk];
        return { day: ['S','M','T','W','T','F','S'][d.getDay()], sleep: s, dur: s ? calcSleepDuration(s.bedtime, s.waketime) : null, isCurrent: sameDay(d, selectedDate) };
      });
      setWeekSleep(week);
    });
  }, [dateKey, saved]);

  const dur = calcSleepDuration(bedtime, waketime);

  const handleSave = async () => {
    if (!bedtime || !waketime || !quality) return;
    await saveSleepEntry(dateKey, bedtime, waketime, quality, parseInt(interruptions) || 0, notes);
    setSaved(true);
    reload();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 100 }}>
      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>Sleep Log</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
          Night of {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </div>

      {dur && (
        <div style={{ textAlign: 'center' }}>
          <span className="mono" style={{ fontSize: 44, fontWeight: 700, color: '#a78bfa' }}>{dur.hours}</span>
          <span className="mono" style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)' }}>h </span>
          <span className="mono" style={{ fontSize: 44, fontWeight: 700, color: '#a78bfa' }}>{dur.minutes}</span>
          <span className="mono" style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)' }}>m</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div className="label-xs" style={{ marginBottom: 6, paddingLeft: 4 }}>Bedtime</div>
          <input type="time" value={bedtime} onChange={e => setBedtime(e.target.value)}
            className="input mono" style={{ fontSize: 18, colorScheme: 'dark' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="label-xs" style={{ marginBottom: 6, paddingLeft: 4 }}>Wake time</div>
          <input type="time" value={waketime} onChange={e => setWaketime(e.target.value)}
            className="input mono" style={{ fontSize: 18, colorScheme: 'dark' }} />
        </div>
      </div>

      <div>
        <div className="label-xs" style={{ marginBottom: 10, paddingLeft: 4 }}>Sleep Quality</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
          {QUALITY_LABELS.map(q => (
            <button key={q.level} onClick={() => setQuality(q.level)} style={{
              width: 56, height: 70, borderRadius: 14, cursor: 'pointer',
              background: quality === q.level ? `${q.color}18` : 'rgba(255,255,255,0.03)',
              border: quality === q.level ? `2px solid ${q.color}55` : '1px solid rgba(255,255,255,0.06)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
              transform: quality === q.level ? 'scale(1.08)' : 'scale(1)', transition: 'all 0.2s'
            }}>
              <span style={{ fontSize: 22 }}>{q.icon}</span>
              <span style={{ fontSize: 9, fontWeight: 600, color: quality === q.level ? q.color : 'rgba(255,255,255,0.3)' }}>{q.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="label-xs" style={{ marginBottom: 6, paddingLeft: 4 }}>Wake-ups</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[0, 1, 2, 3, '4+'].map((n, i) => {
            const val = typeof n === 'number' ? n : 4;
            return (
              <button key={i} onClick={() => setInterruptions(val)} style={{
                flex: 1, padding: '10px 0', borderRadius: 10, cursor: 'pointer',
                background: interruptions === val ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.03)',
                border: interruptions === val ? '1.5px solid rgba(139,92,246,0.3)' : '1px solid rgba(255,255,255,0.06)',
                color: interruptions === val ? '#a78bfa' : 'rgba(255,255,255,0.4)',
                fontSize: 15, fontWeight: 600, fontFamily: "'DM Mono', monospace"
              }}>{n}</button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="label-xs" style={{ marginBottom: 6, paddingLeft: 4 }}>Notes</div>
        <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional..." className="input" />
      </div>

      {weekSleep.length > 0 && (
        <div>
          <div className="label-xs" style={{ marginBottom: 10, paddingLeft: 4 }}>Last 7 nights</div>
          <div className="card" style={{ padding: '14px 10px', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end' }}>
            {weekSleep.map((d, i) => {
              const barH = d.dur ? Math.min((d.dur.total / 600) * 50, 50) : 6;
              const barColor = d.sleep ? QUALITY_LABELS[d.sleep.quality - 1].color : 'rgba(255,255,255,0.06)';
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  {d.dur && <span className="mono" style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{d.dur.hours}h</span>}
                  <div style={{ width: 12, height: barH, background: barColor, borderRadius: 4, opacity: d.isCurrent ? 1 : 0.6 }} />
                  <span style={{ fontSize: 10, color: d.isCurrent ? '#a78bfa' : 'rgba(255,255,255,0.3)', fontWeight: d.isCurrent ? 700 : 400 }}>{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button onClick={handleSave} className={`btn-full ${(bedtime && waketime && quality) ? '' : 'btn-disabled'}`}
        style={{ background: (bedtime && waketime && quality) ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)' : undefined }}>
        {saved ? '✓ Saved' : 'Save Sleep Log'}
      </button>
    </div>
  );
}
