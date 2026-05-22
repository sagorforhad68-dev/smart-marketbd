'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Settings() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>

  return (
    <div className="min-h-screen bg-black text-white px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-green-400 hover:text-green-300 mb-6 inline-block">← Back to Home</Link>
        <h1 className="text-4xl font-black mb-8">Settings</h1>

        {/* Account Info */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-green-400">Account Info</h2>
          <div className="space-y-3 text-zinc-300">
            <p><span className="text-zinc-500">Email:</span> {user?.email}</p>
            <p><span className="text-zinc-500">User ID:</span> {user?.id}</p>
            <p><span className="text-zinc-500">Joined:</span> {new Date(user?.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-green-400">Quick Links</h2>
          <div className="space-y-3">
            <Link href="/dashboard" className="flex items-center justify-between p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-all">
              <span>Dashboard</span>
              <span>→</span>
            </Link>
            <Link href="/post-listing" className="flex items-center justify-between p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-all">
              <span>Post a Product</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Logout */}
        <button onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-xl text-lg transition-all">
          Logout
        </button>
      </div>
    </div>
  )
}