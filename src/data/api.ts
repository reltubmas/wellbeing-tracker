// src/data/api.ts
import { supabase } from '../supabaseClient';

export type RecordRow = {
  id: string;
  created_at: string;
  collection: string;
  date: string | null;
  // plus flattened fields from data jsonb
  [k: string]: any;
};

async function getUserId() {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

// Convert DB row { data: {...} } -> flattened { ...data, date, id, created_at }
function flatten(row: any): RecordRow {
  const { id, created_at, collection, date, data: payload } = row;
  return { id, created_at, collection, date, ...(payload ?? {}) };
}

export async function listRecords(collection: string): Promise<RecordRow[]> {
  const uid = await getUserId();
  if (!uid) return [];
  const { data, error } = await supabase
    .from('records')
    .select('id, created_at, collection, date, data')
    .eq('collection', collection)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(flatten);
}

export async function addRecord(collection: string, values: any): Promise<RecordRow> {
  const uid = await getUserId();
  if (!uid) throw new Error('Not signed in');
  const payload = {
    user_id: uid,
    collection,
    date: values.date ?? null,
    data: { ...values }, // keep everything, including 'date' (harmless duplicate)
  };
  const { data, error } = await supabase
    .from('records')
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  return flatten(data);
}

export async function updateRecord(id: string, values: any): Promise<RecordRow> {
  // We update both the top-level date and the data blob
  const patch = {
    date: values.date ?? null,
    data: { ...values },
  };
  const { data, error } = await supabase
    .from('records')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return flatten(data);
}

export async function deleteRecord(id: string): Promise<void> {
  const { error } = await supabase.from('records').delete().eq('id', id);
  if (error) throw error;
}

// Simple export/import for the ACTIVE collection
export async function exportCollection(collection: string): Promise<string> {
  const rows = await listRecords(collection);
  return JSON.stringify(rows, null, 2);
}

export async function importCollection(collection: string, json: string): Promise<void> {
  const uid = await getUserId();
  if (!uid) throw new Error('Not signed in');
  const parsed = JSON.parse(json);
  if (!Array.isArray(parsed)) throw new Error('Invalid file format');
  const inserts = parsed.map((r: any) => ({
    user_id: uid,
    collection,
    date: r.date ?? null,
    data: { ...r },
  }));
  // Insert in batches to be safe
  while (inserts.length) {
    const chunk = inserts.splice(0, 500);
    const { error } = await supabase.from('records').insert(chunk);
    if (error) throw error;
  }
}
