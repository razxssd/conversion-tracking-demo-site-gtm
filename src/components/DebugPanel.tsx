import { useState, useEffect } from 'react'
import { useEventLog } from '../hooks/useEventLog'
import { getGtmStatus, type GtmStatus } from '../lib/gtmStatus'
import { pushToDataLayer } from '../lib/dataLayer'
import { newTestClickId, nowIso } from '../lib/ids'

interface DebugPanelProps {
  isOpen: boolean
  onToggle: () => void
}

type Tab = 'log' | 'datalayer' | 'status' | 'actions'

export function DebugPanel({ isOpen, onToggle }: DebugPanelProps) {
  const { entries, clearLog } = useEventLog()
  const [activeTab, setActiveTab] = useState<Tab>('log')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [status, setStatus] = useState<GtmStatus>(() => getGtmStatus())
  const [dataLayer, setDataLayer] = useState<unknown[]>([])

  // GTM and the SDK load asynchronously; poll so the panel reflects reality.
  useEffect(() => {
    if (!isOpen) return
    const refresh = () => {
      setStatus(getGtmStatus())
      setDataLayer(Array.isArray(window.dataLayer) ? [...window.dataLayer] : [])
    }
    refresh()
    const interval = setInterval(refresh, 1000)
    return () => clearInterval(interval)
  }, [isOpen])

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'log', label: 'Event Log', count: entries.length },
    { id: 'datalayer', label: 'Data Layer', count: dataLayer.length },
    { id: 'status', label: 'Status' },
    { id: 'actions', label: 'Actions' },
  ]

  return (
    <div className="flex flex-shrink-0">
      <button
        onClick={onToggle}
        className="w-6 bg-gray-800 hover:bg-gray-700 text-gray-400 flex items-center justify-center cursor-pointer border-l border-gray-700 transition-colors"
        title={isOpen ? 'Close debug panel' : 'Open debug panel'}
      >
        <span className="[writing-mode:vertical-lr] text-[10px] font-mono tracking-widest">DEBUG</span>
      </button>

      {isOpen && (
        <div className="w-[380px] bg-gray-900 text-gray-100 flex flex-col overflow-hidden border-l border-gray-700">
          {/* Status bar */}
          <div className="px-3 py-2 bg-gray-800 border-b border-gray-700 flex items-center gap-3 text-xs">
            <Dot on={status.gtmLoaded} label="GTM" />
            <Dot on={status.sdkLoaded} label="SDK" />
            <Dot on={!!status.clickId} label="click ID" />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700 text-xs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-2 py-1.5 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gray-800 text-white border-b-2 border-indigo-500'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-1 bg-gray-700 text-gray-300 px-1 rounded text-[10px]">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === 'log' && (
              <EventLogTab
                entries={entries}
                clearLog={clearLog}
                expanded={expanded}
                setExpanded={setExpanded}
              />
            )}
            {activeTab === 'datalayer' && <DataLayerTab dataLayer={dataLayer} />}
            {activeTab === 'status' && <StatusTab status={status} />}
            {activeTab === 'actions' && <ActionsTab clickId={status.clickId} />}
          </div>
        </div>
      )}
    </div>
  )
}

function Dot({ on, label }: { on: boolean; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className={`w-2 h-2 rounded-full ${on ? 'bg-green-400' : 'bg-gray-600'}`} />
      {label}
    </span>
  )
}

