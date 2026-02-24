import { useState, useEffect, useCallback } from 'react';
import { fmt } from './helpers';
import { getMealsForDate, getExercisesForDate, getMoodEntry, getSleepEntry, getWeightEntry } from './db';
import Calendar from './components/Calendar';
import Dashboard from './components/Dashboard';
import Calories from './components/Calories';
import Workout from './components/Workout';
import Sleep from './components/Sleep';
import Weight from './components/Weight';
import Mood from './components/Mood';
import ExportView from './components/Export';

const TABS = [
  { id: 'dashboard', label: 'Hub', icon: '◉' },
  { id: 'calories', label: 'Fuel', icon: '◎' },
  { id: 'workout', label: 'Train', icon: '△' },
  { id: 'weight', label: 'Weight', icon: '⊘' },
  { id: 'sleep', label: 'Sleep', icon: '◐' },
  { id: 'mood', label: 'Mood', icon: '◈' },
];

export default function App() {
  const [activeTab, setActiveTabState] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  // Data state
  const [meals, setMeals] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [moodEntry, setMoodEntry] = useState(null);
  const [sleepEntry, setSleepEntry] = useState(null);
  const [weightEntry, setWeightEntry] = useState(null);
  const [allExercises, setAllExercises] = useState([]); // for calendar dots
  const [reloadKey, setReloadKey] = useState(0);

  const dateKey = fmt(selectedDate);
  const reload = useCallback(() => setReloadKey(k => k + 1), []);

  const setActiveTab = (tab, date) => {
    setActiveTabState(tab);
    if (date) setSelectedDate(date);
  };

  // Load data for selected date
  useEffect(() => {
    getMealsForDate(dateKey).then(setMeals);
    getExercisesForDate(dateKey).then(r => {
      setExercises(r); // current date exercises
    });
    getMoodEntry(dateKey).then(setMoodEntry);
    getSleepEntry(dateKey).then(setSleepEntry);
    getWeightEntry(dateKey).then(setWeightEntry);
  }, [dateKey, reloadKey]);

  // Load all exercises for calendar dots (lightweight)
  useEffect(() => {
    import('./db').then(({ db }) => {
      db.exercises.toArray().then(setAllExercises);
    });
  }, [reloadKey]);

  return (
    <div className="app-shell">
      {showCalendar && (
        <Calendar
          selectedDate={selectedDate}
          onSelect={d => setSelectedDate(d)}
          onClose={() => setShowCalendar(false)}
          exercises={allExercises}
        />
      )}

      {/* Status bar */}
      <div className="status-bar">
        <span className="mono">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
        <span className="app-title">Vitals</span>
        <span style={{ fontSize: 10 }}>●●●</span>
      </div>

      {/* Content */}
      <div className="content">
        {activeTab === 'dashboard' && (
          <Dashboard setActiveTab={setActiveTab} selectedDate={selectedDate}
            setShowCalendar={setShowCalendar} exercises={allExercises}
            meals={meals} moodEntry={moodEntry} sleepEntry={sleepEntry} weightEntry={weightEntry} />
        )}
        {activeTab === 'calories' && (
          <Calories meals={meals} selectedDate={selectedDate} reload={reload} />
        )}
        {activeTab === 'workout' && (
          <Workout selectedDate={selectedDate} setShowCalendar={setShowCalendar}
            exercises={allExercises} reload={reload} />
        )}
        {activeTab === 'weight' && (
          <Weight weightEntry={weightEntry} selectedDate={selectedDate} reload={reload} />
        )}
        {activeTab === 'sleep' && (
          <Sleep sleepEntry={sleepEntry} selectedDate={selectedDate} reload={reload} />
        )}
        {activeTab === 'mood' && (
          <Mood moodEntry={moodEntry} selectedDate={selectedDate} reload={reload} />
        )}
        {activeTab === 'export' && <ExportView />}
      </div>

      {/* Tab bar */}
      <div className="tab-bar-container">
        <div className="tab-bar">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTabState(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}>
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
