'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaSignOutAlt, FaBoxes, FaShoppingCart, FaUsers } from 'react-icons/fa'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
        // Check if user is admin
        const userMetadata = user.user_metadata
        setIsAdmin(userMetadata?.isAdmin || false)
      }
      setLoading(false)
    }
    getUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 px-8 py-6 bg-black/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-3xl font-black text-green-400 hover:text-green-300 transition-colors">
            Smart MarketBD
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold transition-colors"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* User Info Card */}
        <div className="bg-gradient-to-r from-green-500/10 to-black/50 border border-zinc-800 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-black mb-4">Welcome, {user.email}!</h2>
          <div className="space-y-2 text-zinc-400">
            <p><span className="text-green-400 font-bold">Email:</span> {user.email}</p>
            <p><span className="text-green-400 font-bold">User ID:</span> {user.id}</p>
            <p><span className="text-green-400 font-bold">Account Type:</span> {isAdmin ? 'Administrator' : 'Customer'}</p>
            <p><span className="text-green-400 font-bold">Joined:</span> {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-8 hover:border-green-400 transition-colors">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-lg bg-green-500/20 text-green-400 text-2xl mb-4">
              <FaBoxes />
            </div>
            <h3 className="text-2xl font-bold mb-2">Products</h3>
            <p className="text-zinc-400 mb-4">Manage your product catalog</p>
            {isAdmin && (
              <button className="bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-lg font-bold transition-colors">
                Manage Products
              </button>
            )}
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-8 hover:border-green-400 transition-colors">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-lg bg-green-500/20 text-green-400 text-2xl mb-4">
              <FaShoppingCart />
            </div>
            <h3 className="text-2xl font-bold mb-2">Orders</h3>
            <p className="text-zinc-400 mb-4">View and manage orders</p>
            {isAdmin && (
              <button className="bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-lg font-bold transition-colors">
                View Orders
              </button>
            )}
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-8 hover:border-green-400 transition-colors">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-lg bg-green-500/20 text-green-400 text-2xl mb-4">
              <FaUsers />
            </div>
            <h3 className="text-2xl font-bold mb-2">Users</h3>
            <p className="text-zinc-400 mb-4">Manage user accounts</p>
            {isAdmin && (
              <button className="bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-lg font-bold transition-colors">
                Manage Users
              </button>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">Dashboard Information</h3>
          <div className="text-zinc-400 space-y-3">
            {isAdmin ? (
              <>
                <p>✓ You have admin access to the dashboard</p>
                <p>✓ You can manage products, orders, and users</p>
                <p>✓ Access Supabase console for detailed analytics</p>
              </>
            ) : (
              <>
                <p>✓ You are logged in as a customer</p>
                <p>✓ Return to the <Link href="/" className="text-green-400 hover:text-green-300">homepage</Link> to continue shopping</p>
                <p>✓ Your order history will appear here (feature coming soon)</p>
              </>
            )}
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-bold transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  )
}
