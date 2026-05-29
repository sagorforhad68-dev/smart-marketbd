'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FaHeart, FaShoppingBag, FaSearch, FaFire,
  FaStar, FaMapMarkerAlt, FaComments, FaUser,
  FaBell, FaTag,
} from 'react-icons/fa'

export default function BuyerHomePage() {
  const [user, setUser] = useState<any>(null)
  const [listings, setListings] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/login'); return }

      const { data: sellerData } = await supabase
        .from('seller_roles')
        .select('user_id')
        .eq('user_id', u.id)
        .maybeSingle()
      if (sellerData) { router.push('/seller/dashboard'); return }

      setUser(u)

      const { data } = await supabase
        .from('listings')
        .select('*')
        .eq('is_sold', false)
        .order('created_at', { ascending: false })
        .limit(20)
      setListings(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = listings.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  )

  const displayName = user?.email?.split('@')[0] || 'Buyer'

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="text-blue-400 text-xl animate-pulse">Loading...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900/40 via-zinc-950 to-zinc-950 px-4 pt-6 pb-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">
                Hello, <span className="text-blue-400">{displayName}</span>
              </h1>
              <p className="text-zinc-400 text-sm">What are you looking for today?</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <FaUser className="text-blue-400" />
            </div>
          </div>
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-2xl bg-white/10 border border-white/10 pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 space-y-8 mt-6">

        {/* Quick Nav — Buyer only, NO seller options */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: FaHeart, label: 'Wishlist', href: '/buyer/wishlist', color: 'text-red-400' },
            { icon: FaShoppingBag, label: 'My Orders', href: '/buyer/orders', color: 'text-blue-400' },
            { icon: FaComments, label: 'Messages', href: '/buyer/messages', color: 'text-emerald-400' },
            { icon: FaBell, label: 'Alerts', href: '/buyer/alerts', color: 'text-yellow-400' },
          ].map(({ icon: Icon, label, href, color }) => (
            <Link key={label} href={href}>
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-4 hover:bg-white/10 transition cursor-pointer">
                <Icon className={'text-xl ' + color} />
                <span className="text-xs text-zinc-300">{label}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Categories */}
        <div>
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <FaTag className="text-blue-400" /> Browse Categories
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['All','Electronics','Fashion','Vehicles','Property','Home','Books','Baby','Health','Sports'].map(cat => (
              <button key={cat}
                className="shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-300 hover:border-blue-500/40 hover:text-white transition">
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Flash Deals — FIXED broken JSX */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FaFire className="text-orange-400" />
            <h2 className="font-bold text-lg">Flash Deals</h2>
            <Link href="/hot-deals" className="ml-auto text-xs text-zinc-400 hover:text-white">See all</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {filtered.length > 0 ? (
              filtered.slice(0, 8).map(p => (
                <Link key={p.id} href={'/product/' + (p.slug || p.seo_slug || p.id)}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="min-w-[150px] rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden"
                  >
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.title} className="w-full h-28 object-cover" />
                    ) : (
                      <div className="w-full h-28 bg-zinc-800 flex items-center justify-center text-zinc-600 text-xs">No Image</div>
                    )}
                    <div className="p-2">
                      <p className="text-xs font-semibold truncate">{p.title}</p>
                      <p className="text-emerald-400 text-sm font-bold">৳{p.price}</p>
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <p className="text-zinc-500 text-sm py-4">No products found</p>
            )}
          </div>
        </div>

        {/* New Arrivals */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FaStar className="text-yellow-400" />
            <h2 className="font-bold text-lg">New Arrivals</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {filtered.length > 0 ? (
              filtered.slice(0, 6).map(p => (
                <Link key={p.id} href={'/product/' + (p.slug || p.seo_slug || p.id)}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden"
                  >
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.title} className="w-full h-36 object-cover" />
                    ) : (
                      <div className="w-full h-36 bg-zinc-800 flex items-center justify-center text-zinc-600 text-xs">No Image</div>
                    )}
                    <div className="p-3">
                      <p className="text-sm font-semibold truncate">{p.title}</p>
                      <p className="text-emerald-400 font-bold">৳{p.price}</p>
                      <p className="text-zinc-500 text-xs flex items-center gap-1 mt-1">
                        <FaMapMarkerAlt /> Bangladesh
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <p className="text-zinc-500 text-sm col-span-2 text-center py-8">No listings yet</p>
            )}
          </div>
        </div>

        {/* REMOVED: "Want to sell something?" banner — buyer dashboard এ থাকবে না */}

      </div>
    </div>
  )
}