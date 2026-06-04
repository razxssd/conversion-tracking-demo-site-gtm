import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { EventLogProvider } from './context/EventLogContext'
import { ensureDataLayer } from './lib/dataLayer'
import App from './App'
import './index.css'

// Make sure the data layer exists before React mounts. (The GTM snippet in
// index.html already creates it, but this keeps the app robust if GTM is
// blocked or not yet configured.)
ensureDataLayer()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <EventLogProvider>
        <App />
      </EventLogProvider>
    </BrowserRouter>
  </StrictMode>,
)
