import type { ReactNode } from 'react'
import { CodeBlock } from '../components/CodeBlock'

// ---------------------------------------------------------------------------
// GTM Setup Guide — minimal version
// ---------------------------------------------------------------------------
// The whole Rebrandly integration through GTM is: 2 tags, 1 trigger, 1
// variable. Page views are free (the SDK auto-tracks SPA route changes), so the
// only real work is firing conversions. This guide leads with that.
// ---------------------------------------------------------------------------

const SDK_SRC = 'https://track.rebrandly.click/sdk/latest/rbly.min.js'
const SDK_SRC_TEST = 'https://track.test.rebrandly.click/sdk/latest/rbly.min.js'

const LOADER_TAG = `<script
  src="${SDK_SRC}"
  data-api-key="YOUR_PUBLIC_API_KEY">
</script>`

// One tag handles every conversion: read the whole object from a single data
// layer variable and pass it straight to the SDK.
const CONVERSION_TAG = `<script>
  var c = {{DLV - conversion}};
  if (window.rbly && c) {
    window.rbly.convert(c.label, c.value, c.currency, c);
  }
</script>`

const NO_GTM_TAG = `<script
  src="${SDK_SRC}"
  data-api-key="YOUR_PUBLIC_API_KEY">
</script>`

const PURCHASE_PUSH = `window.dataLayer.push({
  event: 'purchase',
  conversion: { label: 'purchase', value: 49.0, currency: 'USD', orderId: 'ORD-123', plan: 'pro' }
});`

