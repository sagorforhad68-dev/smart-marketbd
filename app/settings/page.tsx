'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else setUser(user)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) return null

  return (
    <div className="max-w-xl mx-auto p-6 mt-8 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <p className="mb-4">Email: {user.email}</p>
      <p className="mb-4">User ID: {user.id}</p>
      <button onClick={handleLogout} className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-400">
        Logout
      </button>
    </div>
  )
}