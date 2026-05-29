'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { FaArrowLeft, FaFlag, FaCheck, FaTrash } from 'react-icons/fa'

export default function ModerationPage() {
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    const { data } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })

    setListings(data || [])
    setLoading(false)
  }

  const handleDeleteListing = async (id: string) => {
    if (!confirm('Delete this listing?')) return
    
    await supabase.from('listings').delete().eq('id', id)
    setListings(listings.filter(l => l.id !== id))
  }

  const handlePublishListing = async (id: string, published: boolean) => {
    await supabase.from('listings').update({ is_published: !published }).eq('id', id)
    setListings(listings.map(l => l.id === id ? { ...l, is_published: !published } : l))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07070a] via-[#0b0b12] to-[#050508] text-white">
      <div className="px-8 py-6 border-b border-zinc-800">
        <Link href="/admin" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 mb-4">
          <FaArrowLeft /> Back to Admin Dashboard
        </Link>
        <h1 className="text-4xl font-black">Product Moderation</h1>
      </div>

      <div className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <p className="text-zinc-400">Loading listings...</p>
          ) : listings.length === 0 ? (
            <div className="text-center py-12 border border-zinc-800 rounded-2xl">
              <FaFlag className="text-6xl text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-400">No listings to moderate</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-zinc-700">
                  <tr>
                    <th className="text-left py-4 px-4 font-semibold text-zinc-300">Product</th>
                    <th className="text-left py-4 px-4 font-semibold text-zinc-300">Seller</th>
                    <th className="text-left py-4 px-4 font-semibold text-zinc-300">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-zinc-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700">
                  {listings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-zinc-900/50">
                      <td className="py-4 px-4">
                        <p className="font-semibold">{listing.title}</p>
                        <p className="text-sm text-zinc-400">{listing.category}</p>
                      </td>
                      <td className="py-4 px-4 text-zinc-400">{listing.user_id.slice(0, 8)}...</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${listing.is_published ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {listing.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePublishListing(listing.id, listing.is_published)}
                            className="text-blue-400 hover:text-blue-300"
                            title={listing.is_published ? 'Unpublish' : 'Publish'}
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => handleDeleteListing(listing.id)}
                            className="text-red-400 hover:text-red-300"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
