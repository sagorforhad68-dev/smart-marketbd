'use client'

import { useState, useEffect } from 'react'
import { fetchPublicListings } from '@/lib/listings'
import type { Listing } from '@/lib/types'
import Link from 'next/link'
import ListingCard from '@/components/ListingCard'
import Reveal from '@/components/Reveal'
import { FaBolt, FaClock, FaFire, FaArrowLeft } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function HotDealsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    fetchHotDeals()
  }, [search, categoryFilter])

  const fetchHotDeals = async () => {
    setLoading(true)
    try {
      const { data, error } = await fetchPublicListings({
        type: 'hot_deal',
        category: categoryFilter || undefined,
        search: search || undefined,
        publishedOnly: true,
      })

      if (error) {
        console.error('Error fetching hot deals:', error.message || error)
        setListings([])
      } else {
        setListings(data as Listing[])
      }
    } catch (err) {
      console.error('Error:', err)
      setListings([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07070a] via-[#0b0b12] to-[#050508] text-white">
      {/* Back Button */}
      <div className="px-8 pt-6">
        <Link href="/" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors">
          <FaArrowLeft /> Back to Marketplace
        </Link>
      </div>

      {/* Header Section */}
      <section className="px-8 py-16 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-6 mb-8">
            <div className="bg-gradient-to-br from-red-500 to-orange-600 p-6 rounded-2xl">
              <FaFire className="text-4xl text-white" />
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-black mb-4 flex items-center gap-3">
                <span>Hot Deals</span>
                <span className="inline-flex items-center gap-1 bg-red-500/20 border border-red-500 text-red-400 px-3 py-1 rounded-full text-xl font-bold">
                  <FaBolt /> LIVE
                </span>
              </h1>
              <p className="text-xl text-zinc-300 max-w-2xl">
                Limited stock, incredible deals. These are single-item or limited-quantity offers that disappear when sold. Don&apos;t miss out!
              </p>
            </div>
          </div>

          {/* Urgency Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div whileHover={{ y: -4 }} className="bg-zinc-900 border border-zinc-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <FaFire className="text-orange-500 text-2xl" />
                <h3 className="text-zinc-400 font-semibold">Active Deals</h3>
              </div>
              <p className="text-3xl font-black text-orange-400">{listings.length}</p>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} className="bg-zinc-900 border border-zinc-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <FaClock className="text-blue-500 text-2xl" />
                <h3 className="text-zinc-400 font-semibold">Limited Time</h3>
              </div>
              <p className="text-sm text-blue-400">Prices change daily</p>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} className="bg-zinc-900 border border-zinc-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <FaBolt className="text-yellow-500 text-2xl" />
                <h3 className="text-zinc-400 font-semibold">Exclusive Offers</h3>
              </div>
              <p className="text-sm text-yellow-400">Single or limited stock</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="px-8 py-8 border-b border-zinc-800 sticky top-[80px] z-40 bg-black/95 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search hot deals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 text-white rounded-xl px-5 py-3 flex-1 outline-none focus:border-green-400 placeholder-zinc-500"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 text-white rounded-xl px-5 py-3 outline-none focus:border-green-400"
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Mobiles">Mobiles</option>
              <option value="Cars">Cars</option>
              <option value="Land">Land & Property</option>
              <option value="Clothing">Clothing</option>
              <option value="Furniture">Furniture</option>
              <option value="Gaming">Gaming</option>
              <option value="Cameras">Cameras</option>
            </select>
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="px-8 py-16">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-zinc-400 text-lg">Loading hot deals...</p>
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <Reveal key={listing.id} className="">
                  <div className="relative group">
                    <ListingCard listing={listing} />
                    {/* Hot Deal Badge */}
                    <div className="absolute top-3 right-3 z-20">
                      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <FaBolt /> HOT DEAL
                      </div>
                    </div>
                    {/* Stock Badge */}
                    {listing.stock && listing.stock === 1 && (
                      <div className="absolute top-14 right-3 z-20">
                        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          Only 1 Left!
                        </div>
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-zinc-800 rounded-2xl">
              <FaFire className="text-6xl text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-400 text-xl mb-2">No hot deals available right now</p>
              <p className="text-zinc-600 mb-6">Check back soon for exclusive limited-time offers!</p>
              <Link href="/">
                <button className="bg-green-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-green-400">
                  Browse Marketplace
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
