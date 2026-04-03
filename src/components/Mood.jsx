import { useState, useEffect, useRef } from 'react';
import { MOODS, NUTRITION_LEVELS, DEFAULT_ACTIVITY_TAGS, fmt } from '../helpers';
import { saveMoodEntry, getSetting, setSetting } from '../db';

function TagManager({ tags, setTags, onClose }) {
  const [newTag, setNewTag] = useState('');
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const addTag = () => {
    const t = newTag.trim();
    if (t && !tags.includes(t)) { setTags([...tags, t]); setNewTag(''); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16, textAlign: 'center' }}>Manage Activities</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input ref={inputRef} value={newTag} onChange={e => setNewTag(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTag()} placeholder="New activity..." className="input" style={{ flex: 1 }} />
          <button onClick={addTag} className="btn-sm" style={{ background: 'rgba(250,204,21,0.15)', border: '1px solid rgba(250,204,21,0.25)', color: '#facc15', padding: '0 16px', height: 'auto' }}>Add</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {tags.map(tag => (
            <div key={tag} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px' }}>
              <span style={{ color: '#fff', fontSize: 14 }}>{tag}</span>
              <button onClick={() => setTags(tags.filter(t => t !== tag))} style={{
                background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)',
                borderRadius: 8, width: 28, height: 28, cursor: 'pointer', color: '#f87171', fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>×</button>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="btn-full" style={{ marginTop: 16, background: 'rgba(255,255,255,0.06)' }}>Done</button>
      </div>
    </div>
  );
}

export default function Mood({ moodEntry, selectedDate, reload }) {
  const dateKey = fmt(selectedDate);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedNutrition, setSelectedNutrition] = useState(null);
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [notes, setNotes] = useState('');
  const [activityTags, setActivityTags] = useState([...DEFAULT_ACTIVITY_TAGS]);
  const [showTagManager, setShowTagManager] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load tags from settings
  useEffect(() => {
    getSetting('activityTags', DEFAULT_ACTIVITY_TAGS).then(setActivityTags);
  }, []);

  // Load existing entry
  useEffect(() => {
    if (moodEntry) {
      setSelectedMood(moodEntry.level);
      setSelectedNutrition(moodEntry.nutrition || null);
      setSelectedTags(new Set(moodEntry.tags || []));
      setNotes(moodEntry.notes || '');
    } else {
      setSelectedMood(null); setSelectedNutrition(null); setSelectedTags(new Set()); setNotes('');
    }
    setSaved(false);
  }, [dateKey, moodEntry]);

  const toggleTag = (tag) => {
    const n = new Set(selectedTags);
    n.has(tag) ? n.delete(tag) : n.add(tag);
    setSelectedTags(n);
  };

  const updateTags = async (newTags) => {
    setActivityTags(newTags);
    await setSetting('activityTags', newTags);
  };

  const handleSave = async () => {
    if (!selectedMood) return;
    await saveMoodEntry(dateKey, selectedMood, [...selectedTags], notes, selectedNutrition);
    setSaved(true);
    reload();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 100 }}>
      {showTagManager && <TagManager tags={activityTags} setTags={updateTags} onClose={() => setShowTagManager(false)} />}

      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>How are you feeling?</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
          {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* Mood selector */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
        {MOODS.map(m => (
          <button key={m.level} onClick={() => setSelectedMood(m.level)} style={{
            width: 56, height: 72, borderRadius: 16, cursor: 'pointer',
            background: selectedMood === m.level ? `${m.color}18` : 'rgba(255,255,255,0.03)',
            border: selectedMood === m.level ? `2px solid ${m.color}55` : '1px solid rgba(255,255,255,0.06)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
            transform: selectedMood === m.level ? 'scale(1.1)' : 'scale(1)', transition: 'all 0.2s'
          }}>
            <span style={{ fontSize: 24 }}>{m.emoji}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: selectedMood === m.level ? m.color : 'rgba(255,255,255,0.3)' }}>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Nutrition rating */}
      <div>
        <div className="label-xs" style={{ marginBottom: 10, paddingLeft: 4, fontWeight: 600 }}>Nutrition Today</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          {NUTRITION_LEVELS.map(n => (
            <button key={n.level} onClick={() => setSelectedNutrition(n.level)} style={{
              width: 68, height: 68, borderRadius: 16, cursor: 'pointer',
              background: selectedNutrition === n.level ? `${n.color}18` : 'rgba(255,255,255,0.03)',
              border: selectedNutrition === n.level ? `2px solid ${n.color}55` : '1px solid rgba(255,255,255,0.06)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
              transform: selectedNutrition === n.level ? 'scale(1.08)' : 'scale(1)', transition: 'all 0.2s'
            }}>
              <span style={{ fontSize: 22 }}>{n.emoji}</span>
              <span style={{ fontSize: 9, fontWeight: 600, color: selectedNutrition === n.level ? n.color : 'rgba(255,255,255,0.3)' }}>{n.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Activities */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, padding: '0 4px' }}>
          <span className="label-xs" style={{ fontWeight: 600 }}>Activities</span>
          <button className="btn-sm" onClick={() => setShowTagManager(true)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>Edit ✎</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {activityTags.map(tag => (
            <button key={tag} onClick={() => toggleTag(tag)} style={{
              background: selectedTags.has(tag) ? 'rgba(250,204,21,0.12)' : 'rgba(255,255,255,0.04)',
              border: selectedTags.has(tag) ? '1px solid rgba(250,204,21,0.25)' : '1px solid rgba(255,255,255,0.08)',
              color: selectedTags.has(tag) ? '#facc15' : 'rgba(255,255,255,0.5)',
              borderRadius: 20, padding: '7px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all 0.15s'
            }}>{tag}</button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <div className="label-xs" style={{ marginBottom: 10, paddingLeft: 4, fontWeight: 600 }}>Notes</div>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="How was your day?..." style={{
          width: '100%', minHeight: 80, background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
          padding: 14, color: '#fff', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box'
        }} />
      </div>

      <button onClick={handleSave} className={`btn-full ${selectedMood ? '' : 'btn-disabled'}`}
        style={{ background: selectedMood ? 'linear-gradient(135deg, #eab308, #ca8a04)' : undefined }}>
        {saved ? '✓ Saved' : 'Save Check-in'}
      </button>
    </div>
  );
}
