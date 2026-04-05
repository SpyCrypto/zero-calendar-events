'use client'
import { useAppStore } from '@/lib/store'
import { RSVPStatus } from '@/lib/types'
import { CheckCircle, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  eventId: string
  className?: string
}

export function RSVPButton({ eventId, className }: Props) {
  const { wallet, rsvpEvent, getRSVP, connectWallet } = useAppStore()
  const existing = getRSVP(eventId)

  if (!wallet.isConnected) {
    return (
      <button onClick={connectWallet}
        className={cn('w-full py-2.5 bg-midnight-700 hover:bg-midnight-600 rounded-lg text-sm font-medium text-slate-300 transition-colors', className)}>
        Connect wallet to RSVP
      </button>
    )
  }

  const handleRSVP = (status: RSVPStatus) => {
    if (existing?.status === status) return
    rsvpEvent(eventId, status)
  }

  return (
    <div className={cn('space-y-2', className)}>
      <button
        onClick={() => handleRSVP('attending')}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all',
          existing?.status === 'attending'
            ? 'bg-green-700 text-white border border-green-500'
            : 'bg-midnight-600 hover:bg-midnight-500 text-white'
        )}>
        <CheckCircle className="w-4 h-4" />
        {existing?.status === 'attending' ? "You're attending ✓" : "I'm Attending"}
      </button>
      <button
        onClick={() => handleRSVP('interested')}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all border',
          existing?.status === 'interested'
            ? 'border-yellow-500 bg-yellow-900/30 text-yellow-400'
            : 'border-midnight-700 hover:border-midnight-500 text-slate-400 hover:text-slate-300'
        )}>
        <Star className="w-4 h-4" />
        {existing?.status === 'interested' ? 'Interested ★' : 'Interested'}
      </button>
    </div>
  )
}
