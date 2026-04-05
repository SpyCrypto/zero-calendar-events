'use client'
import { AttendeeBreakdown } from '@/lib/types'

interface Props {
  breakdown: AttendeeBreakdown
  /** When true renders the compact inline pill variant used on event cards */
  compact?: boolean
}

const ROLES = [
  { key: 'builders',    label: 'Builders',    emoji: '🔨', color: 'text-sky-400' },
  { key: 'investors',   label: 'Investors',   emoji: '💰', color: 'text-yellow-400' },
  { key: 'lawyers',     label: 'Lawyers',     emoji: '⚖️',  color: 'text-purple-400' },
  { key: 'speakers',    label: 'Speakers',    emoji: '🎤', color: 'text-green-400' },
  { key: 'researchers', label: 'Researchers', emoji: '🔬', color: 'text-cyan-400' },
  { key: 'designers',   label: 'Designers',   emoji: '🎨', color: 'text-pink-400' },
  { key: 'organizers',  label: 'Organizers',  emoji: '📋', color: 'text-orange-400' },
  { key: 'interested',  label: 'Interested',  emoji: '👀', color: 'text-slate-400' },
] as const

export function WhoIsGoing({ breakdown, compact = false }: Props) {
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0)

  if (compact) {
    // Show top-3 non-zero roles as tiny pills
    const top = ROLES
      .filter(r => breakdown[r.key] > 0)
      .sort((a, b) => breakdown[b.key] - breakdown[a.key])
      .slice(0, 3)
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        {top.map(r => (
          <span key={r.key} className={`text-xs ${r.color} flex items-center gap-0.5`}>
            <span>{r.emoji}</span>
            <span className="font-medium">{breakdown[r.key]}</span>
          </span>
        ))}
        {total > 0 && (
          <span className="text-xs text-slate-600">attending</span>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-300">Who&apos;s Going</h4>
        <span className="text-xs text-slate-500">{total} total</span>
      </div>

      {/* Stacked bar */}
      {total > 0 && (
        <div className="flex h-2 rounded-full overflow-hidden gap-px">
          {ROLES.filter(r => breakdown[r.key] > 0).map(r => (
            <div
              key={r.key}
              title={`${r.label}: ${breakdown[r.key]}`}
              className="h-full transition-all"
              style={{
                width: `${(breakdown[r.key] / total) * 100}%`,
                background: roleBarColor(r.key),
              }}
            />
          ))}
        </div>
      )}

      {/* Role breakdown grid */}
      <div className="grid grid-cols-2 gap-2">
        {ROLES.filter(r => breakdown[r.key] > 0).map(r => (
          <div key={r.key} className="flex items-center justify-between bg-midnight-900/60 rounded-lg px-3 py-1.5">
            <span className={`text-xs flex items-center gap-1.5 ${r.color}`}>
              <span>{r.emoji}</span> {r.label}
            </span>
            <span className="text-sm font-bold text-slate-300">{breakdown[r.key]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function roleBarColor(key: string): string {
  const map: Record<string, string> = {
    builders:    '#38bdf8',
    investors:   '#facc15',
    lawyers:     '#a78bfa',
    speakers:    '#4ade80',
    researchers: '#22d3ee',
    designers:   '#f472b6',
    organizers:  '#fb923c',
    interested:  '#475569',
  }
  return map[key] ?? '#6467f4'
}
