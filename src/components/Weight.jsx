import { useState, useEffect } from 'react';
import { fmt, addDays } from '../helpers';
import { saveWeightEntry, getAllWeightEntries, getSetting, setSetting } from '../db';

function TrendChart({ entries, unit }) {
  if (entries.length < 2) return null;

  const recent = entries.slice(-30);
  const weights = recent.map(e => e.weight);
  const min = Math.min(...weights) - 2;
  const max = Math.max(...weights) + 2;
  const range = max - min || 1;

  const W = 320, H = 140, padX = 40, padY = 20;
  const plotW = W - padX - 10;
  const plotH = H - padY * 2;

  const toX = (i) => padX + (i / (recent.length - 1)) * plotW;
  const toY = (w) => padY + plotH - ((w - min) / range) * plotH;

  const rawPath = recent.map((e, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(e.weight).toFixed(1)}`).join(' ');

  const ma = [];
  for (let i = 0; i < recent.length; i++) {
    const window = recent.slice(Math.max(0, i - 6), i + 1);
    ma.push(window.reduce((s, e) => s + e.weight, 0) / window.length);
  }
  const maPath = ma.map((w, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(w).toFixed(1)}`).join(' ');

  const steps = 4;
  const yLabels = Array.from({ length: steps + 1 }, (_, i) => min + (range / steps) * i);

  const first = recent[0].weight;
  const last = recent[recent.length - 1].weight;
  const delta = last - first;
  const deltaColor = delta < 0 ? '#4ade80' : delta > 0 ? '#fb923c' : 'rgba(255,255,255,0.4)';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, padding: '0 4px' }}>
        <span className="label-xs" style={{ fontWeight: 600 }}>Trend ({recent.length} entries)</span>
        <span className="mono" style={{ fontSize: 12, color: deltaColor, fontWeight: 600 }}>
          {delta > 0 ? '+' : ''}{delta.toFixed(1)} {unit}
        </span>
      </div>
      <div className="card" style={{ padding: '12px 8px', overflow: 'hidden' }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
          {yLabels.map((v, i) => (
            <g key={i}>
              <line x1={padX} x2={W - 10} y1={toY(v)} y2={toY(v)} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              <text x={padX - 6} y={toY(v) + 3} textAnchor="end" fill="rgba(255,255,255,0.25)" fontSize="9" fontFamily="DM Mono, monospace">
                {v.toFixed(0)}
              </text>
            </g>
          ))}

          <path d={`${maPath} L${toX(recent.length - 1)},${H - padY} L${toX(0)},${H - padY} Z`}
            fill="url(#areaGrad)" opacity="0.3" />

          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path d={rawPath} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          <path d={maPath} fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />

          {recent.map((e, i) => (
            <circle key={i} cx={toX(i)} cy={toY(e.weight)} r={i === recent.length - 1 ? 4 : 2}
              fill={i === recent.length - 1 ? '#818cf8' : 'rgba(255,255,255,0.2)'} />
          ))}

          <text x={toX(recent.length - 1)} y={toY(last) - 10} textAnchor="middle"
            fill="#818cf8" fontSize="11" fontWeight="600" fontFamily="DM Mono, monospace">
            {last.toFixed(1)}
          </text>
        </svg>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 16, height: 2, background: 'rgba(255,255,255,0.15)', borderRadius: 1 }} />
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>Daily</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 16, height: 2.5, background: '#818cf8', borderRadius: 1 }} />
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>7-day avg</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Weight({ weightEntry, selectedDate, reload }) {
  const dateKey = fmt(selectedDate);
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState('lbs');
  const [notes, setNotes] = useState('');
  const [allEntries, setAllEntries] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSetting('weightUnit', 'lbs').then(setUnit);
    getAllWeightEntries().then(setAllEntries);
  }, []);

  useEffect(() => {
    if (weightEntry) {
      setWeight(String(weightEntry.weight));
      setNotes(weightEntry.notes || '');
    } else {
      setWeight('');
      setNotes('');
    }
    setSaved(false);
  }, [dateKey, weightEntry]);

  useEffect(() => {
    if (saved) getAllWeightEntries().then(setAllEntries);
  }, [saved]);

  const toggleUnit = async () => {
    const newUnit = unit === 'lbs' ? 'kg' : 'lbs';
    setUnit(newUnit);
    await setSetting('weightUnit', newUnit);
  };

  const handleSave = async () => {
    const val = parseFloat(weight);
    if (!val || val <= 0) return;
    await saveWeightEntry(dateKey, val, unit, notes);
    setSaved(true);
    reload();
  };

  const latestEntry = allEntries.length > 0 ? allEntries[allEntries.length - 1] : null;
  const weekAgo = fmt(addDays(selectedDate, -7));
  const weekEntry = allEntries.find(e => e.date === weekAgo);
  const monthAgo = fmt(addDays(selectedDate, -30));
  const monthEntry = allEntries.find(e => e.date <= monthAgo);

  const last7 = allEntries.slice(-7);
  const movingAvg = last7.length > 0 ? (last7.reduce((s, e) => s + e.weight, 0) / last7.length) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 100 }}>
      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>Weight</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
          {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </div>

      {latestEntry && (
        <div style={{ textAlign: 'center' }}>
          <span className="mono" style={{ fontSize: 48, fontWeight: 700, color: '#fff' }}>
            {latestEntry.weight.toFixed(1)}
          </span>
          <button onClick={toggleUnit} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, padding: '4px 10px', marginLeft: 8, cursor: 'pointer',
            color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: "'DM Mono', monospace",
            verticalAlign: 'super'
          }}>{unit}</button>

          {movingAvg && (
            <div style={{ marginTop: 6 }}>
              <span className="mono" style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
                7-day avg: {movingAvg.toFixed(1)} {unit}
              </span>
            </div>
          )}
        </div>
      )}

      {allEntries.length > 1 && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {weekEntry && (() => {
            const delta = latestEntry.weight - weekEntry.weight;
            const color = delta < 0 ? '#4ade80' : delta > 0 ? '#fb923c' : 'rgba(255,255,255,0.4)';
            return (
              <div className="card" style={{ flex: 1, textAlign: 'center', padding: '12px 8px' }}>
                <div className="mono" style={{ fontSize: 16, fontWeight: 700, color }}>
                  {delta > 0 ? '+' : ''}{delta.toFixed(1)}
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>7 days</div>
              </div>
            );
          })()}
          {monthEntry && (() => {
            const delta = latestEntry.weight - monthEntry.weight;
            const color = delta < 0 ? '#4ade80' : delta > 0 ? '#fb923c' : 'rgba(255,255,255,0.4)';
            return (
              <div className="card" style={{ flex: 1, textAlign: 'center', padding: '12px 8px' }}>
                <div className="mono" style={{ fontSize: 16, fontWeight: 700, color }}>
                  {delta > 0 ? '+' : ''}{delta.toFixed(1)}
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>30 days</div>
              </div>
            );
          })()}
        </div>
      )}

      <TrendChart entries={allEntries} unit={unit} />

      <div>
        <div className="label-xs" style={{ marginBottom: 6, paddingLeft: 4, fontWeight: 600 }}>Log Weight</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input value={weight} onChange={e => {
              const v = e.target.value.replace(/[^\d.]/g, '');
              if (v.split('.').length <= 2) setWeight(v);
            }}
              placeholder={latestEntry ? latestEntry.weight.toFixed(1) : '0.0'}
              className="input mono" style={{ fontSize: 22, paddingRight: 40 }} />
            <span style={{
              position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
              color: 'rgba(255,255,255,0.25)', fontSize: 14, fontFamily: "'DM Mono', monospace"
            }}>{unit}</span>
          </div>
        </div>
      </div>

      <div>
        <div className="label-xs" style={{ marginBottom: 6, paddingLeft: 4 }}>Notes</div>
        <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional..."
          className="input" />
      </div>

      <button onClick={handleSave}
        className={`btn-full ${weight && parseFloat(weight) > 0 ? '' : 'btn-disabled'}`}
        style={{ background: weight && parseFloat(weight) > 0 ? 'linear-gradient(135deg, #818cf8, #6366f1)' : undefined }}>
        {saved ? '✓ Saved' : 'Save Weight'}
      </button>

      {!allEntries.length && (
        <div className="card" style={{ padding: '14px 18px', textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
            Log daily for best results. The trend chart smooths out water weight fluctuations with a 7-day moving average so you can see the real trajectory.
          </div>
        </div>
      )}
    </div>
  );
}
