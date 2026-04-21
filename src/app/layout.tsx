import type { Metadata } from 'next'
import './globals.css'
import { TopActionHeader } from '@/components/shared/TopActionHeader'

export const metadata: Metadata = {
  title: 'Наша Столовая',
  description: 'Меню, корзина и персональная история заказов',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="antialiased">
        <TopActionHeader />
        <div className="pt-20">{children}</div>
      </body>
    </html>
  )
}
