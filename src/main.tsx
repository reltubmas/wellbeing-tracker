import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';          // <- this must be App
import './styles.css';             // or whatever your styles file is

console.log('BOOT: main.tsx (Wellbeing app)');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