export function SetupGuidePage() {
  return (
    <div className="max-w-3xl">
      <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">
        Customer Support training
      </span>
      <h1 className="text-3xl font-bold text-gray-900 mt-3">
        Install Conversion Tracking with GTM on a SPA
      </h1>
      <p className="text-gray-600 mt-2">
        The whole thing is <strong>2 tags, 1 trigger, 1 variable</strong>. Page views need{' '}
        <em>zero</em> setup — the SDK tracks SPA route changes by itself. The only real work is
        firing conversions.
      </p>

      <Callout tone="info" title="The 30-second mental model">
        <p>
          The app just pushes clean events to the data layer. GTM does the rest: one tag loads the
          SDK, one tag turns each <code>purchase</code>/<code>signup</code> event into a Rebrandly
          conversion.
        </p>
        <FlowDiagram />
      </Callout>

      <SectionTitle>Which path should a customer take?</SectionTitle>
      <PathTable
        rows={[
          [
            'No GTM',
            'One script tag',
            'Simplest. SDK auto-inits and tracks page views; you call rbly.convert() in code. Good when the customer has dev resources and no GTM.',
          ],
          [
            'GTM (this guide)',
            '2 tags · 1 trigger · 1 variable',
            'Tracking lives in GTM, not app code — change it without a deploy. The right default for most customers.',
          ],
          [
            'No-code (roadmap)',
            'Just the loader tag',
            'Conversions auto-detected from URL rules in the Rebrandly dashboard — no conversion tag at all. Coming in a later phase; not available yet.',
          ],
        ]}
      />

      <SectionTitle>Step 1 — Load the SDK (this also gives you page views)</SectionTitle>
      <p className="text-gray-700 text-sm">
        <em>Tags → New → Custom HTML.</em> Replace{' '}
        <code className="bg-gray-100 px-1 rounded">YOUR_PUBLIC_API_KEY</code> with the customer’s{' '}
        <strong>public</strong> Rebrandly API key. Fire it on{' '}
        <code className="bg-gray-100 px-1 rounded">Initialization - All Pages</code>.
      </p>
      <CodeBlock label="Custom HTML tag — Rebrandly SDK Loader" code={LOADER_TAG} />
      <Callout tone="info" title="Page views are now done">
        <p>
          That’s the whole page-view story. The SDK captures the{' '}
          <code className="bg-blue-100 px-1 rounded text-xs">rbly_click_id</code> from the landing
          URL and auto-tracks a Rebrandly page view on first load <strong>and on every SPA route
          change</strong> (it hooks the History API). No History Change trigger, no page-view tag,
          nothing to maintain. Navigate Pricing → a plan → Sign up and watch them appear.
        </p>
      </Callout>

      <SectionTitle>Step 2 — Add one Data Layer Variable</SectionTitle>
      <p className="text-gray-700 text-sm">
        <em>Variables → New → Data Layer Variable.</em> Name it{' '}
        <code className="bg-gray-100 px-1 rounded">DLV - conversion</code>, with{' '}
        <strong>Data Layer Variable Name</strong> =&nbsp;
        <code className="bg-gray-100 px-1 rounded">conversion</code>. That one variable grabs the
        whole object the app pushes — no need for a separate variable per field.
      </p>

      <SectionTitle>Step 3 — Add one trigger</SectionTitle>
      <p className="text-gray-700 text-sm">
        <em>Triggers → New → Custom Event.</em> One regex trigger covers both conversions:
      </p>
      <CodeBlock
        label="Trigger — Custom Event"
        code={`Event name:  purchase|signup
☑ Use regex matching`}
      />

      <SectionTitle>Step 4 — Add one conversion tag</SectionTitle>
      <p className="text-gray-700 text-sm">
        <em>Tags → New → Custom HTML.</em> Attach the trigger from Step 3. It reads the whole
        conversion object and hands it to the SDK — works for both purchase (monetary) and signup
        (value/currency are <code className="bg-gray-100 px-1 rounded">null</code>).
      </p>
      <CodeBlock label="Custom HTML tag — Rebrandly Conversion" code={CONVERSION_TAG} />
      <p className="text-gray-700 text-sm">
        For reference, this is what the app pushes (visible live in the debug panel):
      </p>
      <CodeBlock label="What the app pushes on checkout" code={PURCHASE_PUSH} />
      <p className="text-gray-700 text-sm">
        That’s the entire setup. The SDK deduplicates by{' '}
        <code className="bg-gray-100 px-1 rounded">orderId</code>/<code className="bg-gray-100 px-1 rounded">email</code>,
        so firing the same purchase twice won’t double-count.
      </p>

      <SectionTitle>Step 5 — Test, then publish</SectionTitle>
      <ol className="text-sm text-gray-700 list-decimal pl-5 space-y-1.5">
        <li>In GTM, click <strong>Preview</strong> and enter this site’s URL.</li>
        <li>
          Give yourself a click ID so conversions are attributable —{' '}
          <code className="bg-gray-100 px-1 rounded">?rbly_click_id=test123</code> in the URL, or{' '}
          <strong>Set test click ID</strong> in the debug panel (Actions tab).
        </li>
        <li>
          Buy a plan / submit the trial form. In Tag Assistant, confirm the{' '}
          <strong>Loader</strong> fired on init and the <strong>Conversion</strong> tag fired on the{' '}
          <code className="bg-gray-100 px-1 rounded">purchase</code>/
          <code className="bg-gray-100 px-1 rounded">signup</code> event, returning 200.
        </li>
        <li>Only then <strong>Submit / Publish</strong> the container.</li>
      </ol>

      <Callout tone="warn" title="Test vs. production">
        <p>
          For the <strong>test</strong> environment, load the SDK from{' '}
          <code className="bg-amber-100 px-1 rounded text-xs">{SDK_SRC_TEST}</code> with a test API
          key. This NimbusDesk demo targets test by default.
        </p>
      </Callout>

      <SectionTitle>Don’t want GTM at all? (Level 0)</SectionTitle>
      <p className="text-gray-700 text-sm">
        If a customer has no GTM, the simplest possible install is a single script tag on their
        site. The SDK auto-initializes and auto-tracks page views; they call{' '}
        <code className="bg-gray-100 px-1 rounded">rbly.convert()</code> in their own code for
        conversions.
      </p>
      <CodeBlock label="Drop-in, no GTM" code={NO_GTM_TAG} />

      <SectionTitle>Troubleshooting (support cheat-sheet)</SectionTitle>
      <TroubleshootTable
        rows={[
          [
            'Tag fires but nothing reaches Rebrandly',
            'No click ID. The SDK only sends conversions for visitors who arrived via a Rebrandly short link. Check rbly_click_id in the debug panel → Status.',
          ],
          [
            'window.rbly is undefined in the conversion tag',
            'Loader didn’t run first. Put it on Initialization - All Pages; the conversion tag already guards with if (window.rbly).',
          ],
          [
            'Purchases counted twice',
            'Two tags fire on the same event, or a manual rbly.convert() exists in app code alongside the GTM tag. Keep conversions in exactly one place.',
          ],
          [
            'Works in Preview, not in production',
            'Container version wasn’t published, or production loads a different GTM container ID.',
          ],
          [
            'Conversion value empty / undefined',
            'The Data Layer Variable Name must be exactly "conversion" (case-sensitive), and the tag reads c.value off that object.',
          ],
        ]}
      />

      <div className="mt-10 text-xs text-gray-400 border-t border-gray-200 pt-4">
        Reference: Rebrandly Conversion Tracking SDK — auto-init via <code>data-api-key</code>,
        automatic SPA page views, <code>rbly.convert()</code>, and built-in deduplication.
      </div>
    </div>
  )
}

