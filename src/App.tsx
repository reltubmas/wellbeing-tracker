
import React, { useMemo, useState } from 'react';
import RecordForm, { Schema } from './components/RecordForm';
import RecordList from './components/RecordList';
import { loadCollection, upsert, remove, exportAll, importAll, clearAll } from './lib/storage';

type EntityKey =
  | 'mood' | 'sleep' | 'fluid' | 'food' | 'urine' | 'stool' | 'journal'
  | 'bloodTest' | 'measurements' | 'metrics' | 'pain' | 'healthlensScore';

const SCHEMAS: Record<EntityKey, Schema> = {
  mood: {
    collection: 'mood',
    title: 'Mood',
    fields: [
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'rating', label: 'Rating (1-10)', type: 'number' },
      { name: 'tags', label: 'Tags (comma-separated)', type: 'text', placeholder: 'anxious, focused' },
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
      { name: 'frequency', label: 'Frequency (per day)', type: 'number' },
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
      { name: 'weightKg', label: 'Weight (kg)', type: 'number' },
      { name: 'bodyFatPct', label: 'Body Fat (%)', type: 'number' },
      { name: 'waistCm', label: 'Waist (cm)', type: 'number' },
      { name: 'bpSys', label: 'BP Systolic', type: 'number' },
      { name: 'bpDia', label: 'BP Diastolic', type: 'number' },
      { name: 'hrBpm', label: 'Heart Rate (bpm)', type: 'number' },
    ],
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
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  healthlensScore: {
    collection: 'healthlensScore',
    title: 'Healthlens Score',
    fields: [
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'score', label: 'Score (0-100)', type: 'number' },
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
  const [editing, setEditing] = useState<any | null>(null);
  const [refresh, setRefresh] = useState(0);

  const items = useMemo(() => {
    const list = loadCollection(schema.collection);
    // Sort newest first by date or createdAt
    return [...list].sort((a,b) => String(b.date || b.createdAt).localeCompare(String(a.date || a.createdAt)));
  }, [schema.collection, refresh]);

  function handleSave(values: any) {
    const payload = editing ? { ...editing, ...values } : values;
    upsert(schema.collection, payload);
    setEditing(null);
    setRefresh(x => x + 1);
  }

  function handleDelete(id: string) {
    if (confirm('Delete this record?')) {
      remove(schema.collection, id);
      setRefresh(x => x + 1);
    }
  }

  function exportData() {
    const blob = new Blob([exportAll()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wellbeing-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importAll(String(reader.result));
        setRefresh(x => x + 1);
        alert('Import complete.');
      } catch (e) {
        alert('Import failed: ' + (e as Error).message);
      }
    };
    reader.readAsText(file);
  }

  function resetAll() {
    if (confirm('This clears ALL saved data. Continue?')) {
      clearAll();
      setRefresh(x => x + 1);
    }
  }

  const columns = schema.fields
    .filter(f => f.name !== 'notes' && f.type !== 'textarea')
    .slice(0, 4) // show up to 4 columns + date
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
          <RecordList items={items} onEdit={setEditing} onDelete={handleDelete} columns={tableColumns} />
        </section>
      </main>

      <footer className="text-center text-xs text-slate-500 py-8">
        Data is stored locally in your browser (no account required). Use Export/Import to move devices.
      </footer>
    </div>
  );
};

export default App;
