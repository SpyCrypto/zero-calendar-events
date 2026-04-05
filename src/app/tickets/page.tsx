'use client'
import { useAppStore } from '@/lib/store'
import { formatDate } from '@/lib/utils'
import { Ticket, Hash, CheckCircle, Calendar } from 'lucide-react'

export default function TicketsPage() {
  const { wallet, tickets, connectWallet } = useAppStore()

  if (!wallet.isConnected) {
    return (
      <div className="text-center py-20">
        <Ticket className="w-16 h-16 mx-auto mb-4 text-slate-700" />
        <h2 className="text-2xl font-bold text-slate-300 mb-2">Your NFT Tickets</h2>
        <p className="text-slate-500 mb-6">Connect your wallet to view your tickets</p>
        <button onClick={connectWallet}
          className="px-6 py-3 bg-midnight-600 hover:bg-midnight-500 rounded-lg font-semibold text-white">
          Connect Wallet
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">NFT Tickets</h1>
        <p className="text-slate-500 mt-1">Your on-chain event tickets — provably owned, forever valid</p>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-16 card-glass rounded-2xl">
          <Ticket className="w-12 h-12 mx-auto mb-3 text-slate-700" />
          <p className="text-slate-500">No tickets yet. Browse events and mint your first NFT ticket!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map(ticket => (
            <div key={ticket.id} className="card-glass rounded-xl overflow-hidden">
              <div className="h-40 relative bg-gradient-to-br from-midnight-800 to-midnight-950">
                {ticket.metadata.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ticket.metadata.image} alt={ticket.eventTitle} className="w-full h-full object-cover opacity-40" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-midnight-300 font-mono">{ticket.tokenId}</div>
                    <div className="text-xs text-slate-500 mt-1">NFT Ticket</div>
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  {ticket.isValid && (
                    <span className="flex items-center gap-1 bg-green-900/60 text-green-400 text-xs px-2 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" /> Valid
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-slate-200">{ticket.eventTitle}</h3>
                <div className="space-y-1 text-xs text-slate-500">
                  {ticket.seatNumber && <p>Seat: {ticket.seatNumber}</p>}
                  <p className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Minted {formatDate(ticket.mintedAt)}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {ticket.metadata.attributes.map(attr => (
                    <span key={attr.trait_type} className="text-xs bg-midnight-800 text-midnight-300 px-2 py-0.5 rounded-full">
                      {attr.value}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-600 font-mono bg-midnight-900 rounded px-2 py-1">
                  <Hash className="w-3 h-3" /> {ticket.txHash}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
