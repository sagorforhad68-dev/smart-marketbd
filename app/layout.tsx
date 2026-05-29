import './globals.css'
import Navbar from '@/components/Navbar'
import PageTransition from '@/components/PageTransition'
import GlobalRobot from '@/components/GlobalRobot'

export const metadata = {
  title: 'Smart MarketBD — Buy & Sell in Bangladesh',
  description: 'Discover electronics, mobiles, vehicles, and more from trusted local sellers across Bangladesh.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="overflow-x-hidden text-white antialiased">
        <Navbar />
        <main>
          <PageTransition>{children}</PageTransition>
        </main>
        <GlobalRobot />
      </body>
    </html>
  )
}