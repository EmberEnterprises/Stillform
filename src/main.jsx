import React from 'react'
import ReactDOM from 'react-dom/client'
import AppV2 from './v2/AppV2.jsx'
import ErrorBoundary from './v2/components/ErrorBoundary.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppV2 />
    </ErrorBoundary>
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
