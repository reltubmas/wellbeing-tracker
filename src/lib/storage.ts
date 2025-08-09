
// Lightweight localStorage wrapper with namespacing and versioning
const NAMESPACE = 'wellbeing-tracker';
const VERSION = 1;

type RecordItem = { id: string; createdAt: string; updatedAt: string; [k: string]: any };

function keyFor(collection: string) {
  return `${NAMESPACE}:v${VERSION}:${collection}`;
}

export function loadCollection(collection: string): RecordItem[] {
  const raw = localStorage.getItem(keyFor(collection));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCollection(collection: string, data: RecordItem[]) {
  localStorage.setItem(keyFor(collection), JSON.stringify(data));
}

export function upsert(collection: string, item: Omit<RecordItem, 'id'|'createdAt'|'updatedAt'> & { id?: string }) {
  const list = loadCollection(collection);
  const now = new Date().toISOString();
  if (item.id) {
    const idx = list.findIndex(r => r.id === item.id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...item, updatedAt: now };
    } else {
      list.push({ ...item, id: crypto.randomUUID(), createdAt: now, updatedAt: now });
    }
  } else {
    list.push({ ...item, id: crypto.randomUUID(), createdAt: now, updatedAt: now });
  }
  saveCollection(collection, list);
}

export function remove(collection: string, id: string) {
  const list = loadCollection(collection);
  saveCollection(collection, list.filter(r => r.id !== id));
}

export function clearAll() {
  Object.keys(localStorage).forEach(k => {
    if (k.startsWith(NAMESPACE + ':')) localStorage.removeItem(k);
  });
}

export function exportAll(): string {
  const data: Record<string, any> = {};
  Object.keys(localStorage).forEach(k => {
    if (k.startsWith(NAMESPACE + ':')) {
      data[k] = JSON.parse(localStorage.getItem(k) || 'null');
    }
  });
  return JSON.stringify(data, null, 2);
}

export function importAll(json: string) {
  const data = JSON.parse(json);
  Object.keys(data).forEach(k => {
    if (k.startsWith(NAMESPACE + ':')) {
      localStorage.setItem(k, JSON.stringify(data[k]));
    }
  });
}
