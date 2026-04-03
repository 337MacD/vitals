// ─── Training Schedule ───
// New 5-day/week program with repeating 4-week mesocycles
// Mon: Upper Body (dumbbells) | Tue: Easy Run | Wed: Cycling | Thu: Lower Body (dumbbells) | Fri: Tempo/Interval Run

export const LEGACY_PROGRAM_START = new Date(2026, 0, 3); // Jan 3, 2026
export const NEW_PROGRAM_START = new Date(2026, 2, 30);   // Mar 30, 2026 (Monday)

// ─── Workout Types ───

export const TYPES = {
  strength: { name: 'Strength', color: '#818cf8', icon: '🏋️' },
  run:      { name: 'Run',      color: '#4ade80', icon: '🏃' },
  cycling:  { name: 'Cycling',  color: '#38bdf8', icon: '🚴' },
};

// ─── Mesocycle Phases ───

export const PHASES = {
  1: { name: 'Base',    color: '#a3e635' },
  2: { name: 'Build',   color: '#38bdf8' },
  3: { name: 'Peak',    color: '#f472b6' },
  4: { name: 'Deload',  color: '#94a3b8' },
};

// ─── Legacy Cycling Phases (for historical dates) ───

const LEGACY_PHASES = {
  1: { name: 'Habit Formation',       color: '#4ade80' },
  2: { name: 'Base Building',         color: '#38bdf8' },
  3: { name: 'Structured Intensity',  color: '#f472b6' },
};

// ─── 4-Week Mesocycle (day: 1=Mon..7=Sun) ───

const MESOCYCLE = [
  // Week 1: Base
  { week: 1, day: 1, name: 'Upper Body',  type: 'strength', duration: 35, intensity: 'Moderate', notes: '' },
  { week: 1, day: 2, name: 'Easy Run',    type: 'run',      duration: 25, intensity: 'Easy',     notes: 'Conversational pace' },
  { week: 1, day: 3, name: 'Cycling',     type: 'cycling',  duration: 35, intensity: 'Moderate', notes: '' },
  { week: 1, day: 4, name: 'Lower Body',  type: 'strength', duration: 35, intensity: 'Moderate', notes: '' },
  { week: 1, day: 5, name: 'Tempo Run',   type: 'run',      duration: 25, intensity: 'Mod-Hard', notes: 'Sustained effort' },

  // Week 2: Build
  { week: 2, day: 1, name: 'Upper Body',    type: 'strength', duration: 40, intensity: 'Mod-Hard', notes: 'Increase weight or reps' },
  { week: 2, day: 2, name: 'Easy Run',      type: 'run',      duration: 30, intensity: 'Easy',     notes: 'Conversational pace' },
  { week: 2, day: 3, name: 'Cycling',       type: 'cycling',  duration: 40, intensity: 'Mod-Hard', notes: 'Push cadence or resistance' },
  { week: 2, day: 4, name: 'Lower Body',    type: 'strength', duration: 40, intensity: 'Mod-Hard', notes: 'Increase weight or reps' },
  { week: 2, day: 5, name: 'Interval Run',  type: 'run',      duration: 30, intensity: 'Hard',     notes: '4 min hard / 2 min easy' },

  // Week 3: Peak
  { week: 3, day: 1, name: 'Upper Body',    type: 'strength', duration: 45, intensity: 'Hard',     notes: 'Push for new bests' },
  { week: 3, day: 2, name: 'Easy Run',      type: 'run',      duration: 35, intensity: 'Easy',     notes: 'Longer easy effort' },
  { week: 3, day: 3, name: 'Cycling',       type: 'cycling',  duration: 45, intensity: 'Hard',     notes: 'Highest effort of cycle' },
  { week: 3, day: 4, name: 'Lower Body',    type: 'strength', duration: 45, intensity: 'Hard',     notes: 'Push for new bests' },
  { week: 3, day: 5, name: 'Interval Run',  type: 'run',      duration: 30, intensity: 'Hard',     notes: '3 min hard / 90s easy' },

  // Week 4: Deload
  { week: 4, day: 1, name: 'Upper Body Light', type: 'strength', duration: 25, intensity: 'Easy', notes: 'Reduce weight 40-50%' },
  { week: 4, day: 2, name: 'Easy Run',         type: 'run',      duration: 20, intensity: 'Easy', notes: 'Short recovery run' },
  { week: 4, day: 3, name: 'Easy Cycling',     type: 'cycling',  duration: 30, intensity: 'Easy', notes: 'Recovery spin' },
  { week: 4, day: 4, name: 'Lower Body Light', type: 'strength', duration: 25, intensity: 'Easy', notes: 'Reduce weight 40-50%' },
  { week: 4, day: 5, name: 'Easy Run',         type: 'run',      duration: 20, intensity: 'Easy', notes: 'Short recovery run' },
];

