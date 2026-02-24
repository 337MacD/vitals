export const PROGRAM_START = new Date(2026, 0, 3); // Jan 3, 2026

export const PHASES = {
  1: { name: 'Habit Formation', color: '#4ade80' },
  2: { name: 'Base Building', color: '#38bdf8' },
  3: { name: 'Structured Intensity', color: '#f472b6' },
};

export function getPhase(week) {
  if (week <= 3) return { ...PHASES[1], id: 1 };
  if (week <= 8) return { ...PHASES[2], id: 2 };
  return { ...PHASES[3], id: 3 };
}

export const CYCLING_SCHEDULE = [
  // Phase 1: Habit Formation
  { week: 1, day: 2, name: 'Ride 1', duration: 15, intensity: 'Easy', notes: 'Find comfortable seat position' },
  { week: 1, day: 4, name: 'Ride 2', duration: 15, intensity: 'Easy', notes: 'Aim for 70-85 RPM cadence' },
  { week: 1, day: 6, name: 'Ride 3', duration: 15, intensity: 'Easy-Mod', notes: 'Increase resistance mid-ride if comfortable' },
  { week: 2, day: 2, name: 'Ride 1', duration: 18, intensity: 'Easy-Mod', notes: '' },
  { week: 2, day: 4, name: 'Ride 2', duration: 18, intensity: 'Easy-Mod', notes: '' },
  { week: 2, day: 6, name: 'Ride 3', duration: 20, intensity: 'Moderate', notes: 'Hold steady cadence throughout' },
  { week: 3, day: 2, name: 'Ride 1', duration: 20, intensity: 'Moderate', notes: '' },
  { week: 3, day: 4, name: 'Ride 2', duration: 20, intensity: 'Moderate', notes: '' },
  { week: 3, day: 6, name: 'Ride 3', duration: 20, intensity: 'Moderate', notes: 'End-of-phase checkpoint' },
  // Phase 2: Base Building
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
  // Phase 3: Structured Intensity
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

export function getSessionForDate(date) {
  const diff = Math.floor((date - PROGRAM_START) / (1000 * 60 * 60 * 24));
  if (diff < 0 || diff >= 84) return null;
  const week = Math.floor(diff / 7) + 1;
  const jsDay = date.getDay();
  const schedDay = jsDay === 0 ? 7 : jsDay; // 1=Mon..7=Sun
  return CYCLING_SCHEDULE.find(s => s.week === week && s.day === schedDay) || null;
}
