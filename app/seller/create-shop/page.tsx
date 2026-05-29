'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaStore, FaCheckCircle } from 'react-icons/fa'

export default function CreateShopPage() {
  const [shopName, setShopName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleCreateShop = async () => {
    setError('')

    if (!shopName.trim()) {
      setError('Shop name is required')
      return
    }

    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    try {
      // FIXED: profiles.role = 'seller' update — login redirect এর জন্য দরকার
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'seller' })
        .eq('id', user.id)

      if (profileError) throw profileError

      // seller_roles table (backward compatibility)
      const { data: existingSeller } = await supabase
        .from('seller_roles')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!existingSeller) {
        const { error: sellerError } = await supabase
          .from('seller_roles')
          .insert({
            user_id: user.id,
            is_verified: false,
            total_sales: 0,
            joined_date: new Date().toISOString(),
          })
        if (sellerError) throw sellerError
      }

      // Shop create or update
      const { data: existingShop } = await supabase
        .from('shops')
        .select('id')
        .eq('seller_id', user.id)
        .maybeSingle()

      if (!existingShop) {
        const { error: shopError } = await supabase
          .from('shops')
          .insert({
            seller_id: user.id,
            shop_name: shopName.trim(),
            is_verified: false,
            joined_date: new Date().toISOString(),
            total_sales: 0,
          })
        if (shopError) throw shopError
      } else {
        const { error: shopError } = await supabase
          .from('shops')
          .update({ shop_name: shopName.trim() })
          .eq('seller_id', user.id)
        if (shopError) throw shopError
      }

      router.push('/seller/dashboard')

    } catch (err: any) {
      setError(err.message || 'Error creating shop')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07070a] via-[#0b0b12] to-[#050508] text-white">
      <div className="px-8 pt-6">
        <Link href="/" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors">
          <FaArrowLeft /> Back to Marketplace
        </Link>
      </div>

      <div className="px-4 md:px-8 py-16">
        <div className="max-w-2xl mx-auto">

          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-green-500 to-blue-600 p-8 rounded-2xl inline-block">
              <FaStore className="text-5xl text-white" />
            </div>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4">Start Your Seller Journey</h1>
            <p className="text-lg text-zinc-300">Create your shop to unlock the full seller experience on Smart MarketBD</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              { title: 'Manage Inventory', desc: 'Easily manage all your products in one place' },
              { title: 'Analytics', desc: 'Track your sales and customer insights' },
              { title: 'Get Verified', desc: 'Build trust with buyer verification badges' },
              { title: 'Hot Deals', desc: 'Promote limited-time offers to buyers' },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-zinc-900 border border-zinc-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <FaCheckCircle className="text-green-400 text-2xl" />
                  <h3 className="font-bold text-lg">{title}</h3>
                </div>
                <p className="text-zinc-400">{desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-8">
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-xl mb-6">
                {error}
              </div>
            )}

            <div className="mb-6">
              <label className="text-zinc-400 text-sm font-semibold block mb-3">Shop Name</label>
              <input
                type="text"
                placeholder="Enter your shop name"
                value={shopName}
                onChange={e => setShopName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreateShop()}
                className="w-full bg-zinc-800 border border-zinc-700 text-white p-4 rounded-xl outline-none focus:border-green-500 text-base"
              />
              <p className="text-zinc-500 text-sm mt-2">This is how customers will see your shop name</p>
            </div>

            <button
              onClick={handleCreateShop}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-400 text-black font-black py-4 rounded-xl text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Shop...' : 'Create My Shop'}
            </button>

            <p className="text-center text-zinc-400 mt-6 text-sm">
              By creating a shop, you agree to our Seller Terms & Conditions
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}