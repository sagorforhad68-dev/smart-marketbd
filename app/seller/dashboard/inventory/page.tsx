'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { FaArrowLeft, FaEdit, FaTrash, FaEye } from 'react-icons/fa'

export default function InventoryPage() {
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setUser(user)
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    setListings(data || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return

    await supabase.from('listings').delete().eq('id', id)
    setListings(listings.filter(l => l.id !== id))
  }

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    await supabase
      .from('listings')
      .update({ is_published: !currentStatus })
      .eq('id', id)
    
    setListings(listings.map(l => l.id === id ? { ...l, is_published: !currentStatus } : l))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07070a] via-[#0b0b12] to-[#050508] text-white">
      <div className="px-8 py-6 border-b border-zinc-800">
        <Link href="/seller/dashboard" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 mb-4">
          <FaArrowLeft /> Back to Dashboard
        </Link>
        <h1 className="text-4xl font-black">Inventory Management</h1>
      </div>

      <div className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-zinc-400">Total Products: <span className="text-green-400 font-black">{listings.length}</span></p>
            </div>
            <Link href="/seller/dashboard/add-product">
              <button className="bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-xl font-bold">
                ➕ Add Product
              </button>
            </Link>
          </div>

          {loading ? (
            <p className="text-zinc-400">Loading inventory...</p>
          ) : listings.length === 0 ? (
            <div className="text-center py-12 border border-zinc-800 rounded-2xl">
              <p className="text-zinc-400 text-lg mb-4">No products yet</p>
              <Link href="/seller/dashboard/add-product">
                <button className="bg-green-500 text-black px-6 py-2 rounded-xl font-bold">Add Your First Product</button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-zinc-700">
                  <tr>
                    <th className="text-left py-4 px-4 font-semibold text-zinc-300">Product</th>
                    <th className="text-left py-4 px-4 font-semibold text-zinc-300">Category</th>
                    <th className="text-left py-4 px-4 font-semibold text-zinc-300">Price</th>
                    <th className="text-left py-4 px-4 font-semibold text-zinc-300">Stock</th>
                    <th className="text-left py-4 px-4 font-semibold text-zinc-300">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-zinc-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700">
                  {listings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {listing.image_url && (
                            <img src={listing.image_url} alt={listing.title} className="w-10 h-10 object-cover rounded" />
                          )}
                          <p className="font-semibold">{listing.title}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-zinc-400">{listing.category}</td>
                      <td className="py-4 px-4 font-semibold">৳{listing.price}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${listing.is_sold ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                          {listing.is_sold ? 'Sold' : `${listing.stock || 1} Items`}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${listing.is_published ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {listing.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTogglePublish(listing.id, listing.is_published)}
                            className="text-blue-400 hover:text-blue-300"
                            title={listing.is_published ? 'Unpublish' : 'Publish'}
                          >
                            <FaEye />
                          </button>
                          <button className="text-amber-400 hover:text-amber-300" title="Edit">
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(listing.id)}
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
