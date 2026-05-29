'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { FaArrowLeft, FaTrash, FaHeart, FaShoppingBag } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

export default function WishlistPage() {
  const [user, setUser] = useState<any>(null)
  const [wishlist, setWishlist] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/login'); return }
      setUser(u)
      await fetchWishlist(u.id)
      setLoading(false)
    }
    load()
  }, [])

  const fetchWishlist = async (userId: string) => {
    const { data } = await supabase
      .from('wishlist')
      .select(`
        id,
        listing:listing_id (
          id,
          title,
          image_url,
          price,
          is_sold,
          slug,
          seo_slug
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    setWishlist(data || [])
  }

  const removeFromWishlist = async (wishlistId: string) => {
    setRemoving(wishlistId)
    await supabase
      .from('wishlist')
      .delete()
      .eq('id', wishlistId)

    setWishlist(prev => prev.filter(item => item.id !== wishlistId))
    setRemoving(null)
  }

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-blue-400 animate-pulse">Loading wishlist...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900/40 via-zinc-950 to-zinc-950 px-4 pt-6 pb-8">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link href="/buyer/home">
            <FaArrowLeft className="text-blue-400 hover:text-blue-300 cursor-pointer" />
          </Link>
          <h1 className="text-2xl font-bold">My Wishlist</h1>
          {wishlist.length > 0 && (
            <span className="ml-auto text-xs text-zinc-500">{wishlist.length} item{wishlist.length > 1 ? 's' : ''}</span>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6">
        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <FaHeart className="text-6xl text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg mb-2">Your wishlist is empty</p>
            <p className="text-zinc-600 text-sm mb-6">Save items you love to buy them later</p>
            <Link
              href="/buyer/home"
              className="inline-block rounded-xl bg-gradient-to-r from-blue-500 to-blue-400 px-6 py-2.5 text-sm font-bold text-white"
            >
              Continue Shopping →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <AnimatePresence>
              {wishlist.map((item: any) => {
                const listing = item.listing
                if (!listing) return null
                const href = '/product/' + (listing.slug || listing.seo_slug || listing.id)

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden"
                  >
                    {/* Image */}
                    <Link href={href}>
                      <div className="relative">
                        {listing.image_url ? (
                          <img
                            src={listing.image_url}
                            alt={listing.title}
                            className="w-full h-36 object-cover"
                          />
                        ) : (
                          <div className="w-full h-36 bg-zinc-800 flex items-center justify-center">
                            <FaShoppingBag className="text-zinc-600 text-2xl" />
                          </div>
                        )}
                        {listing.is_sold && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-red-400 font-bold text-sm border border-red-400/50 px-3 py-1 rounded-full">Sold Out</span>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="p-3">
                      <Link href={href}>
                        <p className="text-sm font-semibold truncate hover:text-blue-400 transition">
                          {listing.title}
                        </p>
                        <p className="text-emerald-400 font-bold mt-1">৳{listing.price}</p>
                      </Link>

                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        disabled={removing === item.id}
                        className="mt-2 w-full py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition disabled:opacity-40 flex items-center justify-center gap-2"
                      >
                        <FaTrash className="text-xs" />
                        {removing === item.id ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}