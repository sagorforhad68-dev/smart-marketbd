'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { FaArrowLeft, FaUsers, FaShieldAlt, FaCheckCircle } from 'react-icons/fa'

export default function UserManagementPage() {
  const [sellers, setSellers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSellers()
  }, [])

  const fetchSellers = async () => {
    try {
      const { data } = await supabase
        .from('seller_roles')
        .select(`
          *,
          shops (
            shop_name,
            is_verified,
            average_rating,
            review_count,
            joined_date
          )
        `)

      setSellers(data || [])
    } catch (error) {
      console.error('Error fetching sellers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifySeller = async (userId: string, currentStatus: boolean) => {
    await supabase
      .from('seller_roles')
      .update({ is_verified: !currentStatus, verification_status: !currentStatus ? 'verified' : 'pending' })
      .eq('user_id', userId)

    await supabase
      .from('shops')
      .update({ is_verified: !currentStatus })
      .eq('seller_id', userId)

    setSellers(sellers.map(s => 
      s.user_id === userId ? { ...s, is_verified: !currentStatus } : s
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07070a] via-[#0b0b12] to-[#050508] text-white">
      <div className="px-8 py-6 border-b border-zinc-800">
        <Link href="/admin" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 mb-4">
          <FaArrowLeft /> Back to Admin Dashboard
        </Link>
        <h1 className="text-4xl font-black">User Management</h1>
      </div>

      <div className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Sellers</h2>
            <p className="text-zinc-400">Manage seller accounts and verification status</p>
          </div>

          {loading ? (
            <p className="text-zinc-400">Loading sellers...</p>
          ) : sellers.length === 0 ? (
            <div className="text-center py-12 border border-zinc-800 rounded-2xl">
              <FaUsers className="text-6xl text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-400">No sellers yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-zinc-700">
                  <tr>
                    <th className="text-left py-4 px-4 font-semibold text-zinc-300">Shop Name</th>
                    <th className="text-left py-4 px-4 font-semibold text-zinc-300">Joined</th>
                    <th className="text-left py-4 px-4 font-semibold text-zinc-300">Rating</th>
                    <th className="text-left py-4 px-4 font-semibold text-zinc-300">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-zinc-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700">
                  {sellers.map((seller) => (
                    <tr key={seller.user_id} className="hover:bg-zinc-900/50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold">{seller.shops?.[0]?.shop_name || 'No Shop'}</p>
                          <p className="text-sm text-zinc-400">{seller.user_id.slice(0, 8)}...</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-zinc-400">
                        {seller.shops?.[0]?.joined_date ? new Date(seller.shops[0].joined_date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-yellow-400 font-semibold">
                          {seller.shops?.[0]?.average_rating || 'N/A'} ⭐
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 w-fit ${seller.is_verified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {seller.is_verified ? (
                            <>
                              <FaCheckCircle /> Verified
                            </>
                          ) : (
                            'Pending'
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleVerifySeller(seller.user_id, seller.is_verified)}
                          className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all"
                        >
                          <FaShieldAlt /> {seller.is_verified ? 'Unverify' : 'Verify'}
                        </button>
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
