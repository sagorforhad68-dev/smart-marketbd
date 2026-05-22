'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

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
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center sticky top-0 z-50">
      <Link href="/" className="text-xl font-bold">Smart MarketBD</Link>
      <div className="flex gap-4 items-center">
        <Link href="/post" className="bg-green-500 text-black px-3 py-1 rounded hover:bg-green-400">Sell</Link>
        {user ? (
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="bg-gray-700 px-3 py-1 rounded">
              👤 {user.email?.split('@')[0]}
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg p-2 w-40">
                <Link href="/profile" className="block px-2 py-1 hover:bg-gray-100 rounded">My Listings</Link>
                <Link href="/settings" className="block px-2 py-1 hover:bg-gray-100 rounded">Settings</Link>
                <button onClick={handleLogout} className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded">Logout</button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-400">Login</Link>
        )}
      </div>
    </nav>
  )
}