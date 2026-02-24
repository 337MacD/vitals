import { useState } from 'react';
import { MiniBar, MacroRing } from './ui';
import { addMeal, deleteMeal } from '../db';
import { fmt } from '../helpers';

const COMMON_FOODS = [
  { name: 'Chicken breast (150g)', calories: 248, protein: 46, carbs: 0, fat: 5 },
  { name: 'Brown rice (1 cup)', calories: 216, protein: 5, carbs: 45, fat: 2 },
  { name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0 },
  { name: 'Eggs (2 large)', calories: 143, protein: 13, carbs: 1, fat: 10 },
  { name: 'Oatmeal (1 cup)', calories: 154, protein: 5, carbs: 27, fat: 3 },
  { name: 'Greek yogurt (175g)', calories: 100, protein: 17, carbs: 6, fat: 1 },
  { name: 'Salmon fillet (150g)', calories: 280, protein: 34, carbs: 0, fat: 15 },
  { name: 'Mixed salad (large)', calories: 35, protein: 2, carbs: 7, fat: 0 },
  { name: 'Olive oil (1 tbsp)', calories: 119, protein: 0, carbs: 0, fat: 14 },
  { name: 'Apple', calories: 95, protein: 0, carbs: 25, fat: 0 },
  { name: 'Coffee with cream', calories: 45, protein: 1, carbs: 2, fat: 4 },
  { name: 'Whole wheat bread (2 slices)', calories: 160, protein: 8, carbs: 28, fat: 2 },
];

function AddMealModal({ mealType, date, onClose, onSave }) {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [search, setSearch] = useState('');

  const filtered = search ? COMMON_FOODS.filter(f => f.name.toLowerCase().includes(search.toLowerCase())) : COMMON_FOODS;

  const selectFood = (food) => {
    setName(food.name);
    setCalories(String(food.calories));
    setProtein(String(food.protein));
    setCarbs(String(food.carbs));
    setFat(String(food.fat));
  };

  const handleSave = async () => {
    if (!name.trim() || !calories) return;
    await addMeal(date, mealType, name.trim(), parseInt(calories) || 0, parseInt(protein) || 0, parseInt(carbs) || 0, parseInt(fat) || 0);
    onSave();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: '85vh', overflowY: 'auto' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16, textAlign: 'center' }}>
          Add to {mealType}
        </div>

        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search common foods..."
          className="input" style={{ marginBottom: 12 }} />

        {!name && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16, maxHeight: 200, overflowY: 'auto' }}>
            {filtered.map((f, i) => (
              <button key={i} onClick={() => selectFood(f)} className="card" style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#fff' }}>{f.name}</span>
                <span className="mono" style={{ fontSize: 12, color: '#818cf8' }}>{f.calories}</span>
              </button>
            ))}
          </div>
        )}

        <input value={name} onChange={e => setName(e.target.value)} placeholder="Food name" className="input" style={{ marginBottom: 8 }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
          <div>
            <div className="label-xs" style={{ marginBottom: 4, paddingLeft: 4 }}>Calories</div>
            <input value={calories} onChange={e => setCalories(e.target.value.replace(/\D/g, ''))} placeholder="0" className="input mono" style={{ fontSize: 18 }} />
          </div>
          <div>
            <div className="label-xs" style={{ marginBottom: 4, paddingLeft: 4 }}>Protein (g)</div>
            <input value={protein} onChange={e => setProtein(e.target.value.replace(/\D/g, ''))} placeholder="0" className="input mono" />
          </div>
          <div>
            <div className="label-xs" style={{ marginBottom: 4, paddingLeft: 4 }}>Carbs (g)</div>
            <input value={carbs} onChange={e => setCarbs(e.target.value.replace(/\D/g, ''))} placeholder="0" className="input mono" />
          </div>
          <div>
            <div className="label-xs" style={{ marginBottom: 4, paddingLeft: 4 }}>Fat (g)</div>
            <input value={fat} onChange={e => setFat(e.target.value.replace(/\D/g, ''))} placeholder="0" className="input mono" />
          </div>
        </div>

        <button onClick={handleSave} className={`btn-full ${name && calories ? 'btn-primary' : 'btn-disabled'}`}>
          Add Food
        </button>
      </div>
    </div>
  );
}

export default function Calories({ meals, selectedDate, reload }) {
  const [addingMeal, setAddingMeal] = useState(null);
  const totalCal = meals.reduce((s, m) => s + (m.calories || 0), 0);
  const totalP = meals.reduce((s, m) => s + (m.protein || 0), 0);
  const totalC = meals.reduce((s, m) => s + (m.carbs || 0), 0);
  const totalF = meals.reduce((s, m) => s + (m.fat || 0), 0);

  const grouped = { breakfast: [], lunch: [], dinner: [], snack: [] };
  meals.forEach(m => { if (grouped[m.meal]) grouped[m.meal].push(m); });

  const handleDelete = async (id) => {
    await deleteMeal(id);
    reload();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 100 }}>
      {addingMeal && <AddMealModal mealType={addingMeal} date={fmt(selectedDate)} onClose={() => setAddingMeal(null)} onSave={reload} />}

      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <div className="mono" style={{ fontSize: 40, fontWeight: 700, color: '#fff' }}>{totalCal}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>of 2,200 kcal</div>
        <div style={{ maxWidth: 200, margin: '10px auto 0' }}><MiniBar value={totalCal} max={2200} color="#818cf8" height={6} /></div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
        <MacroRing value={totalP} max={150} color="#818cf8" size={56} label="Protein" />
        <MacroRing value={totalC} max={250} color="#c084fc" size={56} label="Carbs" />
        <MacroRing value={totalF} max={80} color="#f472b6" size={56} label="Fat" />
      </div>

      {Object.entries(grouped).map(([meal, items]) => (
        <div key={meal}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '0 4px' }}>
            <span className="label-xs" style={{ fontWeight: 600 }}>{meal}</span>
            <button className="btn-sm btn-accent" onClick={() => setAddingMeal(meal)}>+ Add</button>
          </div>
          {items.length > 0 ? items.map(item => (
            <div key={item.id} className="card" style={{ padding: '12px 16px', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }} onClick={() => handleDelete(item.id)}>
                <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>{item.name}</div>
                <div className="mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                  P:{item.protein}g · C:{item.carbs}g · F:{item.fat}g
                </div>
              </div>
              <span className="mono" style={{ fontSize: 16, fontWeight: 700, color: '#818cf8' }}>{item.calories}</span>
            </div>
          )) : (
            <div style={{ border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>
              No items logged
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
