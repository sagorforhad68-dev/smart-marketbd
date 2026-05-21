'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded shadow flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="text-xl font-bold">Products</h2>
            <p className="text-gray-500 mt-2">Manage products</p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="text-xl font-bold">Orders</h2>
            <p className="text-gray-500 mt-2">Manage orders</p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="text-xl font-bold">Users</h2>
            <p className="text-gray-500 mt-2">Manage users</p>
          </div>
        </div>
      </div>
    </div>
  )
}
