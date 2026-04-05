'use client'
import { useAppStore } from '@/lib/store'
import { DAOProposal } from '@/lib/types'
import { Vote, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react'
import { formatDate } from '@/lib/utils'

function ProposalCard({ proposal }: { proposal: DAOProposal }) {
  const { wallet, voteOnProposal } = useAppStore()
  const total = proposal.votesFor + proposal.votesAgainst
  const pct = total > 0 ? Math.round((proposal.votesFor / total) * 100) : 0

  const statusConfig = {
    active: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-900/30', label: 'Active' },
    passed: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-900/30', label: 'Passed' },
    rejected: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-900/30', label: 'Rejected' },
    pending: { icon: Clock, color: 'text-slate-400', bg: 'bg-slate-900/30', label: 'Pending' },
  }
  const s = statusConfig[proposal.status]

  return (
    <div className="card-glass rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-200">{proposal.eventTitle}</h3>
          <p className="text-xs text-slate-600 mt-0.5">Expires {formatDate(proposal.expiresAt)}</p>
        </div>
        <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${s.bg} ${s.color}`}>
          <s.icon className="w-3 h-3" /> {s.label}
        </span>
      </div>
      <p className="text-sm text-slate-500 leading-relaxed">{proposal.description}</p>

      {/* Vote bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span className="text-green-400">{proposal.votesFor} for ({pct}%)</span>
          <span className="text-red-400">{proposal.votesAgainst} against</span>
        </div>
        <div className="h-2 bg-midnight-900 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {proposal.status === 'active' && wallet.isConnected && !proposal.hasVoted && (
        <div className="flex gap-3">
          <button onClick={() => voteOnProposal(proposal.id, 'for')}
            className="flex-1 py-2 bg-green-900/30 hover:bg-green-900/50 text-green-400 rounded-lg text-sm font-medium transition-colors border border-green-900">
            ✓ Vote For
          </button>
          <button onClick={() => voteOnProposal(proposal.id, 'against')}
            className="flex-1 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg text-sm font-medium transition-colors border border-red-900">
            ✗ Vote Against
          </button>
        </div>
      )}
      {proposal.hasVoted && (
        <p className="text-xs text-slate-600 text-center">You have voted on this proposal</p>
      )}
      {!wallet.isConnected && proposal.status === 'active' && (
        <p className="text-xs text-slate-600 text-center">Connect wallet to vote</p>
      )}
    </div>
  )
}

export default function DAOPage() {
  const { proposals } = useAppStore()
  const active = proposals.filter(p => p.status === 'active')
  const past = proposals.filter(p => p.status !== 'active')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">DAO Event Curation</h1>
        <p className="text-slate-500 mt-1">Community-governed event verification and listing</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card-glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-midnight-300">{proposals.length}</div>
          <div className="text-xs text-slate-600">Total Proposals</div>
        </div>
        <div className="card-glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{active.length}</div>
          <div className="text-xs text-slate-600">Active Votes</div>
        </div>
        <div className="card-glass rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{proposals.filter(p => p.status === 'passed').length}</div>
          <div className="text-xs text-slate-600">Approved</div>
        </div>
      </div>

      {active.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-400" /> Active Proposals
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {active.map(p => <ProposalCard key={p.id} proposal={p} />)}
          </div>
        </section>
      )}
      {past.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-slate-200 mb-4">Past Proposals</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {past.map(p => <ProposalCard key={p.id} proposal={p} />)}
          </div>
        </section>
      )}

      <div className="flex items-center justify-center py-4 text-slate-700">
        <Vote className="w-4 h-4 mr-2" />
        <span className="text-sm">Powered by Midnight DAO governance</span>
      </div>
    </div>
  )
}
