'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Message {
id: string
sender_id: string
receiver_id: string
listing_id: string
message: string
seen: boolean
created_at: string
}

interface Conversation {
buyer_id: string
buyer_name: string
buyer_avatar: string
listing_id: string
listing_title: string
last_message: string
unread: number
}

export default function SellerMessages() {
const router = useRouter()
const searchParams = useSearchParams()
const [seller, setSeller] = useState<any>(null)
const [conversations, setConversations] = useState<Conversation[]>([])
const [activeConv, setActiveConv] = useState<Conversation | null>(null)
const [messages, setMessages] = useState<Message[]>([])
const [newMessage, setNewMessage] = useState('')
const [sending, setSending] = useState(false)
const [loading, setLoading] = useState(true)
const bottomRef = useRef<HTMLDivElement>(null)

// Seller load
useEffect(() => {
const fetchSeller = async () => {
const { data: { user } } = await supabase.auth.getUser()
if (!user) return router.push('/login')

const { data: profile } = await supabase
.from('profiles')
.select('*')
.eq('id', user.id)
.single()

if (profile?.role !== 'seller') return router.push('/buyer/messages')

setSeller({ ...user, ...profile })
await fetchConversations(user.id)
setLoading(false)
}

fetchSeller()
}, [])

// Conversations fetch
const fetchConversations = async (sellerId: string) => {
const { data: msgs } = await supabase
.from('messages')
.select('*')
.eq('receiver_id', sellerId)
.order('created_at', { ascending: false })

if (!msgs) return

// Unique buyer+listing combinations
const map = new Map<string, Conversation>()

for (const msg of msgs) {
const key = `${msg.sender_id}_${msg.listing_id}`
if (!map.has(key)) {
// Buyer profile fetch
const { data: buyerProfile } = await supabase
.from('profiles')
.select('name, avatar_url')
.eq('id', msg.sender_id)
.maybeSingle()

// Listing title fetch
const { data: listing } = await supabase
.from('listings')
.select('title')
.eq('id', msg.listing_id)
.maybeSingle()

// Unread count
const { count } = await supabase
.from('messages')
.select('*', { count: 'exact', head: true })
.eq('sender_id', msg.sender_id)
.eq('receiver_id', sellerId)
.eq('listing_id', msg.listing_id)
.eq('seen', false)

map.set(key, {
buyer_id: msg.sender_id,
buyer_name: buyerProfile?.name || 'Unknown Buyer',
buyer_avatar: buyerProfile?.avatar_url || '',
listing_id: msg.listing_id,
listing_title: listing?.title || 'Unknown Listing',
last_message: msg.message,
unread: count || 0,
})
}
}

setConversations(Array.from(map.values()))
}

// Messages fetch for active conversation
const fetchMessages = async (conv: Conversation) => {
if (!seller) return

const { data } = await supabase
.from('messages')
.select('*')
.eq('listing_id', conv.listing_id)
.or(`sender_id.eq.${conv.buyer_id},receiver_id.eq.${conv.buyer_id}`)
.order('created_at', { ascending: true })

setMessages(data || [])

// Mark as seen
await supabase
.from('messages')
.update({ seen: true })
.eq('sender_id', conv.buyer_id)
.eq('receiver_id', seller.id)
.eq('listing_id', conv.listing_id)
.eq('seen', false)

// Unread reset
setConversations((prev) =>
prev.map((c) =>
c.buyer_id === conv.buyer_id && c.listing_id === conv.listing_id
? { ...c, unread: 0 }
: c
)
)
}

// Realtime subscription
useEffect(() => {
if (!seller || !activeConv) return

const channel = supabase
.channel('seller-messages')
.on('postgres_changes', {
event: 'INSERT',
schema: 'public',
table: 'messages',
filter: `receiver_id=eq.${seller.id}`,
}, (payload) => {
const msg = payload.new as Message
if (
msg.sender_id === activeConv.buyer_id &&
msg.listing_id === activeConv.listing_id
) {
setMessages((prev) => [...prev, msg])
} else {
// অন্য conversation এ unread বাড়াও
setConversations((prev) =>
prev.map((c) =>
c.buyer_id === msg.sender_id && c.listing_id === msg.listing_id
? { ...c, unread: c.unread + 1, last_message: msg.message }
: c
)
)
}
})
.subscribe()

return () => { supabase.removeChannel(channel) }
}, [seller, activeConv])

// Auto scroll
useEffect(() => {
bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
}, [messages])

const handleSelectConv = async (conv: Conversation) => {
setActiveConv(conv)
await fetchMessages(conv)
}

const handleSend = async () => {
if (!newMessage.trim() || !activeConv || !seller || sending) return

setSending(true)

const { error } = await supabase.from('messages').insert({
sender_id: seller.id,
receiver_id: activeConv.buyer_id,
listing_id: activeConv.listing_id,
message: newMessage.trim(),
seen: false,
})

if (!error) {
setMessages((prev) => [...prev, {
id: Date.now().toString(),
sender_id: seller.id,
receiver_id: activeConv.buyer_id,
listing_id: activeConv.listing_id,
message: newMessage.trim(),
seen: false,
created_at: new Date().toISOString(),
}])
setNewMessage('')
}

setSending(false)
}

if (loading) return (
<div className="text-center p-10 text-gray-500">Loading...</div>
)

return (
<div className="max-w-5xl mx-auto p-4 mt-6">
<h1 className="text-2xl font-bold mb-4">Messages</h1>

<div className="flex gap-4 h-[75vh] border rounded-xl overflow-hidden bg-white shadow">

{/* Conversation List */}
<div className="w-1/3 border-r overflow-y-auto">
{conversations.length === 0 && (
<p className="text-center text-gray-400 p-6 text-sm">No messages yet</p>
)}
{conversations.map((conv) => (
<div
key={`${conv.buyer_id}_${conv.listing_id}`}
onClick={() => handleSelectConv(conv)}
className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 border-b transition ${
activeConv?.buyer_id === conv.buyer_id &&
activeConv?.listing_id === conv.listing_id
? 'bg-green-50 border-l-4 border-l-green-500'
: ''
}`}
>
<img
src={conv.buyer_avatar || '/file.svg'}
onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/file.svg' }}
alt={conv.buyer_name}
className="w-10 h-10 rounded-full object-cover"
/>
<div className="flex-1 min-w-0">
<p className="font-semibold text-sm truncate">{conv.buyer_name}</p>
<p className="text-xs text-gray-400 truncate">{conv.listing_title}</p>
<p className="text-xs text-gray-500 truncate">{conv.last_message}</p>
</div>
{conv.unread > 0 && (
<span className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5">
{conv.unread}
</span>
)}
</div>
))}
</div>

{/* Chat Area */}
<div className="flex-1 flex flex-col">
{!activeConv ? (
<div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
Select a conversation
</div>
) : (
<>
{/* Chat Header */}
<div className="p-4 border-b flex items-center gap-3 bg-gray-50">
<img
src={activeConv.buyer_avatar || '/file.svg'}
onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/file.svg' }}
alt={activeConv.buyer_name}
className="w-9 h-9 rounded-full object-cover"
/>
<div>
<p className="font-semibold text-sm">{activeConv.buyer_name}</p>
<p className="text-xs text-gray-400">{activeConv.listing_title}</p>
</div>
</div>

{/* Messages */}
<div className="flex-1 overflow-y-auto p-4 space-y-3">
{messages.map((msg) => {
const isSeller = msg.sender_id === seller.id
return (
<div key={msg.id} className={`flex ${isSeller ? 'justify-end' : 'justify-start'}`}>
<div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
isSeller
? 'bg-green-500 text-white rounded-br-sm'
: 'bg-gray-100 text-gray-800 rounded-bl-sm'
}`}>
{msg.message}
<p className={`text-[10px] mt-1 ${isSeller ? 'text-green-100' : 'text-gray-400'}`}>
{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
</p>
</div>
</div>
)
})}
<div ref={bottomRef} />
</div>

{/* Input */}
<div className="p-3 border-t flex gap-2">
<input
type="text"
value={newMessage}
onChange={(e) => setNewMessage(e.target.value)}
onKeyDown={(e) => e.key === 'Enter' && handleSend()}
placeholder="Type a message..."
className="flex-1 border rounded-xl px-4 py-2 text-sm outline-none focus:border-green-400"
/>
<button
onClick={handleSend}
disabled={sending || !newMessage.trim()}
className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-green-600 transition disabled:opacity-50"
>
{sending ? '...' : 'Send'}
</button>
</div>
</>
)}
</div>
</div>
</div>
)
}