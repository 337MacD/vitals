import { useState, useRef } from 'react';
import { exportAllData, importDaylioCSV } from '../db';

export default function ExportView() {
  const [status, setStatus] = useState('');
  const fileRef = useRef(null);

  const handleExportJSON = async () => {
    try {
      const data = await exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vitals-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus('JSON exported successfully!');
    } catch (e) {
      setStatus('Export failed: ' + e.message);
    }
  };

  const handleExportCSV = async () => {
    try {
      const data = await exportAllData();
      const sections = [];

      // Meals CSV
      if (data.meals.length) {
        sections.push('--- MEALS ---');
        sections.push('date,meal,name,calories,protein,carbs,fat');
        data.meals.forEach(m => sections.push(`${m.date},${m.meal},"${m.name}",${m.calories},${m.protein},${m.carbs},${m.fat}`));
      }

      // Exercises CSV
      if (data.exercises.length) {
        sections.push('\n--- EXERCISES ---');
        sections.push('date,name,icon,duration,notes');
        data.exercises.forEach(e => sections.push(`${e.date},"${e.name}",${e.icon},${e.duration},"${e.notes || ''}"`));
      }

      // Mood CSV
      if (data.moods.length) {
        sections.push('\n--- MOOD ---');
        sections.push('date,level,tags,notes');
        data.moods.forEach(m => sections.push(`${m.date},${m.level},"${(m.tags || []).join('|')}","${m.notes || ''}"`));
      }

      // Sleep CSV
      if (data.sleep.length) {
        sections.push('\n--- SLEEP ---');
        sections.push('date,bedtime,waketime,quality,interruptions,notes');
        data.sleep.forEach(s => sections.push(`${s.date},${s.bedtime},${s.waketime},${s.quality},${s.interruptions},"${s.notes || ''}"`));
      }

      // Weight CSV
      if (data.weight?.length) {
        sections.push('\n--- WEIGHT ---');
        sections.push('date,weight,unit,notes');
        data.weight.forEach(w => sections.push(`${w.date},${w.weight},${w.unit},"${w.notes || ''}"`));
      }

      const blob = new Blob([sections.join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vitals-export-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus('CSV exported successfully!');
    } catch (e) {
      setStatus('Export failed: ' + e.message);
    }
  };

  const handleImportDaylio = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const count = await importDaylioCSV(text);
      setStatus(`Imported ${count} Daylio entries!`);
    } catch (err) {
      setStatus('Import failed: ' + err.message);
    }
    e.target.value = '';
  };

  const handleImportJSON = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const { importData } = await import('../db');
      await importData(data);
      setStatus('JSON backup restored!');
    } catch (err) {
      setStatus('Import failed: ' + err.message);
    }
    e.target.value = '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 100 }}>
      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>Data Management</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Export, backup, and import your data</div>
      </div>

      {status && (
        <div style={{
          background: status.includes('fail') ? 'rgba(248,113,113,0.1)' : 'rgba(74,222,128,0.1)',
          border: `1px solid ${status.includes('fail') ? 'rgba(248,113,113,0.2)' : 'rgba(74,222,128,0.2)'}`,
          borderRadius: 12, padding: '12px 16px', fontSize: 13,
          color: status.includes('fail') ? '#f87171' : '#4ade80'
        }}>{status}</div>
      )}

      {/* Export */}
      <div>
        <div className="label-xs" style={{ fontWeight: 600, marginBottom: 10, paddingLeft: 4 }}>Export</div>
        <button onClick={handleExportJSON} className="card" style={{ width: '100%', padding: '16px 18px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <span style={{ fontSize: 22 }}>💾</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Full Backup (JSON)</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Complete database — can be restored later</div>
          </div>
        </button>
        <button onClick={handleExportCSV} className="card" style={{ width: '100%', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <span style={{ fontSize: 22 }}>📊</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Export CSV</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>For MATLAB analysis or spreadsheet tools</div>
          </div>
        </button>
      </div>

      {/* Import */}
      <div>
        <div className="label-xs" style={{ fontWeight: 600, marginBottom: 10, paddingLeft: 4 }}>Import</div>

        <label className="card" style={{ width: '100%', padding: '16px 18px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <span style={{ fontSize: 22 }}>📱</span>
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Import Daylio CSV</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Daylio → Export → CSV</div>
          </div>
          <input type="file" accept=".csv" onChange={handleImportDaylio} style={{ display: 'none' }} />
        </label>

        <label className="card" style={{ width: '100%', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <span style={{ fontSize: 22 }}>📂</span>
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Restore Backup (JSON)</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Restore from a previous export</div>
          </div>
          <input type="file" accept=".json" onChange={handleImportJSON} style={{ display: 'none' }} />
        </label>
      </div>

      {/* Info */}
      <div className="card" style={{ padding: '14px 18px' }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
          All data is stored locally on this device using IndexedDB.
          Regular backups are recommended — export JSON weekly and save to your Mac via AirDrop or Files.
        </div>
      </div>
    </div>
  );
}
