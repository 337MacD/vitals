import { useState, useEffect } from 'react';
import { sameDay, addDays, fmt, MOODS, QUALITY_LABELS, DAY_NAMES, MONTH_SHORT, NUTRITION_LEVELS, calcSleepDuration } from '../helpers';
import { getSessionForDate, getPhase, getTypeColor, getTypeIcon, TYPES } from '../data/training';
import { getSetting } from '../db';

export default function Dashboard({ setActiveTab, selectedDate, setShowCalendar, exercises, moodEntry, sleepEntry, weightEntry }) {
  const [showBackupBanner, setShowBackupBanner] = useState(false);

  const session = getSessionForDate(selectedDate);
  const phase = session ? getPhase(session) : null;
  const today = new Date();
  const isToday = sameDay(selectedDate, today);
  const dateKey = fmt(selectedDate);
  const extras = exercises.filter(e => e.date === dateKey);
  const sleepDur = sleepEntry ? calcSleepDuration(sleepEntry.bedtime, sleepEntry.waketime) : null;
  const moodInfo = moodEntry ? MOODS.find(m => m.level === moodEntry.level) : null;
  const nutritionInfo = moodEntry?.nutrition ? NUTRITION_LEVELS.find(n => n.level === moodEntry.nutrition) : null;

  // Incomplete indicators for today
  const incomplete = isToday ? {
    sleep: !sleepEntry,
    mood: !moodEntry,
    weight: !weightEntry,
  } : {};
  const incompleteCount = Object.values(incomplete).filter(Boolean).length;

  // Backup reminder: check if last export was > 14 days ago
  useEffect(() => {
    getSetting('lastExportDate', null).then(last => {
      if (!last) { setShowBackupBanner(true); return; }
      const daysSince = Math.floor((Date.now() - new Date(last).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSince >= 14) setShowBackupBanner(true);
    });
  }, []);

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
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {isToday && incompleteCount > 0 && (
            <span style={{
              fontSize: 10, fontWeight: 700, color: '#facc15',
              background: 'rgba(250,204,21,0.12)', border: '1px solid rgba(250,204,21,0.2)',
              borderRadius: 10, padding: '3px 8px'
            }}>{incompleteCount} to log</span>
          )}
          <button className="btn-icon" onClick={() => setActiveTab('dashboard', addDays(selectedDate, -1))}>‹</button>
          {!isToday && <button className="btn-sm btn-accent" onClick={() => setActiveTab('dashboard', today)}>Today</button>}
          <button className="btn-icon" onClick={() => setActiveTab('dashboard', addDays(selectedDate, 1))}>›</button>
        </div>
      </div>

      {/* Backup reminder */}
      {showBackupBanner && (
        <button className="card" onClick={() => setActiveTab('export')} style={{
          background: 'linear-gradient(135deg, rgba(251,146,60,0.1), rgba(251,146,60,0.04))',
          borderColor: 'rgba(251,146,60,0.2)', display: 'flex', alignItems: 'center', gap: 10
        }}>
          <span style={{ fontSize: 18 }}>💾</span>
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fb923c' }}>Backup your data</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>It's been a while since your last export</div>
          </div>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>→</span>
        </button>
      )}

      {/* Sleep card */}
      <button className="card" onClick={() => setActiveTab('sleep')} style={{
        background: incomplete.sleep
          ? 'linear-gradient(135deg, rgba(250,204,21,0.06), rgba(139,92,246,0.05))'
          : 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))',
        borderColor: incomplete.sleep ? 'rgba(250,204,21,0.15)' : 'rgba(139,92,246,0.12)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>{sleepEntry ? QUALITY_LABELS[sleepEntry.quality - 1].icon : '🌙'}</span>
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: incomplete.sleep ? '#facc15' : '#a78bfa' }}>
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
        background: incomplete.mood
          ? 'linear-gradient(135deg, rgba(250,204,21,0.06), rgba(250,204,21,0.02))'
          : 'linear-gradient(135deg, rgba(250,204,21,0.12), rgba(250,204,21,0.04))',
        borderColor: incomplete.mood ? 'rgba(250,204,21,0.15)' : 'rgba(250,204,21,0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>{moodInfo ? moodInfo.emoji : '🫥'}</span>
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#facc15' }}>
              {moodInfo ? `Feeling ${moodInfo.label}` : 'No check-in'}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
              {moodEntry ? (
                <>
                  {moodEntry.tags?.length || 0} activities
                  {nutritionInfo ? ` · Ate ${nutritionInfo.label.toLowerCase()}` : ''}
                </>
              ) : 'Tap to log mood & nutrition'}
            </div>
          </div>
          {nutritionInfo && (
            <span style={{ fontSize: 18 }}>{nutritionInfo.emoji}</span>
          )}
        </div>
      </button>

      {/* Weight card */}
      <button className="card" onClick={() => setActiveTab('weight')} style={{
        background: incomplete.weight
          ? 'linear-gradient(135deg, rgba(250,204,21,0.06), rgba(129,140,248,0.03))'
          : 'linear-gradient(135deg, rgba(129,140,248,0.08), rgba(99,102,241,0.03))',
        borderColor: incomplete.weight ? 'rgba(250,204,21,0.15)' : 'rgba(129,140,248,0.12)',
        display: 'flex', alignItems: 'center', gap: 12
      }}>
        <span style={{ fontSize: 24 }}>⚖️</span>
        <div style={{ textAlign: 'left', flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: incomplete.weight ? '#facc15' : '#818cf8' }}>
            {weightEntry ? `${weightEntry.weight.toFixed(1)} ${weightEntry.unit || 'lbs'}` : 'Log weight'}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
            {weightEntry ? 'Logged today' : 'Tap to add'}
          </div>
        </div>
      </button>

      {/* Training card */}
      <button className="card" onClick={() => setActiveTab('workout')} style={{
        background: session ? (session.type
          ? `linear-gradient(135deg, ${getTypeColor(session)}18, ${getTypeColor(session)}08)`
          : `linear-gradient(135deg, ${phase.color}18, ${phase.color}08)`)
          : extras.length > 0 ? 'linear-gradient(135deg, rgba(192,132,252,0.1), rgba(192,132,252,0.04))'
          : 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
        borderColor: session ? (session.type ? getTypeColor(session) + '22' : phase.color + '22')
          : extras.length > 0 ? 'rgba(192,132,252,0.15)' : 'rgba(255,255,255,0.06)',
      }}>
        {session ? (
          <div>
            <div className="label-xs" style={{ marginBottom: 4 }}>
              {session.isNew
                ? `Cycle ${session.cycle} · Wk ${session.week} · ${phase.name}`
                : `Wk ${session.week} · ${phase.name}`
              }
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>{getTypeIcon(session)}</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{session.name}</span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span className="mono" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{session.duration}m</span>
                <span className="badge" style={{ background: getTypeColor(session) + '22', color: getTypeColor(session) }}>{session.intensity}</span>
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
          { icon: '🏃', label: 'Exercise', tab: 'workout' },
          { icon: '🌙', label: 'Sleep', tab: 'sleep' },
          { icon: '◈', label: 'Mood', tab: 'mood' },
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
