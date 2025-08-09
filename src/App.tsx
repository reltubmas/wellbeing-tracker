import AuthGate from './components/AuthGate';

console.log('BOOT: App.tsx (Supabase build)');

// src/App.tsx
import React, { useMemo, useState, useEffect } from 'react';
import RecordForm, { Schema } from './components/RecordForm';
import RecordList from './components/RecordList';

import {
  listRecords, addRecord, updateRecord, deleteRecord,
  exportCollection, importCollection, type RecordRow
} from './data/api';

type EntityKey =
  | 'mood' | 'sleep' | 'fluid' | 'food' | 'urine' | 'stool' | 'journal'
  | 'bloodTest' | 'measurements' | 'bloodPressure' | 'metrics' | 'pain' | 'healthlensScore' | 'microGoals';

const SCHEMAS: Record<EntityKey, Schema> = {
  mood: {
    collection: 'mood',
    title: 'Mood',
    fields: [
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'moodType', label: 'Mood Type', type: 'select', options: ['High Enery Pleasant', 'High Energy Unpleasant', 'Low Energy Pleasant', 'Low Energy Unpleasant'] },
      { name: 'mood', label: 'Mood', type: 'text', placeholder: 'anxious, focused' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  sleep: {
    collection: 'sleep',
    title: 'Sleep',
    fields: [
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'bedtime', label: 'Bedtime', type: 'time' },
      { name: 'waketime', label: 'Wake time', type: 'time' },
      { name: 'durationHours', label: 'Duration (hours)', type: 'number' },
      { name: 'quality', label: 'Quality (1-10)', type: 'number' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  fluid: {
    collection: 'fluid',
    title: 'Fluid',
    fields: [
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'waterMl', label: 'Water (ml)', type: 'number' },
      { name: 'caffeineMl', label: 'Caffeine (ml)', type: 'number' },
      { name: 'alcoholUnits', label: 'Alcohol (units)', type: 'number' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  food: {
    collection: 'food',
    title: 'Food',
    fields: [
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'mealType', label: 'Meal Type', type: 'select', options: ['Breakfast', 'Lunch', 'Dinner', 'Snack'] },
      { name: 'description', label: 'Description', type: 'text' },
      { name: 'calories', label: 'Calories', type: 'number' },
      { name: 'proteinG', label: 'Protein (g)', type: 'number' },
      { name: 'fatsG', label: 'Fats (g)', type: 'number' },
      { name: 'carbohydratesG', label: 'Carbohydrates (g)', type: 'number' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  urine: {
    collection: 'urine',
    title: 'Urine',
    fields: [
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'color', label: 'Color', type: 'select', options: ['Clear', 'Pale', 'Yellow', 'Dark Yellow', 'Amber'] },
      { name: 'clarity', label: 'Clarity', type: 'select', options: ['Clear', 'Slightly Cloudy', 'Cloudy'] },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  stool: {
    collection: 'stool',
    title: 'Stool',
    fields: [
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'bristol', label: 'Bristol Scale (1-7)', type: 'number' },
      { name: 'blood', label: 'Blood present', type: 'checkbox' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  journal: {
    collection: 'journal',
    title: 'Journal',
    fields: [
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'content', label: 'Content', type: 'textarea' },
    ],
  },
  bloodTest: {
    collection: 'bloodTest',
    title: 'Blood Test',
    fields: [
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'test', label: 'Test Name', type: 'text' },
      { name: 'value', label: 'Value', type: 'number' },
      { name: 'unit', label: 'Unit', type: 'text' },
      { name: 'refRange', label: 'Reference Range', type: 'text' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  measurements: {
    collection: 'measurements',
    title: 'Measurements',
    fields: [
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'waistIn', label: 'Waist (in)', type: 'number' },
      { name: 'chestIn', label: 'Chest (in)', type: 'number' },
      { name: 'bicepsIn', label: 'Biceps (in)', type: 'number' },
      { name: 'thighsIn', label: 'Thighs (in)', type: 'number' },
      { name: 'calvesIn', label: 'Calves (in)', type: 'number' },
      { name: 'neckIn', label: 'Neck (in)', type: 'number' },
      { name: 'weightKg', label: 'Weight (kg)', type: 'number' },
      { name: 'burpeesMin', label: 'Burpees (per min)', type: 'number' },
      { name: '5kRunTime', label: '5km Run Time', type: 'time' },
      { name: 'bleepTestLvl', label: 'Bleep Test Level', type: 'number' },
      { name: 'heartRateRec', label: 'Heart Rate Recovery (in bpm)', type: 'number' },
      { name: 'oneSquatRep', label: 'One Squat Rep (x BW)', type: 'number' },
      { name: 'oneBenchRep', label: 'One Bench Rep (x BW)', type: 'number' },
      { name: 'verticalJumpIn', label: 'Vertical Jump (in)', type: 'number' },
    ],
  },
  bloodPressure: {
    collection: 'bloodPressure',
    title: 'Blood Pressure',
    fields: [
      { name: 'bpSys', label: 'BP Systolic', type: 'number' },
      { name: 'bpDia', label: 'BP Diastolic', type: 'number' },
    ]
  },
  metrics: {
    collection: 'metrics',
    title: 'Custom Metrics',
    fields: [
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'name', label: 'Metric Name', type: 'text' },
      { name: 'value', label: 'Value', type: 'number' },
      { name: 'unit', label: 'Unit', type: 'text' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  pain: {
    collection: 'pain',
    title: 'Pain',
    fields: [
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'intensity', label: 'Intensity (0-10)', type: 'number' },
      { name: 'durationMin', label: 'Duration (minutes)', type: 'number' },
      { name: 'triggers', label: 'Triggers', type: 'text' },
      { name: 'intervention', label: 'Intervention', type: 'text' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  healthlensScore: {
    collection: 'healthlensScore',
    title: 'Healthlens Score',
    fields: [
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'respiratoryRate', label: 'Resp Rate (bpm)', type: 'number' },
      { name: 'bpSysHL', label: 'BP Systolic', type: 'number' },
      { name: 'bpDiaHL', label: 'BP Diastolic', type: 'number' },
      { name: 'cardiacWorkloadDB', label: 'Cardiac Workload (dB)', type: 'number' },
      { name: 'CVDiseaseRisk', label: 'Cardiovascular disease risk (%)', type: 'number' },
      { name: 'heartAttackRisk', label: 'Heart Attack Risk (%)', type: 'number' },
      { name: 'strokeRisk', label: 'Stroke Risk (%)', type: 'number' },
      { name: 'heartRateBPM', label: 'Heart Rate (bpm)', type: 'number' },
      { name: 'heartRateVariabilityMS', label: 'Heart Rate Variability (ms)', type: 'number' },
      { name: 'mentalWellbeing', label: 'Mental Wellbeing', type: 'number' },
      { name: 'stressIndex', label: 'Stress Index', type: 'number' },
      { name: 'vascularCapacity', label: 'Vascular Capacity', type: 'number' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  microGoals: {
  collection: 'microGoals',
  title: 'Micro Goals',
  defaultValues: {
    monday: false, tuesday: false, wednesday: false,
    thursday: false, friday: false, saturday: false, sunday: false,
  },
  fields: [
    { name: 'weekStart', label: 'Week starting', type: 'date' },
    { name: 'goalText', label: 'Goal', type: 'text', placeholder: 'e.g., 5 days of movement' },
    { name: 'monday', label: 'Monday', type: 'checkbox' },
    { name: 'tuesday', label: 'Tuesday', type: 'checkbox' },
    { name: 'wednesday', label: 'Wednesday', type: 'checkbox' },
    { name: 'thursday', label: 'Thursday', type: 'checkbox' },
    { name: 'friday', label: 'Friday', type: 'checkbox' },
    { name: 'saturday', label: 'Saturday', type: 'checkbox' },
    { name: 'sunday', label: 'Sunday', type: 'checkbox' },
    { name: 'notes', label: 'Notes', type: 'textarea' },
  ],
},
};




function prettyDate(iso: string | undefined) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString();
  } catch {
    return String(iso);
  }
}

const App: React.FC = () => {
  const [active, setActive] = useState<EntityKey>('mood');
  const schema = SCHEMAS[active];
  const [editing, setEditing] = useState<RecordRow | null>(null);
  const [items, setItems] = useState<RecordRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Load whenever collection changes or after a save/delete
  async function load() {
    setLoading(true);
    try {
      const rows = await listRecords(schema.collection);
      setItems(rows);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [schema.collection]);

  async function handleSave(values: any) {
    if (editing) {
      const updated = await updateRecord(editing.id, values);
      setItems(prev => prev.map(r => (r.id === editing.id ? updated : r)));
      setEditing(null);
    } else {
      const created = await addRecord(schema.collection, values);
      setItems(prev => [created, ...prev]);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this record?')) return;
    await deleteRecord(id);
    setItems(prev => prev.filter(r => r.id !== id));
  }

  async function exportData() {
    const json = await exportCollection(schema.collection);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wellbeing-${schema.collection}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importData(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      await importCollection(schema.collection, text);
      await load();
      alert('Import complete.');
    } catch (e: any) {
      alert('Import failed: ' + (e.message ?? String(e)));
    } finally {
      ev.target.value = '';
    }
  }

  async function resetAll() {
    // Soft "reset": delete all rows currently shown
    if (!confirm(`Delete ALL ${schema.title} records?`)) return;
    for (const r of items) await deleteRecord(r.id);
    await load();
  }

  const columns = schema.fields
    .filter(f => f.name !== 'notes' && f.type !== 'textarea')
    .slice(0, 4)
    .map(f => ({
      key: f.name,
      label: f.label,
      formatter: (v: any) => String(v ?? '')
    }));

  const tableColumns = [
    { key: 'date', label: 'Date', formatter: (v: any) => prettyDate(v) },
    ...columns
  ];

  return (
  <AuthGate>
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Wellbeing Tracker</h1>
        <div className="menu">
          <button className="btn" onClick={exportData}>Export</button>
          <label className="btn cursor-pointer">
            Import <input type="file" className="hidden" accept="application/json" onChange={importData} />
          </label>
          <button className="btn" onClick={resetAll}>Reset</button>
        </div>
      </header>

      <nav className="card">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(SCHEMAS) as EntityKey[]).map((k) => (
            <button
              key={k}
              className={`badge ${active === k ? 'bg-black text-white' : ''}`}
              onClick={() => { setActive(k); setEditing(null); }}
              title={SCHEMAS[k].title}
            >
              {SCHEMAS[k].title}
            </button>
          ))}
        </div>
      </nav>

      <main className="grid gap-4 md:grid-cols-2">
        <section className="card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">{editing ? `Edit ${schema.title}` : `Add ${schema.title}`}</h2>
            {editing && <button className="btn" onClick={() => setEditing(null)}>New</button>}
          </div>
          <RecordForm schema={schema} initial={editing ?? undefined} onSave={handleSave} onCancel={() => setEditing(null)} />
        </section>

        <section className="card md:row-span-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">{schema.title} Records</h2>
            <span className="text-xs text-slate-500">{items.length} total</span>
          </div>
          <RecordList items={items} onEdit={setEditing} onDelete={handleDelete} columns={tableColumns as any} />
        </section>
      </main>

      <footer className="text-center text-xs text-slate-500 py-8">
        Data is stored securely in the cloud (your account only). Export/Import moves a single category between devices.
      </footer>
    </div>
  </AuthGate>
  );
};

export default App;
