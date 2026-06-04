import { useState } from 'react'

export function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard blocked — user can still select manually */
    }
  }

  return (
    <div className="relative group my-3">
      {label && (
        <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-1 font-semibold">
          {label}
        </div>
      )}
      <button
        onClick={copy}
        className="absolute top-2 right-2 text-[11px] bg-gray-700 hover:bg-gray-600 text-gray-100 px-2 py-1 rounded transition-colors"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 pr-16 overflow-x-auto text-[12px] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  )
}
