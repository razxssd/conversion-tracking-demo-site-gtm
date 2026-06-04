import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { products } from '../data/products'
import { pushPurchase, type ConversionPayload } from '../lib/dataLayer'
import { newOrderId } from '../lib/ids'

export function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const [lastPush, setLastPush] = useState<ConversionPayload | null>(null)

  const product = products.find(p => p.id === id)

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Plan not found</h2>
        <Link to="/" className="text-indigo-600 hover:underline mt-2 inline-block">
          Back to pricing
        </Link>
      </div>
    )
  }

  const handleBuy = (fixedOrder: boolean) => {
    const orderId = fixedOrder ? `ORD-FIXED-${product.id}` : newOrderId()

    const conversion: ConversionPayload = {
      label: 'purchase',
      value: product.price,
      currency: product.currency,
      orderId,
      productId: product.id,
      productName: product.name,
    }

    // The app's only responsibility: push a clean semantic event to the data
    // layer. GTM listens for the "purchase" custom event and fires the
    // Rebrandly conversion tag (see /setup).
    pushPurchase(conversion)
    setLastPush(conversion)
  }

  return (
    <div>
      <Link to="/" className="text-sm text-indigo-600 hover:underline mb-4 inline-block">
        &larr; Back to pricing
      </Link>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 bg-gray-100">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-6 md:w-1/2 flex flex-col">
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</p>
              {product.badge && (
                <span className="inline-block bg-indigo-600 text-white text-xs font-medium px-2 py-0.5 rounded mt-1">
                  {product.badge}
                </span>
              )}
              <h1 className="text-2xl font-bold text-gray-900 mt-2">{product.name}</h1>
              <p className="text-gray-600 mt-3">{product.description}</p>
              <p className="text-3xl font-bold text-gray-900 mt-6">
                ${product.price.toFixed(2)}
                <span className="text-sm font-normal text-gray-500 ml-1">{product.currency}</span>
              </p>
            </div>

            {/*
              The buttons still push a `purchase` event to the data layer (the
              primary, recommended path). The data-rbly-* attributes are an
              ADDITIVE hook for the alternative "fire on click, no data layer"
              GTM setup — a Click trigger can read the whole conversion straight
              off these attributes without scraping the DOM. See /setup.
            */}
            <div className="mt-6 space-y-3">
              <button
                onClick={() => handleBuy(false)}
                data-rbly-buy=""
                data-rbly-label="purchase"
                data-rbly-value={product.price.toFixed(2)}
                data-rbly-currency={product.currency}
                data-rbly-product={product.id}
                data-rbly-product-name={product.name}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Buy now
              </button>
              <button
                onClick={() => handleBuy(true)}
                data-rbly-buy=""
                data-rbly-label="purchase"
                data-rbly-value={product.price.toFixed(2)}
                data-rbly-currency={product.currency}
                data-rbly-product={product.id}
                data-rbly-product-name={product.name}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
              >
                Buy again (fixed order ID — tests SDK dedup)
              </button>
            </div>

            {lastPush && (
              <div className="mt-4 p-3 rounded-lg text-sm bg-indigo-50 border border-indigo-200 text-indigo-900">
                <p className="font-semibold">Pushed <code>purchase</code> to the data layer.</p>
                <p className="text-indigo-700 mt-1 text-xs">
                  GTM should now fire your purchase conversion tag. Watch the debug panel → Event
                  Log and Data Layer tabs, or use GTM Preview mode to confirm the tag fired.
                </p>
                <pre className="mt-2 bg-white/70 rounded p-2 text-[11px] overflow-x-auto">
{JSON.stringify({ event: 'purchase', conversion: lastPush }, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