// --- Small presentational helpers ------------------------------------------

function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-xl font-bold text-gray-900 mt-10 mb-2">{children}</h2>
}

function Callout({
  tone,
  title,
  children,
}: {
  tone: 'info' | 'warn'
  title: string
  children: ReactNode
}) {
  const styles =
    tone === 'warn'
      ? 'bg-amber-50 border-amber-200 text-amber-900'
      : 'bg-blue-50 border-blue-200 text-blue-900'
  return (
    <div className={`mt-4 border rounded-lg p-4 text-sm ${styles}`}>
      <p className="font-semibold mb-1">{title}</p>
      {children}
    </div>
  )
}

function FlowDiagram() {
  const boxes = ['SPA action', 'dataLayer.push', 'GTM trigger + tag', 'rbly.convert()', 'Rebrandly']
  return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      {boxes.map((b, i) => (
        <div key={b} className="flex items-center gap-2">
          <span className="bg-white border border-blue-300 rounded px-2.5 py-1 text-xs font-mono text-blue-800 whitespace-nowrap">
            {b}
          </span>
          {i < boxes.length - 1 && <span className="text-blue-400">→</span>}
        </div>
      ))}
    </div>
  )
}

function PathTable({ rows }: { rows: [string, string, string][] }) {
  return (
    <div className="overflow-x-auto my-3">
      <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="text-left px-3 py-2 font-semibold">Path</th>
            <th className="text-left px-3 py-2 font-semibold">Effort</th>
            <th className="text-left px-3 py-2 font-semibold">When to use it</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([path, effort, when]) => (
            <tr key={path} className="border-t border-gray-200 align-top">
              <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">{path}</td>
              <td className="px-3 py-2 text-indigo-700 whitespace-nowrap">{effort}</td>
              <td className="px-3 py-2 text-gray-700">{when}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TroubleshootTable({ rows }: { rows: [string, string][] }) {
  return (
    <div className="overflow-x-auto my-3">
      <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="text-left px-3 py-2 font-semibold w-2/5">Symptom</th>
            <th className="text-left px-3 py-2 font-semibold">Most likely cause &amp; fix</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([symptom, fix]) => (
            <tr key={symptom} className="border-t border-gray-200 align-top">
              <td className="px-3 py-2 text-gray-900 font-medium">{symptom}</td>
              <td className="px-3 py-2 text-gray-700">{fix}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
