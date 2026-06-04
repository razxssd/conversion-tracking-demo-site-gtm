// ---------------------------------------------------------------------------
// dataLayer helper
// ---------------------------------------------------------------------------
// In a GTM-based setup the application's ONLY job is to push clean, semantic
// events to window.dataLayer. It never calls the Rebrandly SDK directly — that
// is wired up inside the GTM container (see the Setup Guide page).
//
// This module:
//   1. guarantees window.dataLayer exists,
//   2. exposes typed push helpers for the two conversions in this demo,
//   3. lets the debug panel observe every push the app makes (so support can
//      see exactly what GTM receives).
// ---------------------------------------------------------------------------

export interface ConversionPayload {
  /** Conversion label sent to rbly.convert() — e.g. "purchase", "signup". */
  label: string
  /** Monetary value, or null for non-monetary conversions. */
  value: number | null
  /** 3-letter ISO currency code, or null when value is null. */
  currency: string | null
  [key: string]: unknown
}

export interface DataLayerPush {
  event: string
  [key: string]: unknown
}

type Listener = (push: DataLayerPush) => void

const listeners = new Set<Listener>()

/** Ensure the data layer array exists before anything pushes to it. */
export function ensureDataLayer(): DataLayerPush[] {
  window.dataLayer = window.dataLayer || []
  return window.dataLayer as DataLayerPush[]
}

/**
 * Push a semantic event to the GTM data layer.
 * This is the single choke-point the whole app uses to talk to GTM.
 */
export function pushToDataLayer(push: DataLayerPush): void {
  ensureDataLayer().push(push)
  // Notify in-app observers (the debug panel) on a microtask so React state
  // updates never happen synchronously inside a render-triggered push.
  queueMicrotask(() => {
    listeners.forEach(fn => fn(push))
  })
}

/** Subscribe to every push the app makes. Returns an unsubscribe function. */
export function onDataLayerPush(fn: Listener): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

// --- Semantic event helpers -------------------------------------------------

/**
 * Fire a purchase. GTM listens for the custom event "purchase", reads the
 * `conversion.*` data layer variables, and calls rbly.convert() from a tag.
 */
export function pushPurchase(conversion: ConversionPayload): void {
  pushToDataLayer({ event: 'purchase', conversion })
}

/**
 * Fire a signup (non-monetary conversion). GTM listens for "signup".
 */
export function pushSignup(conversion: ConversionPayload): void {
  pushToDataLayer({ event: 'signup', conversion })
}
