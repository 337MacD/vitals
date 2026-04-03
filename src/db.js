import Dexie from 'dexie';

export const db = new Dexie('VitalsDB');

db.version(1).stores({
  meals: '++id, date, meal, name',
  exercises: '++id, date, name',
  moodEntries: 'date',
  sleepEntries: 'date',
  settings: 'key',
});

db.version(2).stores({
  meals: '++id, date, meal, name',
  exercises: '++id, date, name',
  moodEntries: 'date',
  sleepEntries: 'date',
  weightEntries: 'date',
  settings: 'key',
});

// Version 3: no schema changes needed — nutrition is a non-indexed field on moodEntries
// meals table kept for backward compatibility (existing data preserved)
db.version(3).stores({
  meals: '++id, date, meal, name',
  exercises: '++id, date, name',
  moodEntries: 'date',
  sleepEntries: 'date',
  weightEntries: 'date',
  settings: 'key',
});

// ─── Meals (legacy — preserved for existing data / export) ───

export async function addMeal(date, meal, name, calories, protein, carbs, fat) {
  return db.meals.add({ date, meal, name, calories, protein, carbs, fat, createdAt: new Date().toISOString() });
}

export async function getMealsForDate(date) {
  return db.meals.where('date').equals(date).toArray();
}

export async function deleteMeal(id) {
  return db.meals.delete(id);
}

// ─── Exercises ───

export async function addExercise(date, exercise) {
  return db.exercises.add({ date, ...exercise, createdAt: new Date().toISOString() });
}

export async function getExercisesForDate(date) {
  return db.exercises.where('date').equals(date).toArray();
}

export async function deleteExercise(id) {
  return db.exercises.delete(id);
}

// ─── Mood (now includes optional nutrition rating) ───

export async function saveMoodEntry(date, level, tags, notes, nutrition) {
  return db.moodEntries.put({ date, level, tags, notes, nutrition, updatedAt: new Date().toISOString() });
}

export async function getMoodEntry(date) {
  return db.moodEntries.get(date);
}

export async function getMoodRange(startDate, endDate) {
  return db.moodEntries.where('date').between(startDate, endDate, true, true).toArray();
}

// ─── Sleep ───

export async function saveSleepEntry(date, bedtime, waketime, quality, interruptions, notes) {
  return db.sleepEntries.put({ date, bedtime, waketime, quality, interruptions, notes, updatedAt: new Date().toISOString() });
}

export async function getSleepEntry(date) {
  return db.sleepEntries.get(date);
}

export async function getSleepRange(startDate, endDate) {
  return db.sleepEntries.where('date').between(startDate, endDate, true, true).toArray();
}

// ─── Weight ───

export async function saveWeightEntry(date, weight, unit = 'lbs', notes = '') {
  return db.weightEntries.put({ date, weight, unit, notes, updatedAt: new Date().toISOString() });
}

export async function getWeightEntry(date) {
  return db.weightEntries.get(date);
}

export async function getWeightRange(startDate, endDate) {
  return db.weightEntries.where('date').between(startDate, endDate, true, true).sortBy('date');
}

export async function getAllWeightEntries() {
  return db.weightEntries.orderBy('date').toArray();
}

// ─── Settings ───

export async function getSetting(key, defaultValue) {
  const entry = await db.settings.get(key);
  return entry ? entry.value : defaultValue;
}

export async function setSetting(key, value) {
  return db.settings.put({ key, value });
}

// ─── Persistent Storage ───

export async function requestPersistentStorage() {
  if (navigator.storage && navigator.storage.persist) {
    const granted = await navigator.storage.persist();
    return granted;
  }
  return false;
}

// ─── Export ───

export async function exportAllData() {
  const [meals, exercises, moods, sleep, weight, settings] = await Promise.all([
    db.meals.toArray(),
    db.exercises.toArray(),
    db.moodEntries.toArray(),
    db.sleepEntries.toArray(),
    db.weightEntries.toArray(),
    db.settings.toArray(),
  ]);
  // Record export timestamp
  await setSetting('lastExportDate', new Date().toISOString());
  return { version: 3, exportedAt: new Date().toISOString(), meals, exercises, moods, sleep, weight, settings };
}

export async function importData(data) {
  if (data.meals?.length) await db.meals.bulkPut(data.meals);
  if (data.exercises?.length) await db.exercises.bulkPut(data.exercises);
  if (data.moods?.length) await db.moodEntries.bulkPut(data.moods);
  if (data.sleep?.length) await db.sleepEntries.bulkPut(data.sleep);
  if (data.weight?.length) await db.weightEntries.bulkPut(data.weight);
}

// ─── Daylio CSV Import ───

export async function importDaylioCSV(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return 0;
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
  const dateIdx = headers.findIndex(h => h === 'full_date' || h === 'date');
  const moodIdx = headers.findIndex(h => h === 'mood');
  const activitiesIdx = headers.findIndex(h => h === 'activities');
  const notesIdx = headers.findIndex(h => h === 'note' || h === 'notes');

  if (dateIdx === -1 || moodIdx === -1) return 0;

  const moodMap = { 'rad': 5, 'good': 4, 'meh': 3, 'bad': 2, 'awful': 1 };
  let count = 0;

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (!cols[dateIdx]) continue;
    const date = cols[dateIdx].replace(/"/g, '');
    const moodStr = (cols[moodIdx] || '').replace(/"/g, '').toLowerCase().trim();
    const level = moodMap[moodStr] || parseInt(moodStr) || 3;
    const tags = activitiesIdx >= 0 ? (cols[activitiesIdx] || '').replace(/"/g, '').split('|').map(t => t.trim()).filter(Boolean) : [];
    const notes = notesIdx >= 0 ? (cols[notesIdx] || '').replace(/"/g, '') : '';

    const normalized = normalizeDate(date);
    if (normalized) {
      await db.moodEntries.put({ date: normalized, level, tags, notes, updatedAt: new Date().toISOString() });
      count++;
    }
  }
  return count;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQuotes = !inQuotes; }
    else if (ch === ',' && !inQuotes) { result.push(current); current = ''; }
    else { current += ch; }
  }
  result.push(current);
  return result;
}

function normalizeDate(dateStr) {
  const iso = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (iso) return `${iso[1]}-${iso[2].padStart(2,'0')}-${iso[3].padStart(2,'0')}`;
  const us = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (us) return `${us[3]}-${us[1].padStart(2,'0')}-${us[2].padStart(2,'0')}`;
  try { const d = new Date(dateStr); if (!isNaN(d)) return d.toISOString().slice(0, 10); } catch {}
  return null;
}
