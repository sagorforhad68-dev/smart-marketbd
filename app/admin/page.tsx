'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaChartBar, FaUsers, FaBox, FaFlag } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalListings: 0,
    totalUsers: 0,
    reportedListings: 0,
    pendingModeration: 0,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Check if user is admin
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!adminUser) {
        router.push('/')
        return
      }

      setUser(user)
      await fetchStats()
      setLoading(false)
    }

    checkAdmin()
  }, [])

  const fetchStats = async () => {
    try {
      const { data: listings } = await supabase.from('listings').select('*')
      const { data: users } = await supabase.from('auth.users').select('*')
      
      setStats({
        totalListings: listings?.length || 0,
        totalUsers: users?.length || 0,
        reportedListings: 0, // Will need to implement reports table
        pendingModeration: 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading admin panel...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const statCards = [
    { icon: FaBox, label: 'Total Listings', value: stats.totalListings, color: 'from-blue-500 to-blue-600' },
    { icon: FaUsers, label: 'Total Users', value: stats.totalUsers, color: 'from-green-500 to-green-600' },
    { icon: FaFlag, label: 'Reported Items', value: stats.reportedListings, color: 'from-red-500 to-red-600' },
    { icon: FaChartBar, label: 'Pending Review', value: stats.pendingModeration, color: 'from-amber-500 to-amber-600' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07070a] via-[#0b0b12] to-[#050508] text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 mb-4">
            <FaArrowLeft /> Back to Marketplace
          </Link>
          <h1 className="text-4xl font-black mb-2">Admin Dashboard</h1>
          <p className="text-zinc-400">Manage marketplace, users, and moderation</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Link href="/admin/moderation">
              <motion.div whileHover={{ y: -4 }} className="bg-red-500 hover:bg-red-400 text-white p-6 rounded-xl font-bold cursor-pointer text-center transition-all">
                🚩 Moderation
              </motion.div>
            </Link>
            <Link href="/admin/users">
              <motion.div whileHover={{ y: -4 }} className="bg-blue-500 hover:bg-blue-400 text-white p-6 rounded-xl font-bold cursor-pointer text-center transition-all">
                👥 User Management
              </motion.div>
            </Link>
            <Link href="/admin/listings">
              <motion.div whileHover={{ y: -4 }} className="bg-purple-500 hover:bg-purple-400 text-white p-6 rounded-xl font-bold cursor-pointer text-center transition-all">
                📦 Listings
              </motion.div>
            </Link>
            <Link href="/admin/analytics">
              <motion.div whileHover={{ y: -4 }} className="bg-amber-500 hover:bg-amber-400 text-black p-6 rounded-xl font-bold cursor-pointer text-center transition-all">
                📊 Analytics
              </motion.div>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                className={`bg-gradient-to-br ${card.color} p-6 rounded-xl text-white border border-opacity-20 border-white`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold opacity-80">{card.label}</h3>
                  <card.icon className="text-2xl opacity-50" />
                </div>
                <p className="text-3xl font-black">{card.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
