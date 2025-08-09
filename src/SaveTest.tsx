import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function SaveTest() {
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert('Sign in first'); setSaving(false); return; }

    const { error } = await supabase.from('entries').insert([
      { user_id: user.id, mood: 7, note: 'hello db' }
    ]);

    if (error) alert(error.message); else alert('Saved!');
    setSaving(false);
  };

  return <button onClick={save} disabled={saving} className="border px-3 py-2 rounded">{saving ? 'Saving…' : 'Save test entry'}</button>;
}
