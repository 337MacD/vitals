// ─── Date Helpers ───

export function fmt(d) { return d.toISOString().slice(0, 10); }
export function sameDay(a, b) { return fmt(a) === fmt(b); }
export function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }

export function getMonthDays(year, month) {
  const first = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0).getDate();
  const startDow = first.getDay();
  const days = [];
  for (let i = 0; i < startDow; i++) days.push(null);
  for (let i = 1; i <= lastDay; i++) days.push(new Date(year, month, i));
  return days;
}

export function calcSleepDuration(bed, wake) {
  if (!bed || !wake) return null;
  const [bh, bm] = bed.split(':').map(Number);
  const [wh, wm] = wake.split(':').map(Number);
  let mins = (wh * 60 + wm) - (bh * 60 + bm);
  if (mins < 0) mins += 1440;
  return { hours: Math.floor(mins / 60), minutes: mins % 60, total: mins };
}

export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAY_ABBR = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
export const DAY_ABBR_MON = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// ─── Mood ───

export const MOODS = [
  { level: 5, emoji: '😄', label: 'Great', color: '#4ade80' },
  { level: 4, emoji: '🙂', label: 'Good', color: '#a3e635' },
  { level: 3, emoji: '😐', label: 'Okay', color: '#facc15' },
  { level: 2, emoji: '😔', label: 'Low', color: '#fb923c' },
  { level: 1, emoji: '😞', label: 'Rough', color: '#f87171' },
];

// ─── Nutrition (quick daily rating in mood check-in) ───

export const NUTRITION_LEVELS = [
  { level: 4, emoji: '🥗', label: 'Great', color: '#4ade80' },
  { level: 3, emoji: '🍽', label: 'Good', color: '#a3e635' },
  { level: 2, emoji: '🍕', label: 'Fair', color: '#facc15' },
  { level: 1, emoji: '🍫', label: 'Poor', color: '#fb923c' },
];

// ─── Sleep ───

export const QUALITY_LABELS = [
  { level: 1, label: 'Terrible', color: '#f87171', icon: '😫' },
  { level: 2, label: 'Poor', color: '#fb923c', icon: '😣' },
  { level: 3, label: 'Fair', color: '#facc15', icon: '😐' },
  { level: 4, label: 'Good', color: '#a3e635', icon: '😌' },
  { level: 5, label: 'Excellent', color: '#4ade80', icon: '😴' },
];

// ─── Activities ───

export const DEFAULT_ACTIVITY_TAGS = ['Work', 'Exercise', 'Social', 'Music', 'Reading', 'Outdoors', 'Cooking', 'Rest', 'Creative', 'Errands'];

export const EXERCISE_PRESETS = [
  { name: 'Walking', icon: '🚶', category: 'cardio' },
  { name: 'Running', icon: '🏃', category: 'cardio' },
  { name: 'Swimming', icon: '🏊', category: 'cardio' },
  { name: 'Yoga', icon: '🧘', category: 'flexibility' },
  { name: 'Stretching', icon: '🤸', category: 'flexibility' },
  { name: 'Push-ups', icon: '💪', category: 'strength' },
  { name: 'Pull-ups', icon: '🏋️', category: 'strength' },
  { name: 'Bodyweight Circuit', icon: '⚡', category: 'strength' },
  { name: 'Hiking', icon: '🥾', category: 'cardio' },
  { name: 'Rowing', icon: '🚣', category: 'cardio' },
];

export const ICON_OPTIONS = ['🏃', '🚶', '🏋️', '🧘', '🤸', '🥾', '🏊', '🚣', '⚡', '🎯', '🏀', '⚽', '🎾', '🥊', '🧗', '🛹', '🏂', '🚴'];
