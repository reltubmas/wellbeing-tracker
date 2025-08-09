import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

type Entry = {
  id: string;
  created_at: string;
  mood: number;
  note: string | null;
};

export default function EntriesList() {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setEntries([]); return; }
    const { data, error } = await supabase
      .from('entries')
      .select('id,created_at,mood,note')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setEntries(data as Entry[]);
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Entries</h2>
        <button onClick={load} className="border rounded px-2 py-1 text-sm">Refresh</button>
      </div>
      {error && <div className="text-red-600">Error: {error}</div>}
      {entries === null && <div>Loading…</div>}
      {entries?.length === 0 && <div>No entries yet.</div>}
      <ul className="space-y-2">
        {entries?.map(e => (
          <li key={e.id} className="border rounded p-3">
            <div className="text-xs opacity-70">{new Date(e.created_at).toLocaleString()}</div>
            <div>Mood: {e.mood}</div>
            {e.note && <div>{e.note}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
