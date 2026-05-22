'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function ListingDetail() {
  const { id } = useParams()
  const [listing, setListing] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    supabase.from('listings').select('*').eq('id', id).single().then(({ data }) => setListing(data))
  }, [id])

  const handleSold = async () => {
    await supabase.from('listings').update({ is_sold: true }).eq('id', id)
    router.push('/')
  }

  if (!listing) return <div className="text-center p-10">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 bg-white rounded-xl shadow">
      <img src={listing.image_url || '/placeholder.jpg'} className="w-full h-80 object-cover rounded" />
      <h1 className="text-2xl font-bold mt-6">{listing.title}</h1>
      <p className="text-xl text-green-600 font-bold mt-2">৳{listing.price}</p>
      <p className="mt-4 text-gray-700">{listing.description}</p>
      <div className="flex gap-4 mt-4 text-sm">
        <span>Category: {listing.category}</span>
        <span>Condition: {listing.condition}</span>
        <span>Type: {listing.type === 'single' ? 'Single item' : 'Regular'}</span>
      </div>
      <div className="mt-6 flex gap-4 items-center flex-wrap">
        <a href={`tel:${listing.phone}`} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-400">
          Call: {listing.phone}
        </a>
        <Link href={`/chat?listing=${id}&seller=${listing.user_id}`}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-400">
          Message Seller
        </Link>
        {user && user.id === listing.user_id && !listing.is_sold && (
          <button onClick={handleSold} className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-400">
            Mark as Sold
          </button>
        )}
      </div>
      {listing.is_sold && <p className="mt-4 text-red-600 font-bold">This item has been sold.</p>}
    </div>
  )
}