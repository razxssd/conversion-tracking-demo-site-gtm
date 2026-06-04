import { useState } from 'react'
import { pushSignup, type ConversionPayload } from '../lib/dataLayer'

export function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '' })
  const [lastPush, setLastPush] = useState<ConversionPayload | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const conversion: ConversionPayload = {
      label: 'signup',
      value: null,
      currency: null,
      email: form.email,
      name: form.name,
      company: form.company,
      plan: 'trial',
    }

    // Non-monetary conversion: push "signup" to the data layer. GTM fires the
    // signup conversion tag, which calls rbly.convert('signup', null, null, …).
    pushSignup(conversion)
    setLastPush(conversion)
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Start your free trial</h1>
        <p className="text-gray-600 mt-1">
          Mock registration form. Submitting pushes a{' '}
          <code className="bg-gray-100 px-1 rounded text-sm">signup</code> event to the data layer.
          Submit the same email twice to see the SDK’s deduplication in action.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4"
      >
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full name
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Jane Doe"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Work email
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
            placeholder="jane@company.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <input
            id="company"
            type="text"
            value={form.company}
            onChange={e => setForm(prev => ({ ...prev, company: e.target.value }))}
            placeholder="Acme Inc."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Create account
        </button>
      </form>

      {lastPush && (
        <div className="mt-4 p-3 rounded-lg text-sm bg-indigo-50 border border-indigo-200 text-indigo-900">
          <p className="font-semibold">Pushed <code>signup</code> to the data layer.</p>
          <p className="text-indigo-700 mt-1 text-xs">
            GTM should now fire your signup conversion tag. Confirm in the debug panel or GTM
            Preview mode.
          </p>
          <pre className="mt-2 bg-white/70 rounded p-2 text-[11px] overflow-x-auto">
{JSON.stringify({ event: 'signup', conversion: lastPush }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
