import React from 'react';
import ReactDOM from 'react-dom/client';
import Auth from './Auth';
import EntryForm from './EntryForm';
import EntriesList from './EntriesList';

function App() {
  const [reloadKey, setReloadKey] = React.useState(0);
  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Wellbeing tracker</h1>
      <Auth />
      <EntryForm onSaved={() => setReloadKey(k => k + 1)} />
      {/* remount the list after save to force refresh */}
      <div key={reloadKey}><EntriesList /></div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>
);
