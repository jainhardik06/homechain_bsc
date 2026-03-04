import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HomeChain - Smart Home Control',
  description: 'Blockchain-powered home automation with decentralized access control',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  )
}
