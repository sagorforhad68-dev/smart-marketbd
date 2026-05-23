import './globals.css'
import Navbar from '@/components/Navbar'
import PageTransition from '@/components/PageTransition'

export const metadata = {
  title: 'Smart MarketBD',
  description: 'Local marketplace of Bangladesh',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-[#07070a] via-[#0b0b12] to-[#050508] text-white">
        <Navbar />
        <main className="px-4 md:px-8 lg:px-16">
          <PageTransition>{children}</PageTransition>
        </main>
      </body>
    </html>
  )
}