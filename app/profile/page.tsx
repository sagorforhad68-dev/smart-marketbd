'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [listings, setListings] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else setUser(user)
    })
  }, [])

  useEffect(() => {
    if (user) {
      supabase.from('listings').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
        .then(({ data }) => setListings(data || []))
    }
  }, [user])

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <h1 className="text-2xl font-bold mb-6">My Listings</h1>
      {listings.length === 0 ? <p>No listings yet.</p> :
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.map((l: any) => (
            <div key={l.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <h3 className="font-bold">{l.title}</h3>
                <p>৳{l.price} {l.is_sold && '(Sold)'}</p>
              </div>
              <a href={`/listings/${l.id}`} className="text-blue-500">View</a>
            </div>
          ))}
        </div>
      }
    </div>
  )
}