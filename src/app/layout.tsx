import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Awakening | Interactive Psychological Thriller',
  description: 'A dynamically generated psychological thriller CYOA experience.',
}

import { ThemeProvider } from '@/components/ThemeProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-serif">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
