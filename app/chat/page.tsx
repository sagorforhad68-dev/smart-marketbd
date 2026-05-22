'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ChatPage() {
  const searchParams = useSearchParams()
  const listingId = searchParams.get('listing')
  const sellerId = searchParams.get('seller')
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  useEffect(() => {
    if (!user || !listingId) return
    supabase
      .from('messages')
      .select('*')
      .or(sender_id.eq.${user.id},receiver_id.eq.${user.id})
      .eq('listing_id', listingId)
      .order('created_at', { ascending: true })
      .then(({ data }) => setMessages(data || []))
  }, [user, listingId])

  const send = async () => {
    if (!input.trim()) return
    await supabase.from('messages').insert({
      listing_id: listingId,
      sender_id: user.id,
      receiver_id: sellerId,
      message: input,
    })
    setInput('')
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(sender_id.eq.${user.id},receiver_id.eq.${user.id})
      .eq('listing_id', listingId)
      .order('created_at', { ascending: true })
    setMessages(data || [])
  }

  if (!user) return <div className="text-white p-10">Please login to chat.</div>

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto bg-zinc-900 rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4">Chat</h1>
        <div className="h-80 overflow-y-auto space-y-2 mb-4">
          {messages.map((m) => (
            <div key={m.id} className={`p-2 rounded ${m.sender_id === user.id ? 'bg-green-600 ml-auto' : 'bg-zinc-700'} max-w-[80%]`}>
              {m.message}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="flex-1 bg-zinc-800 rounded p-2" value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Type a message..." />
          <button onClick={send} className="bg-green-500 px-4 py-2 rounded font-bold">Send</button>
        </div>
      </div>
    </div>
  )
}