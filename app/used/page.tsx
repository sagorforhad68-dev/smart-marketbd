'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ListingCard from '@/components/ListingCard'
import Link from 'next/link'

export default function UsedItemsPage() {
  const [listings, setListings] = useState<any[]>([])

  useEffect(() => {
    supabase
      .from('listings')
      .select('*')
      .eq('condition', 'used')
      .eq('is_sold', false)
      .order('created_at', { ascending: false })
      .then(({ data }) => setListings(data || []))
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black mb-2">🔄 Used Items</h1>
        <p className="text-zinc-400 mb-8">Pre-owned goods looking for a new home.</p>
        <Link href="/post" className="inline-block mb-8 bg-green-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-green-400">
          + Sell a Used Item
        </Link>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
        {listings.length === 0 && <p className="text-zinc-500 mt-10">No used items yet.</p>}
      </div>
    </div>
  )
}