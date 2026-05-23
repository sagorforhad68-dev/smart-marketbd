'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

import { motion } from 'framer-motion'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="sticky top-4 z-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="glass neon glow flex items-center justify-between p-3 rounded-2xl">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-teal-400 rounded-full flex items-center justify-center text-black font-bold">SM</div>
            <div>
              <div className="text-lg font-extrabold">Smart MarketBD</div>
              <div className="text-xs text-zinc-300">Premium Local Marketplace</div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/post">
              <motion.button whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }} className="bg-gradient-to-r from-indigo-500 to-teal-400 text-black px-4 py-2 rounded-xl font-bold">Sell</motion.button>
            </Link>
            {user ? (
              <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)} className="bg-zinc-900/40 px-3 py-2 rounded-xl">👤 {user.email?.split('@')[0]}</button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 glass text-white rounded-xl p-2 w-44">
                    <Link href="/profile" className="block px-2 py-2 hover:bg-white/5 rounded">My Listings</Link>
                    <Link href="/settings" className="block px-2 py-2 hover:bg-white/5 rounded">Settings</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-2 py-2 hover:bg-white/5 rounded">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="bg-indigo-600/80 hover:bg-indigo-500 px-3 py-2 rounded-xl">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}