// ─── Legacy Cycling Schedule (Jan 3 – Mar 27, 2026) ───

const CYCLING_SCHEDULE = [
  { week: 1, day: 2, name: 'Ride 1', duration: 15, intensity: 'Easy', notes: 'Find comfortable seat position' },
  { week: 1, day: 4, name: 'Ride 2', duration: 15, intensity: 'Easy', notes: 'Aim for 70-85 RPM cadence' },
  { week: 1, day: 6, name: 'Ride 3', duration: 15, intensity: 'Easy-Mod', notes: 'Increase resistance mid-ride if comfortable' },
  { week: 2, day: 2, name: 'Ride 1', duration: 18, intensity: 'Easy-Mod', notes: '' },
  { week: 2, day: 4, name: 'Ride 2', duration: 18, intensity: 'Easy-Mod', notes: '' },
  { week: 2, day: 6, name: 'Ride 3', duration: 20, intensity: 'Moderate', notes: 'Hold steady cadence throughout' },
  { week: 3, day: 2, name: 'Ride 1', duration: 20, intensity: 'Moderate', notes: '' },
  { week: 3, day: 4, name: 'Ride 2', duration: 20, intensity: 'Moderate', notes: '' },
  { week: 3, day: 6, name: 'Ride 3', duration: 20, intensity: 'Moderate', notes: 'End-of-phase checkpoint' },
  { week: 4, day: 1, name: 'Steady Ride', duration: 25, intensity: 'Moderate', notes: 'Phase 2 begins' },
  { week: 4, day: 3, name: 'Variable Ride', duration: 25, intensity: 'Mod-Hard', notes: '3 min moderate / 1 min hard' },
  { week: 4, day: 5, name: 'Steady Ride', duration: 25, intensity: 'Moderate', notes: '' },
  { week: 5, day: 1, name: 'Steady Ride', duration: 30, intensity: 'Moderate', notes: '' },
  { week: 5, day: 3, name: 'Variable Ride', duration: 25, intensity: 'Mod-Hard', notes: '3 min moderate / 1 min hard' },
  { week: 5, day: 5, name: 'Steady Ride', duration: 30, intensity: 'Moderate', notes: '' },
  { week: 5, day: 6, name: 'Easy Spin', duration: 15, intensity: 'Easy', notes: '4th session — recovery pace' },
  { week: 6, day: 1, name: 'Steady Ride', duration: 30, intensity: 'Moderate', notes: '' },
  { week: 6, day: 3, name: 'Interval Ride', duration: 25, intensity: 'Hard', notes: '2 min hard / 2 min easy × 5' },
  { week: 6, day: 5, name: 'Steady Ride', duration: 30, intensity: 'Moderate', notes: '' },
  { week: 6, day: 6, name: 'Easy Spin', duration: 20, intensity: 'Easy', notes: 'Recovery' },
  { week: 7, day: 1, name: 'Endurance Ride', duration: 35, intensity: 'Moderate', notes: '' },
  { week: 7, day: 3, name: 'Interval Ride', duration: 30, intensity: 'Hard', notes: '2 min hard / 2 min easy × 6' },
  { week: 7, day: 5, name: 'Steady Ride', duration: 35, intensity: 'Moderate', notes: '' },
  { week: 7, day: 6, name: 'Easy Spin', duration: 20, intensity: 'Easy', notes: 'Recovery' },
  { week: 8, day: 1, name: 'Endurance Ride', duration: 40, intensity: 'Moderate', notes: 'Phase 2 peak' },
  { week: 8, day: 3, name: 'Interval Ride', duration: 30, intensity: 'Hard', notes: '90s hard / 90s easy × 8' },
  { week: 8, day: 5, name: 'Steady Ride', duration: 35, intensity: 'Moderate', notes: '' },
  { week: 8, day: 6, name: 'Easy Spin', duration: 20, intensity: 'Easy', notes: 'Recovery' },
  { week: 9, day: 1, name: 'Tempo Ride', duration: 35, intensity: 'Mod-Hard', notes: 'Phase 3 begins' },
  { week: 9, day: 2, name: 'Easy Spin', duration: 20, intensity: 'Easy', notes: 'Recovery' },
  { week: 9, day: 4, name: 'HIIT Ride', duration: 30, intensity: 'Hard-Max', notes: '30s max / 90s easy × 8' },
  { week: 9, day: 6, name: 'Long Ride', duration: 45, intensity: 'Moderate', notes: 'Duration focus' },
  { week: 10, day: 1, name: 'Tempo Ride', duration: 40, intensity: 'Mod-Hard', notes: '' },
  { week: 10, day: 2, name: 'Easy Spin', duration: 20, intensity: 'Easy', notes: 'Recovery' },
  { week: 10, day: 4, name: 'HIIT Ride', duration: 30, intensity: 'Hard-Max', notes: '30s max / 90s easy × 10' },
  { week: 10, day: 6, name: 'Long Ride', duration: 50, intensity: 'Moderate', notes: '' },
  { week: 11, day: 1, name: 'Tempo Ride', duration: 40, intensity: 'Mod-Hard', notes: '' },
  { week: 11, day: 2, name: 'Easy Spin', duration: 20, intensity: 'Easy', notes: 'Recovery' },
  { week: 11, day: 4, name: 'HIIT Ride', duration: 35, intensity: 'Hard-Max', notes: '30s max / 60s easy × 12' },
  { week: 11, day: 6, name: 'Long Ride', duration: 55, intensity: 'Moderate', notes: '' },
  { week: 12, day: 1, name: 'Tempo Ride', duration: 40, intensity: 'Mod-Hard', notes: 'Final week' },
  { week: 12, day: 2, name: 'Easy Spin', duration: 20, intensity: 'Easy', notes: 'Recovery' },
  { week: 12, day: 4, name: 'HIIT Ride', duration: 35, intensity: 'Hard-Max', notes: 'Peak intervals' },
  { week: 12, day: 6, name: 'Long Ride', duration: 60, intensity: 'Moderate', notes: 'Celebration ride — 60 min!' },
];

