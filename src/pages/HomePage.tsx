import { Link } from 'react-router'
import { products } from '../data/products'
import { ProductCard } from '../components/ProductCard'
import { getGtmStatus } from '../lib/gtmStatus'

export function HomePage() {
  const { clickId } = getGtmStatus()

  return (
    <div>
      <div className="mb-8">
        <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">
          Demo SaaS · Conversion Tracking via GTM
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mt-3">Plans that scale with your team</h1>
        <p className="text-gray-600 mt-2 max-w-2xl">
          NimbusDesk is a fictional SaaS used to teach how to install Rebrandly Conversion
          Tracking through Google Tag Manager on a single-page app. Pick a plan and check out, or
          start a free trial — each action pushes a conversion to the data layer for GTM to handle.
        </p>
      </div>

      {!clickId ? (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            <strong>No Rebrandly click ID detected.</strong> Conversions are only attributed for
            visitors who arrived through a Rebrandly short link. Open this page with{' '}
            <code className="bg-amber-100 px-1 rounded text-xs">?rbly_click_id=test123</code> in the
            URL, or use <strong>“Set test click ID”</strong> in the debug panel → Actions tab.
          </p>
        </div>
      ) : (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            <strong>Click ID active:</strong>{' '}
            <code className="bg-green-100 px-1 rounded text-xs font-mono">{clickId}</code> — conversions
            on this visit will be attributed to this Rebrandly click.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-10 bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900">New here?</h2>
        <p className="text-gray-600 mt-1 text-sm">
          Read the{' '}
          <Link to="/setup" className="text-indigo-600 font-medium hover:underline">
            GTM Setup Guide
          </Link>{' '}
          to see exactly which tags, triggers, and variables to create in your Google Tag Manager
          container so these conversions reach Rebrandly.
        </p>
      </div>
    </div>
  )
}
