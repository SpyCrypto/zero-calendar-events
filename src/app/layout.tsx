import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/Header'

export const metadata: Metadata = {
  title: 'Zero Calendar Events',
  description: 'Web3 Conference Hub — discover conferences, RSVP with your wallet, build on-chain reputation. Powered by Midnight Network.',
  metadataBase: new URL('https://build.1am.xyz'),
  openGraph: {
    title: 'Zero Calendar Events',
    description: 'Discover conferences, RSVP with your wallet, see who\'s going. Powered by Midnight Network.',
    url: 'https://build.1am.xyz',
    siteName: 'Zero Calendar Events',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zero Calendar Events',
    description: 'Web3 Conference Hub on Midnight Network',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #0f0f2e 50%, #0a0a1a 100%)' }}>
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {children}
        </main>
      </body>
    </html>
  )
}