function EventLogTab({
  entries,
  clearLog,
  expanded,
  setExpanded,
}: {
  entries: ReturnType<typeof useEventLog>['entries']
  clearLog: () => void
  expanded: string | null
  setExpanded: (id: string | null) => void
}) {
  if (entries.length === 0) {
    return (
      <p className="text-gray-500 text-xs p-3">
        No data layer pushes yet. Navigate pages, buy a plan, or submit the signup form.
      </p>
    )
  }
  return (
    <div>
      <button
        onClick={clearLog}
        className="w-full text-xs text-gray-500 hover:text-gray-300 py-1 px-3 text-left hover:bg-gray-800"
      >
        Clear log
      </button>
      {entries.map(entry => (
        <div
          key={entry.id}
          className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer"
          onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
        >
          <div className="px-3 py-2 flex items-center gap-2">
            <span
              className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                entry.source === 'gtm'
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'bg-indigo-500/20 text-indigo-300'
              }`}
            >
              {entry.source.toUpperCase()}
            </span>
            <span className="text-xs font-mono font-semibold text-gray-200 truncate">
              {entry.event}
            </span>
            <span className="ml-auto text-[10px] text-gray-600 flex-shrink-0">
              {entry.timestamp.toLocaleTimeString('en', {
                hour12: false,
                fractionalSecondDigits: 3,
              } as Intl.DateTimeFormatOptions)}
            </span>
          </div>
          {expanded === entry.id && (
            <pre className="px-3 pb-2 text-[10px] text-gray-400 overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(entry.payload, null, 2)}
            </pre>
          )}
        </div>
      ))}
    </div>
  )
}

function DataLayerTab({ dataLayer }: { dataLayer: unknown[] }) {
  return (
    <div className="p-3">
      <p className="text-[10px] text-gray-500 mb-2">
        Live contents of <code className="text-gray-400">window.dataLayer</code> — includes GTM’s own
        lifecycle events (gtm.js, gtm.dom, gtm.load) and every app push.
      </p>
      <pre className="text-[10px] text-gray-300 whitespace-pre-wrap overflow-x-auto">
        {dataLayer.length === 0 ? '(empty)' : JSON.stringify(dataLayer, null, 2)}
      </pre>
    </div>
  )
}

function StatusTab({ status }: { status: GtmStatus }) {
  let sdkConfig: unknown = null
  try {
    sdkConfig = window.rbly?.getConfig ? window.rbly.getConfig() : null
  } catch {
    sdkConfig = null
  }

  return (
    <div className="p-3 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Stat label="GTM loaded" value={status.gtmLoaded ? 'yes' : 'no'} />
        <Stat label="Containers" value={status.containerCount} />
        <Stat label="SDK loaded" value={status.sdkLoaded ? 'yes' : 'no'} />
        <Stat label="dataLayer len" value={status.dataLayerLength} />
      </div>
      <div className="bg-gray-800 rounded p-2">
        <p className="text-[10px] text-gray-500 uppercase">Rebrandly click ID</p>
        <p className="text-xs font-mono text-gray-200 break-all">
          {status.clickId || '(none — visitor did not arrive via a Rebrandly link)'}
        </p>
      </div>
      <div>
        <p className="text-[10px] text-gray-500 uppercase mb-1">SDK config</p>
        <pre className="text-[10px] text-gray-300 whitespace-pre-wrap overflow-x-auto bg-gray-800 rounded p-2">
          {sdkConfig ? JSON.stringify(sdkConfig, null, 2) : '(SDK not loaded by GTM yet)'}
        </pre>
      </div>
    </div>
  )
}

function ActionsTab({ clickId }: { clickId: string | null }) {
  const setTestClickId = () => {
    localStorage.setItem('rbly_click_id', newTestClickId())
    window.location.reload()
  }
  const clearClickId = () => {
    localStorage.removeItem('rbly_click_id')
    window.location.reload()
  }
  const pushTest = () => {
    pushToDataLayer({ event: 'debug_test_event', source: 'debug-panel', at: nowIso() })
  }

  return (
    <div className="p-3 space-y-2">
      <p className="text-xs text-gray-500 mb-2">Simulate a visit & inspect the data layer</p>
      <ActionButton
        label="Set test click ID"
        description="Write a fake rbly_click_id to localStorage and reload, so conversions are attributable without a real Rebrandly link."
        onClick={setTestClickId}
      />
      <ActionButton
        label="Clear click ID"
        description="Remove rbly_click_id and reload — simulate a visitor who did NOT arrive via a Rebrandly link."
        onClick={clearClickId}
        variant="warning"
        disabled={!clickId}
      />
      <ActionButton
        label="Push test event"
        description="Push a harmless debug_test_event to the data layer to confirm pushes are observable."
        onClick={pushTest}
      />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-gray-800 rounded p-2">
      <p className="text-[10px] text-gray-500 uppercase">{label}</p>
      <p className="text-sm font-mono font-semibold text-gray-200">{value}</p>
    </div>
  )
}

function ActionButton({
  label,
  description,
  onClick,
  variant = 'default',
  disabled = false,
}: {
  label: string
  description: string
  onClick: () => void
  variant?: 'default' | 'warning'
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left p-2 rounded text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        variant === 'warning'
          ? 'bg-amber-900/30 hover:bg-amber-900/50 text-amber-200'
          : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
      }`}
    >
      <span className="font-semibold">{label}</span>
      <p className="text-gray-500 mt-0.5">{description}</p>
    </button>
  )
}