// ─── API ───

export function getSessionForDate(date) {
  const jsDay = date.getDay();
  const schedDay = jsDay === 0 ? 7 : jsDay; // 1=Mon..7=Sun

  // New repeating program (Mar 30, 2026+)
  const newDiff = Math.floor((date - NEW_PROGRAM_START) / (1000 * 60 * 60 * 24));
  if (newDiff >= 0) {
    const dayInCycle = newDiff % 28;
    const weekInCycle = Math.floor(dayInCycle / 7) + 1; // 1-4
    const cycleNumber = Math.floor(newDiff / 28) + 1;
    const session = MESOCYCLE.find(s => s.week === weekInCycle && s.day === schedDay);
    if (session) return { ...session, cycle: cycleNumber, isNew: true };
    return null;
  }

  // Legacy cycling program (Jan 3 – Mar 27, 2026)
  const oldDiff = Math.floor((date - LEGACY_PROGRAM_START) / (1000 * 60 * 60 * 24));
  if (oldDiff >= 0 && oldDiff < 84) {
    const week = Math.floor(oldDiff / 7) + 1;
    const session = CYCLING_SCHEDULE.find(s => s.week === week && s.day === schedDay);
    if (session) return { ...session, isNew: false };
    return null;
  }

  return null;
}

export function getPhase(session) {
  if (!session) return null;
  if (session.isNew) {
    // New program: mesocycle week phase
    return { ...PHASES[session.week], id: session.week };
  }
  // Legacy cycling program phases
  if (session.week <= 3) return { ...LEGACY_PHASES[1], id: 1 };
  if (session.week <= 8) return { ...LEGACY_PHASES[2], id: 2 };
  return { ...LEGACY_PHASES[3], id: 3 };
}

export function getTypeColor(session) {
  if (!session) return '#c084fc';
  if (session.type && TYPES[session.type]) return TYPES[session.type].color;
  // Legacy sessions are all cycling
  return '#38bdf8';
}

export function getTypeIcon(session) {
  if (!session) return '🏋️';
  if (session.type && TYPES[session.type]) return TYPES[session.type].icon;
  return '🚴';
}
