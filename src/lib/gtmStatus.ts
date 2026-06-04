// Runtime introspection helpers used by the debug panel to show support reps
// exactly which pieces of the chain are live: GTM container → Rebrandly SDK →
// click ID. None of this is required for tracking to work — it is purely a
// teaching/observability aid.

export interface GtmStatus {
  /** GTM container script has executed (window.google_tag_manager present). */
  gtmLoaded: boolean
  /** Number of containers GTM has registered. */
  containerCount: number
  /** Rebrandly SDK has been loaded by GTM (window.rbly present). */
  sdkLoaded: boolean
  /** A Rebrandly click ID is stored — i.e. the visitor arrived via a short link. */
  clickId: string | null
  /** Current data layer length. */
  dataLayerLength: number
}

export function getGtmStatus(): GtmStatus {
  const gtm = window.google_tag_manager
  let clickId: string | null = null
  try {
    clickId =
      localStorage.getItem('rbly_click_id') ||
      new URLSearchParams(window.location.search).get('rbly_click_id')
  } catch {
    /* localStorage may be unavailable */
  }

  return {
    gtmLoaded: !!gtm,
    containerCount: gtm ? Object.keys(gtm).length : 0,
    sdkLoaded: !!window.rbly,
    clickId,
    dataLayerLength: Array.isArray(window.dataLayer) ? window.dataLayer.length : 0,
  }
}
