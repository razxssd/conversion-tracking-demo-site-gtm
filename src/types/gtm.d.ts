// Minimal typings for the globals that GTM and the Rebrandly SDK install on
// `window`. The app only ever writes to `dataLayer`; GTM and the SDK are loaded
// and controlled from inside the container, so we type them loosely.

interface DataLayerObject {
  event?: string
  [key: string]: unknown
}

interface Window {
  /** The GTM data layer. The app pushes semantic events here. */
  dataLayer: DataLayerObject[]
  /** Present once gtm.js has executed. Keyed by container ID. */
  google_tag_manager?: Record<string, unknown>
  /** Installed by the Rebrandly SDK *after GTM loads it* (see /setup). */
  rbly?: {
    convert(
      label: string,
      value?: number | null,
      currency?: string | null,
      properties?: Record<string, unknown>
    ): Promise<unknown>
    track(
      event: string,
      properties?: Record<string, unknown>,
      value?: number | null,
      currency?: string | null
    ): Promise<unknown>
    getConfig?(): Record<string, unknown>
  }
}
