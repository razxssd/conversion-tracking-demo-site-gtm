import { createContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { onDataLayerPush, type DataLayerPush } from '../lib/dataLayer'

export interface EventLogEntry {
  id: string
  timestamp: Date
  /** Where this push originated. */
  source: 'app' | 'gtm'
  /** The dataLayer `event` name (gtm.js, gtm.dom, purchase, signup, ...). */
  event: string
  /** Full payload pushed to the data layer. */
  payload: DataLayerPush
}

export interface EventLogContextValue {
  entries: EventLogEntry[]
  logAppPush(push: DataLayerPush): void
  clearLog(): void
}

// eslint-disable-next-line react-refresh/only-export-components -- context object co-located with its provider
export const EventLogContext = createContext<EventLogContextValue>({
  entries: [],
  logAppPush: () => {},
  clearLog: () => {},
})

// Events GTM itself pushes to the data layer. We tag these as "gtm" so support
// can distinguish the container's lifecycle events from the app's own pushes.
const GTM_EVENT_PREFIXES = ['gtm.']

function classify(push: DataLayerPush): 'app' | 'gtm' {
  const name = push.event || ''
  return GTM_EVENT_PREFIXES.some(p => name.startsWith(p)) ? 'gtm' : 'app'
}

export function EventLogProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<EventLogEntry[]>([])

  const addEntry = useCallback((push: DataLayerPush, source: 'app' | 'gtm') => {
    setEntries(prev => [
      {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        source,
        event: push.event || '(no event name)',
        payload: push,
      },
      ...prev,
    ])
  }, [])

  const logAppPush = useCallback(
    (push: DataLayerPush) => addEntry(push, classify(push)),
    [addEntry]
  )

  const clearLog = useCallback(() => setEntries([]), [])

  // Observe every push the app makes through pushToDataLayer(). GTM's own
  // lifecycle pushes (gtm.js, gtm.dom, gtm.load, gtm.historyChange) go through
  // the array directly and are surfaced live in the debug panel's "Data Layer"
  // tab rather than the event log.
  useEffect(() => {
    return onDataLayerPush(push => addEntry(push, classify(push)))
  }, [addEntry])

  return (
    <EventLogContext.Provider value={{ entries, logAppPush, clearLog }}>
      {children}
    </EventLogContext.Provider>
  )
}
