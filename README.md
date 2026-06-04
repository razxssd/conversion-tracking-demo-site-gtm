# Conversion Tracking — GTM Demo Site

A small demo SaaS (**NimbusDesk**) used to teach Customer Support how to install
**Rebrandly Conversion Tracking** through **Google Tag Manager** on a
**single-page app (SPA)**.

Unlike the sibling [`conversion-tracking-demo-site`](../conversion-tracking-demo-site)
(which calls the SDK directly), this build is **GTM-first**: the app never calls
`rbly.convert()` itself. It only pushes clean semantic events to
`window.dataLayer`, and a GTM container — configured by the customer — loads the
Rebrandly SDK and fires the conversions.

```
SPA action  →  dataLayer.push  →  GTM trigger + tag  →  rbly.convert()  →  Rebrandly
```

## What it demonstrates

- **A realistic SaaS storefront** — pricing plans and add-ons you can "buy", plus a
  free-trial signup form.
- **Data-layer instrumentation** — checkout pushes a `purchase` event; signup
  pushes a `signup` event; every route change pushes a `virtual_page_view`.
- **The GTM Setup Guide** (`/setup`) — the teaching core: copy-paste GTM tags,
  triggers, and Data Layer Variables, plus an SPA page-view explainer and a
  support troubleshooting cheat-sheet.
- **A debug panel** — live `window.dataLayer` contents, an event log of every
  push (app vs. GTM), GTM/SDK/click-ID status, and actions to simulate a
  Rebrandly-link visit.

## How conversions reach Rebrandly

1. The visitor arrives via a Rebrandly short link; the redirect engine appends
   `?rbly_click_id=…`. The SDK (loaded by GTM) stores it in `localStorage`.
2. The app pushes a `purchase` / `signup` event to the data layer.
3. GTM's Custom Event trigger fires a Custom HTML tag that calls `rbly.convert()`
   with the data-layer values.
4. The SDK sends the conversion (deduplicated, attributed to the click ID) to the
   Conversion Tracking API.

Page views are handled automatically by the SDK on SPA route changes — **no GTM
page-view tag needed**. See `/setup` for the full walkthrough.

## Tech stack

- React 19, TypeScript, Vite 7
- Tailwind CSS 4
- React Router 7

## Getting started

```bash
npm install
cp .env.example .env   # set VITE_GTM_ID to your own GTM container
npm run dev
```

### Environment variables

| Variable | Description |
|---|---|
| `VITE_GTM_ID` | Your Google Tag Manager container ID (e.g. `GTM-XXXXXXX`). This is the **only** value the app needs — the SDK URL, Rebrandly API key, and conversion tags all live inside the GTM container. Use your own container so you can edit tags and use Preview mode. |

> No click ID? Use **Set test click ID** in the debug panel (Actions tab), or open
> the site with `?rbly_click_id=test123`. Conversions are only attributable for
> visitors who arrived through a Rebrandly link.

### Build

```bash
npm run build
npm run preview
```

Deployment to GitHub Pages is wired up in `.github/workflows/deploy.yml`
(set the `VITE_GTM_ID` repo secret).
