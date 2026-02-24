import { MiniBar, MacroRing } from './ui';
import { sameDay, addDays, fmt, MOODS, QUALITY_LABELS, DAY_NAMES, MONTH_SHORT, calcSleepDuration } from '../helpers';
import { getSessionForDate, getPhase } from '../data/cycling';

export default function Dashboard({ setActiveTab, selectedDate, setShowCalendar, exercises, meals, moodEntry, sleepEntry, weightEntry }) {
  const totalCal = meals.reduce((s, m) => s + (m.calories || 0), 0);
  const totalP = meals.reduce((s, m) => s + (m.protein || 0), 0);
  const totalC = meals.reduce((s, m) => s + (m.carbs || 0), 0);
  const totalF = meals.reduce((s, m) => s + (m.fat || 0), 0);
  const session = getSessionForDate(selectedDate);
  const phase = session ? getPhase(session.week) : null;
  const today = new Date();
  const isToday = sameDay(selectedDate, today);
  const dateKey = fmt(selectedDate);
  const extras = exercises.filter(e => e.date === dateKey);
  const sleepDur = sleepEntry ? calcSleepDuration(sleepEntry.bedtime, sleepEntry.waketime) : null;
  const moodInfo = moodEntry ? MOODS.find(m => m.level === moodEntry.level) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 100 }}>
      {/* Date header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0 4px' }}>
        <button onClick={() => setShowCalendar(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}>
          <div className="label-xs" style={{ letterSpacing: 2 }}>{DAY_NAMES[selectedDate.getDay()]}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>{MONTH_SHORT[selectedDate.getMonth()]} {selectedDate.getDate()}</span>
            <span style={{ fontSize: 12, color: 'rgba(129,140,248,0.6)' }}>▾</span>
          </div>
        </button>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn-icon" onClick={() => setActiveTab('dashboard', addDays(selectedDate, -1))}>‹</button>
          {!isToday && <button className="btn-sm btn-accent" onClick={() => setActiveTab('dashboard', today)}>Today</button>}
          <button className="btn-icon" onClick={() => setActiveTab('dashboard', addDays(selectedDate, 1))}>›</button>
        </div>
      </div>

      {/* Sleep card */}
      <button className="card" onClick={() => setActiveTab('sleep')} style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))',
        borderColor: 'rgba(139,92,246,0.12)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>{sleepEntry ? QUALITY_LABELS[sleepEntry.quality - 1].icon : '🌙'}</span>
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#a78bfa' }}>
              {sleepEntry ? `${sleepDur.hours}h ${sleepDur.minutes}m sleep` : 'Log sleep'}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
              {sleepEntry ? `${sleepEntry.bedtime} → ${sleepEntry.waketime}` : 'Tap to add'}
            </div>
          </div>
          {sleepEntry && (
            <span style={{ fontSize: 11, color: QUALITY_LABELS[sleepEntry.quality-1].color, fontWeight: 600, background: QUALITY_LABELS[sleepEntry.quality-1].color + '18', padding: '3px 8px', borderRadius: 8 }}>
              {QUALITY_LABELS[sleepEntry.quality-1].label}
            </span>
          )}
        </div>
      </button>

      {/* Mood card */}
      <button className="card" onClick={() => setActiveTab('mood')} style={{
        background: 'linear-gradient(135deg, rgba(250,204,21,0.12), rgba(250,204,21,0.04))',
        borderColor: 'rgba(250,204,21,0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>{moodInfo ? moodInfo.emoji : '🫥'}</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#facc15' }}>
              {moodInfo ? `Feeling ${moodInfo.label}` : 'No check-in'}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
              {moodEntry ? `${moodEntry.tags?.length || 0} activities tagged` : 'Tap to log'}
            </div>
          </div>
        </div>
      </button>

      {/* Calories card */}
      <button className="card" onClick={() => setActiveTab('calories')} style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.03))',
        borderColor: 'rgba(99,102,241,0.12)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div className="label-xs" style={{ marginBottom: 4 }}>Calories</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span className="mono" style={{ fontSize: 30, fontWeight: 700, color: '#fff' }}>{totalCal}</span>
              <span className="mono" style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>/ 2,200</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            <MacroRing value={totalP} max={150} color="#818cf8" size={46} stroke={4} label="P" />
            <MacroRing value={totalC} max={250} color="#c084fc" size={46} stroke={4} label="C" />
            <MacroRing value={totalF} max={80} color="#f472b6" size={46} stroke={4} label="F" />
          </div>
        </div>
        <MiniBar value={totalCal} max={2200} color="#818cf8" height={4} />
      </button>

      {/* Weight card */}
      <button className="card" onClick={() => setActiveTab('weight')} style={{
        background: 'linear-gradient(135deg, rgba(129,140,248,0.08), rgba(99,102,241,0.03))',
        borderColor: 'rgba(129,140,248,0.12)',
        display: 'flex', alignItems: 'center', gap: 12
      }}>
        <span style={{ fontSize: 24 }}>⚖️</span>
        <div style={{ textAlign: 'left', flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#818cf8' }}>
            {weightEntry ? `${weightEntry.weight.toFixed(1)} ${weightEntry.unit || 'lbs'}` : 'Log weight'}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
            {weightEntry ? 'Logged today' : 'Tap to add'}
          </div>
        </div>
      </button>

      {/* Training card */}
      <button className="card" onClick={() => setActiveTab('workout')} style={{
        background: session ? `linear-gradient(135deg, ${phase.color}18, ${phase.color}08)`
          : extras.length > 0 ? 'linear-gradient(135deg, rgba(192,132,252,0.1), rgba(192,132,252,0.04))'
          : 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
        borderColor: session ? phase.color + '22' : extras.length > 0 ? 'rgba(192,132,252,0.15)' : 'rgba(255,255,255,0.06)',
      }}>
        {session ? (
          <div>
            <div className="label-xs" style={{ marginBottom: 4 }}>Wk {session.week} · {phase.name}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{session.name}</span>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span className="mono" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{session.duration}m</span>
                <span className="badge" style={{ background: phase.color + '22', color: phase.color }}>{session.intensity}</span>
              </div>
            </div>
            {extras.length > 0 && (
              <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                {extras.map((ex, i) => (
                  <span key={i} className="badge" style={{ background: 'rgba(192,132,252,0.1)', color: '#c084fc' }}>+ {ex.name}</span>
                ))}
              </div>
            )}
          </div>
        ) : extras.length > 0 ? (
          <div>
            <div className="label-xs" style={{ marginBottom: 4 }}>Activity</div>
            {extras.map((ex, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: i > 0 ? 6 : 0 }}>
                <span style={{ fontSize: 18 }}>{ex.icon}</span>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{ex.name}</span>
                <span className="mono" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{ex.duration}m</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4px 0' }}>
            <div className="label-xs" style={{ marginBottom: 4 }}>Training</div>
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.3)' }}>Rest Day</div>
          </div>
        )}
      </button>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        {[
          { icon: '🍽', label: 'Meal', tab: 'calories' },
          { icon: '🏃', label: 'Exercise', tab: 'workout' },
          { icon: '🌙', label: 'Sleep', tab: 'sleep' },
          { icon: '📤', label: 'Export', tab: 'export' },
        ].map(a => (
          <button key={a.label} className="card" onClick={() => setActiveTab(a.tab)} style={{
            flex: 1, padding: '12px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, textAlign: 'center'
          }}>
            <span style={{ fontSize: 16 }}>{a.icon}</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
