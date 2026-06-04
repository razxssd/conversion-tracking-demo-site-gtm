import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { pushToDataLayer } from '../lib/dataLayer'

/**
 * Push a `virtual_page_view` to the data layer on every React Router route
 * change (including the initial load).
 *
 * Why this exists on a SPA: a classic multi-page site fires a fresh GTM page
 * load on every navigation. A SPA does not — the browser never reloads, so any
 * GTM tag bound to a normal page-view trigger would only ever fire once. The
 * standard fix is for the app to emit an explicit virtual page-view event that
 * GTM can trigger on.
 *
 * Note for support: the Rebrandly SDK *also* hooks history.pushState /
 * popstate and auto-tracks Rebrandly page views on route change by itself, so
 * you do NOT need a Rebrandly page-view tag in GTM. This event is here for
 * visibility (and for any other vendor tags, e.g. GA4) and to make SPA
 * navigation observable in the debug panel.
 */
export function usePageViews() {
  const location = useLocation()

  useEffect(() => {
    pushToDataLayer({
      event: 'virtual_page_view',
      page: {
        path: location.pathname + location.search,
        title: document.title,
      },
    })
  }, [location.pathname, location.search])
}
