"use client"

export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { FaPaperPlane } from 'react-icons/fa'

export default function ChatPage() {
  const [listingId, setListingId] = useState<string | null>(null)
  const [sellerId, setSellerId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Get user
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  // Get URL params
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    setListingId(params.get('listing'))
    setSellerId(params.get('seller'))
  }, [])

  // Load messages
  useEffect(() => {
    if (!user || !listingId) return

    const loadMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .eq('listing_id', listingId)
        .order('created_at', { ascending: true })
      setMessages(data || [])

      // Mark received messages as seen
      await supabase
        .from('messages')
        .update({ seen: true })
        .eq('receiver_id', user.id)
        .eq('listing_id', listingId)
        .eq('seen', false)
    }

    loadMessages()

    // FIXED: Realtime subscription
    const channel = supabase
      .channel('chat-' + listingId)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `listing_id=eq.${listingId}`,
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new])
          // Mark as seen if receiver is current user
          if (payload.new.receiver_id === user.id) {
            supabase
              .from('messages')
              .update({ seen: true })
              .eq('id', payload.new.id)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, listingId])

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || sending) return
    setSending(true)

    const newMsg = {
      listing_id: listingId,
      sender_id: user.id,
      receiver_id: sellerId,
      message: input.trim(),
      seen: false,
    }

    setInput('')

    await supabase.from('messages').insert(newMsg)
    setSending(false)
  }

  if (!user) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
      Please login to chat.
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <div className="max-w-2xl w-full mx-auto flex flex-col flex-1 p-4">

        {/* Header */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-t-2xl px-5 py-4">
          <h1 className="text-lg font-bold">Chat</h1>
          <p className="text-zinc-500 text-xs">About listing #{listingId?.slice(0, 8)}</p>
        </div>

        {/* Messages */}
        <div className="flex-1 bg-zinc-900/50 border-x border-zinc-800 overflow-y-auto p-4 space-y-3 min-h-[400px] max-h-[60vh]">
          {messages.length === 0 && (
            <p className="text-center text-zinc-600 text-sm pt-10">No messages yet. Say hello!</p>
          )}
          {messages.map((m) => {
            const isMe = m.sender_id === user.id
            return (
              <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`
                  px-4 py-2 rounded-2xl max-w-[75%] text-sm
                  ${isMe
                    ? 'bg-emerald-600 text-white rounded-br-sm'
                    : 'bg-zinc-700 text-white rounded-bl-sm'
                  }
                `}>
                  <p>{m.message}</p>
                  <p className={`text-[10px] mt-1 ${isMe ? 'text-emerald-200 text-right' : 'text-zinc-400'}`}>
                    {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {isMe && (
                      <span className="ml-1">{m.seen ? ' ✓✓' : ' ✓'}</span>
                    )}
                  </p>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-b-2xl p-3 flex gap-2">
          <input
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Type a message..."
          />
          <button
            onClick={send}
            disabled={sending || !input.trim()}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 rounded-xl font-bold transition flex items-center gap-2"
          >
            <FaPaperPlane />
          </button>
        </div>

      </div>
    </div>
  )
}