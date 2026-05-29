'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaChartLine, FaBox, FaShoppingCart, FaEye, FaStar, FaDollarSign } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function SellerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [shop, setShop] = useState<any>(null)
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListing: 0,
    totalViews: 0,
    totalOrders: 0,
    averageRating: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        // FIXED: .maybeSingle() — row না থাকলে error হবে না
        const { data: sellerRole } = await supabase
          .from('seller_roles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()

        if (!sellerRole) {
          router.push('/seller/create-shop')
          return
        }

        setUser(user)

        // FIXED: shop আগে fetch করো, তারপর stats
        const shopData = await fetchShopData(user.id)
        await fetchStats(user.id, shopData)

      } catch (error) {
        console.error('Dashboard load error:', error)
      } finally {
        // FIXED: error হলেও loading বন্ধ হবে
        setLoading(false)
      }
    }

    getUser()
  }, [])

  // FIXED: shopData return করছে যাতে fetchStats এ pass করা যায়
  const fetchShopData = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('shops')
        .select('*')
        .eq('seller_id', userId)
        .maybeSingle()

      setShop(data)
      return data
    } catch (error) {
      console.error('Error fetching shop:', error)
      return null
    }
  }

  // FIXED: shopData parameter দিয়ে race condition দূর করা হয়েছে
  const fetchStats = async (userId: string, shopData: any) => {
    try {
      const { data: listings } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', userId)

      const activeListings = listings?.filter(l => !l.is_sold).length || 0
      const totalViews = listings?.reduce((acc, l) => acc + (l.views || 0), 0) || 0
      const totalRevenue = listings?.reduce((acc, l) => acc + (l.price * (l.stock || 1)), 0) || 0

      setStats({
        totalListings: listings?.length || 0,
        activeListing: activeListings,
        totalViews,
        totalOrders: 0,
        averageRating: shopData?.average_rating || 0,
        totalRevenue,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-green-400 text-xl animate-pulse">Loading dashboard...</div>
      </div>
    )
  }

  if (!user) return null

  const statCards = [
    { icon: FaBox, label: 'Total Listings', value: stats.totalListings, color: 'from-blue-500 to-blue-600' },
    { icon: FaEye, label: 'Total Views', value: stats.totalViews, color: 'from-green-500 to-green-600' },
    { icon: FaShoppingCart, label: 'Orders', value: stats.totalOrders, color: 'from-purple-500 to-purple-600' },
    { icon: FaDollarSign, label: 'Potential Revenue', value: `৳${stats.totalRevenue}`, color: 'from-amber-500 to-amber-600' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07070a] via-[#0b0b12] to-[#050508] text-white">

      {/* Header */}
      <div className="border-b border-zinc-800 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 mb-4">
            <FaArrowLeft /> Back to Marketplace
          </Link>
          <h1 className="text-4xl font-black mb-2">Seller Dashboard</h1>
          <p className="text-zinc-400">Manage your shop, products, and orders</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-12">
        <div className="max-w-7xl mx-auto">

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Link href="/seller/dashboard/add-product">
              <motion.div whileHover={{ y: -4 }} className="bg-green-500 hover:bg-green-400 text-black p-6 rounded-xl font-bold cursor-pointer text-center transition-all">
                ➕ Add Product
              </motion.div>
            </Link>
            <Link href="/seller/dashboard/inventory">
              <motion.div whileHover={{ y: -4 }} className="bg-blue-500 hover:bg-blue-400 text-white p-6 rounded-xl font-bold cursor-pointer text-center transition-all">
                📦 Inventory
              </motion.div>
            </Link>
            <Link href="/seller/dashboard/orders">
              <motion.div whileHover={{ y: -4 }} className="bg-purple-500 hover:bg-purple-400 text-white p-6 rounded-xl font-bold cursor-pointer text-center transition-all">
                🛒 Orders
              </motion.div>
            </Link>
            <Link href="/seller/dashboard/my-shop">
              <motion.div whileHover={{ y: -4 }} className="bg-amber-500 hover:bg-amber-400 text-black p-6 rounded-xl font-bold cursor-pointer text-center transition-all">
                🏪 My Shop
              </motion.div>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statCards.map((card, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                className={`bg-gradient-to-br ${card.color} p-6 rounded-xl text-white border border-white/20`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold opacity-80">{card.label}</h3>
                  <card.icon className="text-2xl opacity-50" />
                </div>
                <p className="text-3xl font-black">{card.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Shop Info */}
          {shop && (
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-8 mb-12">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black mb-2">{shop.shop_name}</h2>
                  {shop.is_verified && (
                    <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500 text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                      ✓ Verified Seller
                    </div>
                  )}
                </div>
                <Link href="/seller/dashboard/my-shop">
                  <button className="bg-green-500 hover:bg-green-400 text-black px-6 py-2 rounded-xl font-bold">
                    Edit Shop
                  </button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-zinc-400 text-sm mb-2">Average Rating</p>
                  <p className="text-2xl font-black flex items-center gap-2">
                    {shop.average_rating || 'N/A'}
                    <FaStar className="text-yellow-500" />
                  </p>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm mb-2">Total Reviews</p>
                  <p className="text-2xl font-black">{shop.review_count || 0}</p>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm mb-2">Member Since</p>
                  <p className="text-sm font-semibold">
                    {shop?.joined_date ? new Date(shop.joined_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              {shop.description && (
                <div className="mt-6 pt-6 border-t border-zinc-700">
                  <p className="text-zinc-300">{shop.description}</p>
                </div>
              )}
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-8">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <FaChartLine /> Recent Activity
            </h3>
            <div className="text-center py-8 text-zinc-400">
              <p>No recent activity yet</p>
              <p className="text-sm mt-2">Start by adding your first product!</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}