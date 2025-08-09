import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function EntryForm({ onSaved }: { onSaved: () => void }) {
  const [mood, setMood] = useState(5);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert('Sign in first'); setSaving(false); return; }

    const { error } = await supabase.from('entries').insert([
      { user_id: user.id, mood, note }
    ]);

    if (error) alert(error.message);
    else {
      setMood(5);
      setNote('');
      onSaved();
    }
    setSaving(false);
  };

  return (
    <form onSubmit={save} className="flex flex-wrap items-center gap-2">
      <label className="flex items-center gap-2">
        Mood
        <input type="range" min={1} max={10} value={mood}
               onChange={(e)=>setMood(parseInt(e.target.value))}
               className="w-48" />
        <span>{mood}</span>
      </label>
      <input
        placeholder="note (optional)"
        value={note}
        onChange={(e)=>setNote(e.target.value)}
        className="flex-1 min-w-60 border rounded px-3 py-2"
      />
      <button disabled={saving} className="bg-black text-white px-4 py-2 rounded">
        {saving ? 'Saving…' : 'Save'}
      </button>
    </form>
  );
}
