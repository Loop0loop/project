import { BROADCAST_TABS, type BroadcastType } from '../constants'

type BroadcastTabsProps = {
  type: BroadcastType
  onChange: (type: BroadcastType) => void
}

export function BroadcastTabs({ type, onChange }: BroadcastTabsProps) {
  return (
    <div className="flex rounded-lg bg-slate-200 p-1" role="tablist" aria-label="방송 유형">
      {BROADCAST_TABS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          role="tab"
          aria-selected={type === value}
          onClick={() => onChange(value)}
          className={`rounded-md px-4 py-2 text-sm font-semibold transition ${type === value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
