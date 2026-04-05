'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { Calendar, MapPin, Ticket, Users, Vote, Zap, Wallet } from 'lucide-react'
import { cn, shortenAddress } from '@/lib/utils'

const navItems = [
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/tickets', label: 'Tickets', icon: Ticket },
  { href: '/profile', label: 'Profile', icon: Users },
  { href: '/network', label: 'Network', icon: Zap },
  { href: '/dao', label: 'DAO', icon: Vote },
  { href: '/discover', label: 'Discover', icon: MapPin },
]

export function Header() {
  const pathname = usePathname()
  const { wallet, connectWallet, disconnectWallet } = useAppStore()

  return (
    <header className="sticky top-0 z-50 card-glass border-b border-midnight-800/50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center h-16 gap-6">
          <Link href="/" className="font-bold text-lg bg-gradient-to-r from-midnight-300 to-neon-blue bg-clip-text text-transparent shrink-0">
            ⬡ ZeroCalendar
          </Link>
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-midnight-800 text-midnight-300'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-midnight-900'
                )}>
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 border border-midnight-800 rounded-full px-2.5 py-1">
              <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse" />
              Preview
            </span>
            {wallet.isConnected ? (
              <button onClick={disconnectWallet}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-midnight-800 border border-midnight-600 text-sm text-slate-300 hover:border-midnight-400 transition-colors">
                <Wallet className="w-4 h-4 text-neon-green" />
                {shortenAddress(wallet.address!)}
              </button>
            ) : (
              <button onClick={connectWallet}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-midnight-600 hover:bg-midnight-500 text-sm font-semibold text-white transition-colors">
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
