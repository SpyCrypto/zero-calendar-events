'use client'
import { useAppStore } from '@/lib/store'
import { formatDate, shortenAddress } from '@/lib/utils'
import { User, Calendar, Star, Twitter, Github } from 'lucide-react'
import { AttendeeRole } from '@/lib/types'

const ROLES: { value: AttendeeRole; label: string; emoji: string }[] = [
  { value: 'builder',    label: 'Builder',    emoji: '🔨' },
  { value: 'investor',   label: 'Investor',   emoji: '💰' },
  { value: 'lawyer',     label: 'Lawyer',     emoji: '⚖️'  },
  { value: 'speaker',    label: 'Speaker',    emoji: '🎤' },
  { value: 'researcher', label: 'Researcher', emoji: '🔬' },
  { value: 'designer',   label: 'Designer',   emoji: '🎨' },
  { value: 'organizer',  label: 'Organizer',  emoji: '📋' },
  { value: 'other',      label: 'Other',      emoji: '👤' },
]

export default function ProfilePage() {
  const { wallet, profile, tickets, connectWallet, updateProfileRole } = useAppStore()

  if (!wallet.isConnected) {
    return (
      <div className="text-center py-20">
        <User className="w-16 h-16 mx-auto mb-4 text-slate-700" />
        <h2 className="text-2xl font-bold text-slate-300 mb-2">Wallet-based Profile</h2>
        <p className="text-slate-500 mb-6">Connect your wallet to view your on-chain identity</p>
        <button onClick={connectWallet}
          className="px-6 py-3 bg-midnight-600 hover:bg-midnight-500 rounded-lg font-semibold text-white">
          Connect Wallet
        </button>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-slate-100">Attendee Profile</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="card-glass rounded-2xl p-6 space-y-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-midnight-500 to-neon-purple flex items-center justify-center text-3xl mx-auto">
            🧑‍💻
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-200">{profile.displayName}</h2>
            <p className="text-xs text-slate-500 font-mono mt-1">{shortenAddress(profile.address)}</p>
          </div>
          <p className="text-sm text-slate-400 text-center">{profile.bio}</p>

          {/* Role selector — feeds into "Who's Going" on RSVP */}
          <div>
            <p className="text-xs text-slate-500 mb-2 text-center">Your role (shown in Who&apos;s Going)</p>
            <div className="grid grid-cols-4 gap-1">
              {ROLES.map(r => (
                <button key={r.value} onClick={() => updateProfileRole(r.value)}
                  title={r.label}
                  className={`flex flex-col items-center gap-0.5 py-2 rounded-lg text-xs transition-colors ${
                    profile.role === r.value
                      ? 'bg-midnight-600 text-white'
                      : 'bg-midnight-900 text-slate-500 hover:text-slate-300 hover:bg-midnight-800'
                  }`}>
                  <span className="text-base">{r.emoji}</span>
                  <span className="leading-none">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-midnight-900 rounded-lg p-3">
              <div className="text-xl font-bold text-midnight-300">{profile.eventsAttended}</div>
              <div className="text-xs text-slate-600">Attended</div>
            </div>
            <div className="bg-midnight-900 rounded-lg p-3">
              <div className="text-xl font-bold text-midnight-300">{profile.eventsOrganized}</div>
              <div className="text-xs text-slate-600">Organized</div>
            </div>
          </div>

          {/* Social links */}
          <div className="space-y-2">
            {profile.social.twitter && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Twitter className="w-4 h-4 text-sky-400" /> {profile.social.twitter}
              </div>
            )}
            {profile.social.github && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Github className="w-4 h-4 text-slate-400" /> {profile.social.github}
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2 space-y-5">
          {/* Badges / Reputation */}
          <div className="card-glass rounded-2xl p-5">
            <h3 className="font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" /> Reputation Badges
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {profile.badges.map(badge => (
                <div key={badge.id} className="bg-midnight-900 rounded-xl p-3 flex items-start gap-3">
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <div className="text-sm font-medium text-slate-300">{badge.name}</div>
                    <div className="text-xs text-slate-600">{badge.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="card-glass rounded-2xl p-5">
            <h3 className="font-semibold text-slate-300 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map(skill => (
                <span key={skill} className="px-3 py-1 bg-midnight-800 text-midnight-300 text-sm rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Ticket / event history */}
          <div className="card-glass rounded-2xl p-5">
            <h3 className="font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-midnight-400" /> Event History
            </h3>
            <div className="space-y-2">
              {tickets.map(t => (
                <div key={t.id} className="flex items-center gap-3 text-sm bg-midnight-900 rounded-lg px-3 py-2">
                  <span className="text-midnight-400 font-mono">{t.tokenId}</span>
                  <span className="text-slate-400 flex-1">{t.eventTitle}</span>
                  <span className="text-slate-600 text-xs">{formatDate(t.mintedAt)}</span>
                </div>
              ))}
              {tickets.length === 0 && <p className="text-slate-600 text-sm">No tickets yet</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
