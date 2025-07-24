import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'CalcPro - Calculadoras Técnicas para Construção',
  description: 'Sistema completo de calculadoras para divisórias, forros e pisos. Drywall, Naval, Laminado, Vinílico e mais.',
  keywords: 'calculadora, drywall, forro, piso, divisoria, construção, orçamento',
  authors: [{ name: 'CalcPro' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'CalcPro - Calculadoras Técnicas',
    description: 'Sistema completo de calculadoras para construção civil',
    url: 'https://calcpro.app.br',
    siteName: 'CalcPro',
    images: [
      {
        url: 'https://calcpro.app.br/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CalcPro - Calculadoras Técnicas',
    description: 'Sistema completo de calculadoras para construção civil',
    images: ['https://calcpro.app.br/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen bg-gray-50 antialiased">
        {children}
      </body>
    </html>
  )
}