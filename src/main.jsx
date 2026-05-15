import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AppV2 from './v2/AppV2.jsx'

// v2 route flag: `?v=2` opens the new frontend; everything else falls
// through to the current App. Default behavior is preserved exactly —
// existing users see no change. This flag is intentionally URL-driven
// (not localStorage) so a fresh tap on stillformapp.com always returns
// to the working app, and v2 is only reachable by deliberate opt-in.
const params = new URLSearchParams(window.location.search)
const useV2 = params.get('v') === '2'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {useV2 ? <AppV2 /> : <App />}
  </React.StrictMode>,
)

// Remove any old service workers that are causing cache issues
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(r => r.unregister());
  });
  // Also clear all caches
  if ('caches' in window) {
    caches.keys().then(names => names.forEach(name => caches.delete(name)));
  }
}
