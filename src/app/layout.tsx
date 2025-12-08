import type { Metadata } from 'next'
import { Outfit, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ThemePro - Marketplace de Thèmes & Templates Premium',
  description: 'Découvrez des milliers de thèmes WordPress, templates HTML, designs Figma et tunnels de vente créés par des designers talentueux.',
  keywords: ['thèmes wordpress', 'templates html', 'figma', 'tunnels de vente', 'marketplace'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${outfit.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e1b4b',
              color: '#fff',
              borderRadius: '12px',
            },
          }}
        />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}







