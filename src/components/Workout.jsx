import { useState, useRef, useEffect } from 'react';
import { sameDay, addDays, fmt, EXERCISE_PRESETS, ICON_OPTIONS, DAY_ABBR_MON } from '../helpers';
import { getSessionForDate, getPhase, getTypeColor, getTypeIcon } from '../data/training';
import { addExercise, deleteExercise, getSetting, setSetting } from '../db';

function AddExerciseModal({ date, onClose, onSave, customExercises }) {
  const [mode, setMode] = useState('pick');
  const [customName, setCustomName] = useState('');
  const [customIcon, setCustomIcon] = useState('🏃');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [selected, setSelected] = useState(null);

  const allExercises = [...EXERCISE_PRESETS, ...customExercises];

  const handleAdd = async () => {
    const ex = mode === 'pick' && selected ? selected : { name: customName.trim(), icon: customIcon, category: 'custom' };
    if (!ex.name) return;
    await addExercise(date, { name: ex.name, icon: ex.icon, category: ex.category || 'custom', duration: parseInt(duration) || 0, notes });
    if (mode === 'custom' && ex.name && !customExercises.find(c => c.name === ex.name)) {
      const updated = [...customExercises, { name: ex.name, icon: ex.icon, category: 'custom' }];
      await setSetting('customExercises', updated);
    }
    onSave();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: '85vh', overflowY: 'auto' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16, textAlign: 'center' }}>Add Exercise</div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 3 }}>
          {[['pick', 'Library'], ['custom', 'Custom']].map(([m, label]) => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: '8px 0', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: mode === m ? 'rgba(192,132,252,0.15)' : 'transparent',
              border: mode === m ? '1px solid rgba(192,132,252,0.25)' : '1px solid transparent',
              color: mode === m ? '#c084fc' : 'rgba(255,255,255,0.4)'
            }}>{label}</button>
          ))}
        </div>

        {mode === 'pick' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 16 }}>
            {allExercises.map((ex, i) => (
              <button key={i} onClick={() => setSelected(ex)} className="card" style={{
                padding: '12px 10px', display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left',
                background: selected?.name === ex.name ? 'rgba(192,132,252,0.12)' : undefined,
                borderColor: selected?.name === ex.name ? 'rgba(192,132,252,0.3)' : undefined,
              }}>
                <span style={{ fontSize: 20 }}>{ex.icon}</span>
                <span style={{ fontSize: 13, color: selected?.name === ex.name ? '#c084fc' : '#fff', fontWeight: 500 }}>{ex.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div style={{ marginBottom: 16 }}>
            <input value={customName} onChange={e => setCustomName(e.target.value)} placeholder="Exercise name..." className="input" style={{ marginBottom: 10 }} />
            <div className="label-xs" style={{ marginBottom: 8, paddingLeft: 4 }}>Icon</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {ICON_OPTIONS.map(ic => (
                <button key={ic} onClick={() => setCustomIcon(ic)} style={{
                  width: 38, height: 38, borderRadius: 10, cursor: 'pointer', fontSize: 18,
                  background: customIcon === ic ? 'rgba(192,132,252,0.15)' : 'rgba(255,255,255,0.03)',
                  border: customIcon === ic ? '1.5px solid rgba(192,132,252,0.3)' : '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{ic}</button>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: 10 }}>
          <div className="label-xs" style={{ marginBottom: 6, paddingLeft: 4 }}>Duration (min)</div>
          <input value={duration} onChange={e => setDuration(e.target.value.replace(/\D/g, ''))} placeholder="30" className="input mono" style={{ fontSize: 16 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <div className="label-xs" style={{ marginBottom: 6, paddingLeft: 4 }}>Notes</div>
          <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional..." className="input" />
        </div>

        <button onClick={handleAdd} className={`btn-full ${(mode === 'pick' ? selected : customName.trim()) ? '' : 'btn-disabled'}`}
          style={{ background: (mode === 'pick' ? selected : customName.trim()) ? 'linear-gradient(135deg, #a855f7, #7c3aed)' : undefined }}>
          Add Exercise
        </button>
      </div>
    </div>
  );
}

export default function Workout({ selectedDate, setShowCalendar, exercises, reload }) {
  const session = getSessionForDate(selectedDate);
  const phase = session ? getPhase(session) : null;
  const [showAddModal, setShowAddModal] = useState(false);
  const [customExercises, setCustomExercises] = useState([]);
  const dateKey = fmt(selectedDate);
  const extras = exercises.filter(e => e.date === dateKey);

  useEffect(() => {
    getSetting('customExercises', []).then(setCustomExercises);
  }, []);

  const weekStart = addDays(selectedDate, -(selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1));
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handleDelete = async (id) => {
    await deleteExercise(id);
    reload();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 100 }}>
      {showAddModal && (
        <AddExerciseModal date={dateKey} onClose={() => setShowAddModal(false)}
          onSave={() => { reload(); getSetting('customExercises', []).then(setCustomExercises); }}
          customExercises={customExercises} />
      )}

      {/* Week strip */}
      <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
        {weekDays.map((d, i) => {
          const s = getSessionForDate(d);
          const hasExtra = exercises.some(e => e.date === fmt(d));
          const isSelected = sameDay(d, selectedDate);
          const typeColor = s ? getTypeColor(s) : null;
          return (
            <button key={i} onClick={() => setShowCalendar(true)} style={{
              width: 42, height: 58, borderRadius: 12, cursor: 'pointer',
              background: isSelected ? (s ? typeColor + '22' : hasExtra ? 'rgba(192,132,252,0.12)' : 'rgba(255,255,255,0.06)') : 'rgba(255,255,255,0.02)',
              border: isSelected ? `1.5px solid ${s ? typeColor + '55' : hasExtra ? 'rgba(192,132,252,0.3)' : 'rgba(255,255,255,0.15)'}` : '1px solid rgba(255,255,255,0.04)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3
            }}>
              <span style={{ fontSize: 10, color: isSelected ? '#fff' : 'rgba(255,255,255,0.3)', fontWeight: 600 }}>{DAY_ABBR_MON[i]}</span>
              <span style={{ fontSize: 13, color: isSelected ? '#fff' : 'rgba(255,255,255,0.2)' }}>{d.getDate()}</span>
              <div style={{ display: 'flex', gap: 2 }}>
                {s && <div style={{ width: 4, height: 4, borderRadius: '50%', background: typeColor }} />}
                {hasExtra && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#c084fc' }} />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Scheduled session */}
      {session && (
        <div style={{ background: getTypeColor(session) + '0a', border: `1px solid ${getTypeColor(session)}18`, borderRadius: 16, padding: 18 }}>
          <div style={{ fontSize: 10, color: getTypeColor(session), textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 600, marginBottom: 8 }}>
            {getTypeIcon(session)} Scheduled · {session.isNew ? `Cycle ${session.cycle} · Wk ${session.week} · ${phase.name}` : `Week ${session.week} · ${phase.name}`}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{session.name}</span>
            <span className="badge" style={{ background: getTypeColor(session) + '22', color: getTypeColor(session) }}>{session.intensity}</span>
          </div>
          <div style={{ marginBottom: session.notes ? 10 : 0 }}>
            <span className="mono" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>⏱ {session.duration} min</span>
          </div>
          {session.notes && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>{session.notes}</div>}
        </div>
      )}

      {/* Extra exercises */}
      {extras.length > 0 && (
        <div>
          <div className="label-xs" style={{ fontWeight: 600, marginBottom: 8, paddingLeft: 4 }}>Additional Exercise</div>
          {extras.map((ex) => (
            <div key={ex.id} className="card" style={{
              padding: '14px 18px', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'rgba(192,132,252,0.06)', borderColor: 'rgba(192,132,252,0.12)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }} onClick={() => handleDelete(ex.id)}>
                <span style={{ fontSize: 22 }}>{ex.icon}</span>
                <div>
                  <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>{ex.name}</div>
                  {ex.notes && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{ex.notes}</div>}
                </div>
              </div>
              <span className="mono" style={{ fontSize: 14, color: '#c084fc', fontWeight: 600 }}>{ex.duration}m</span>
            </div>
          ))}
        </div>
      )}

      {!session && extras.length === 0 && (
        <div style={{ textAlign: 'center', padding: '30px 0' }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🧘</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Rest Day</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>No training scheduled. Add other exercise below.</div>
        </div>
      )}

      <button onClick={() => setShowAddModal(true)} style={{
        background: 'linear-gradient(135deg, #a855f7, #7c3aed)', border: 'none',
        borderRadius: 14, padding: '14px 0', cursor: 'pointer',
        fontSize: 14, fontWeight: 700, color: '#fff', width: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
      }}>
        <span style={{ fontSize: 18 }}>+</span> Add Exercise
      </button>
    </div>
  );
}
