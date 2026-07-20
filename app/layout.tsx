import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { PageTransition } from '@/components/layout/PageTransition'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'MatchFlix — Descubri que ver o jugar hoy',
  description: 'Encontra peliculas, series y videojuegos que te encanten. Solo o con otra persona.',
  openGraph: {
    title: 'MatchFlix',
    description: 'No sabes que ver o jugar hoy?',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  )
}