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
seller_id: string
seller_name: string
seller_avatar: string
listing_id: string
listing_title: string
last_message: string
unread: number
}

export default function BuyerMessages() {
const router = useRouter()
const searchParams = useSearchParams()
const [buyer, setBuyer] = useState<any>(null)
const [conversations, setConversations] = useState<Conversation[]>([])
const [activeConv, setActiveConv] = useState<Conversation | null>(null)
const [messages, setMessages] = useState<Message[]>([])
const [newMessage, setNewMessage] = useState('')
const [sending, setSending] = useState(false)
const [loading, setLoading] = useState(true)
const bottomRef = useRef<HTMLDivElement>(null)

useEffect(() => {
const fetchBuyer = async () => {
const { data: { user } } = await supabase.auth.getUser()
if (!user) return router.push('/login')

const { data: profile } = await supabase
.from('profiles')
.select('*')
.eq('id', user.id)
.single()

if (profile?.role !== 'buyer') return router.push('/seller/messages')

const buyerData = { ...user, ...profile }
setBuyer(buyerData)
await fetchConversations(user.id)
setLoading(false)

// URL থেকে auto open conversation
const listingId = searchParams.get('listing')
const sellerId = searchParams.get('seller')
if (listingId && sellerId) {
await autoOpenConv(user.id, sellerId, listingId, buyerData)
}
}

fetchBuyer()
}, [])

const autoOpenConv = async (
buyerId: string,
sellerId: string,
listingId: string,
buyerData: any
) => {
const { data: sellerProfile } = await supabase
.from('profiles')
.select('name, avatar_url')
.eq('id', sellerId)
.maybeSingle()

const { data: listing } = await supabase
.from('listings')
.select('title')
.eq('id', listingId)
.maybeSingle()

const conv: Conversation = {
seller_id: sellerId,
seller_name: sellerProfile?.name || 'Seller',
seller_avatar: sellerProfile?.avatar_url || '',
listing_id: listingId,
listing_title: listing?.title || 'Listing',
last_message: '',
unread: 0,
}

setActiveConv(conv)
await fetchMessages(conv, buyerData)
}

const fetchConversations = async (buyerId: string) => {
// Buyer যে messages পাঠিয়েছে সেগলো
const { data: sentMsgs } = await supabase
.from('messages')
.select('*')
.eq('sender_id', buyerId)
.order('created_at', { ascending: false })

if (!sentMsgs) return

const map = new Map<string, Conversation>()

for (const msg of sentMsgs) {
const key = `${msg.receiver_id}_${msg.listing_id}`
if (!map.has(key)) {
const { data: sellerProfile } = await supabase
.from('profiles')
.select('name, avatar_url')
.eq('id', msg.receiver_id)
.maybeSingle()

const { data: listing } = await supabase
.from('listings')
.select('title')
.eq('id', msg.listing_id)
.maybeSingle()

// Seller এর reply গলো unread count
const { count } = await supabase
.from('messages')
.select('*', { count: 'exact', head: true })
.eq('sender_id', msg.receiver_id)
.eq('receiver_id', buyerId)
.eq('listing_id', msg.listing_id)
.eq('seen', false)

map.set(key, {
seller_id: msg.receiver_id,
seller_name: sellerProfile?.name || 'Unknown Seller',
seller_avatar: sellerProfile?.avatar_url || '',
listing_id: msg.listing_id,
listing_title: listing?.title || 'Unknown Listing',
last_message: msg.message,
unread: count || 0,
})
}
}

setConversations(Array.from(map.values()))
}

const fetchMessages = async (conv: Conversation, buyerData?: any) => {
const currentBuyer = buyerData || buyer
if (!currentBuyer) return

// Buyer ↔ Seller দুইদিকের সব message
const { data } = await supabase
.from('messages')
.select('*')
.eq('listing_id', conv.listing_id)
.or(
`and(sender_id.eq.${currentBuyer.id},receiver_id.eq.${conv.seller_id}),and(sender_id.eq.${conv.seller_id},receiver_id.eq.${currentBuyer.id})`
)
.order('created_at', { ascending: true })

setMessages(data || [])

// Seller এর message গুলো seen করো
await supabase
.from('messages')
.update({ seen: true })
.eq('sender_id', conv.seller_id)
.eq('receiver_id', currentBuyer.id)
.eq('listing_id', conv.listing_id)
.eq('seen', false)

setConversations((prev) =>
prev.map((c) =>
c.seller_id === conv.seller_id && c.listing_id === conv.listing_id
? { ...c, unread: 0 }
: c
)
)
}

// Realtime
useEffect(() => {
if (!buyer || !activeConv) return

const channel = supabase
.channel('buyer-messages')
.on('postgres_changes', {
event: 'INSERT',
schema: 'public',
table: 'messages',
filter: `receiver_id=eq.${buyer.id}`,
}, (payload) => {
const msg = payload.new as Message
if (
msg.sender_id === activeConv.seller_id &&
msg.listing_id === activeConv.listing_id
) {
setMessages((prev) => [...prev, msg])
} else {
setConversations((prev) =>
prev.map((c) =>
c.seller_id === msg.sender_id && c.listing_id === msg.listing_id
? { ...c, unread: c.unread + 1, last_message: msg.message }
: c
)
)
}
})
.subscribe()

return () => { supabase.removeChannel(channel) }
}, [buyer, activeConv])

useEffect(() => {
bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
}, [messages])

const handleSelectConv = async (conv: Conversation) => {
setActiveConv(conv)
await fetchMessages(conv)
}

const handleSend = async () => {
if (!newMessage.trim() || !activeConv || !buyer || sending) return

setSending(true)

const { error } = await supabase.from('messages').insert({
sender_id: buyer.id,
receiver_id: activeConv.seller_id,
listing_id: activeConv.listing_id,
message: newMessage.trim(),
seen: false,
})

if (!error) {
setMessages((prev) => [...prev, {
id: Date.now().toString(),
sender_id: buyer.id,
receiver_id: activeConv.seller_id,
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
<h1 className="text-2xl font-bold mb-4">My Messages</h1>

<div className="flex gap-4 h-[75vh] border rounded-xl overflow-hidden bg-white shadow">

{/* Conversation List */}
<div className="w-1/3 border-r overflow-y-auto">
{conversations.length === 0 && (
<p className="text-center text-gray-400 p-6 text-sm">
No conversations yet
</p>
)}
{conversations.map((conv) => (
<div
key={`${conv.seller_id}_${conv.listing_id}`}
onClick={() => handleSelectConv(conv)}
className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 border-b transition ${
activeConv?.seller_id === conv.seller_id &&
activeConv?.listing_id === conv.listing_id
? 'bg-blue-50 border-l-4 border-l-blue-500'
: ''
}`}
>
<img
src={conv.seller_avatar || '/file.svg'}
onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/file.svg' }}
alt={conv.seller_name}
className="w-10 h-10 rounded-full object-cover"
/>
<div className="flex-1 min-w-0">
<p className="font-semibold text-sm truncate">{conv.seller_name}</p>
<p className="text-xs text-gray-400 truncate">{conv.listing_title}</p>
<p className="text-xs text-gray-500 truncate">{conv.last_message}</p>
</div>
{conv.unread > 0 && (
<span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
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
<div className="p-4 border-b flex items-center gap-3 bg-gray-50">
<img
src={activeConv.seller_avatar || '/file.svg'}
onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/file.svg' }}
alt={activeConv.seller_name}
className="w-9 h-9 rounded-full object-cover"
/>
<div>
<p className="font-semibold text-sm">{activeConv.seller_name}</p>
<p className="text-xs text-gray-400">{activeConv.listing_title}</p>
</div>
</div>

<div className="flex-1 overflow-y-auto p-4 space-y-3">
{messages.map((msg) => {
const isBuyer = msg.sender_id === buyer.id
return (
<div key={msg.id} className={`flex ${isBuyer ? 'justify-end' : 'justify-start'}`}>
<div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
isBuyer
? 'bg-blue-500 text-white rounded-br-sm'
: 'bg-gray-100 text-gray-800 rounded-bl-sm'
}`}>
{msg.message}
<p className={`text-[10px] mt-1 ${isBuyer ? 'text-blue-100' : 'text-gray-400'}`}>
{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
</p>
</div>
</div>
)
})}
<div ref={bottomRef} />
</div>

<div className="p-3 border-t flex gap-2">
<input
type="text"
value={newMessage}
onChange={(e) => setNewMessage(e.target.value)}
onKeyDown={(e) => e.key === 'Enter' && handleSend()}
placeholder="Type a message..."
className="flex-1 border rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-400"
/>
<button
onClick={handleSend}
disabled={sending || !newMessage.trim()}
className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-600 transition disabled:opacity-50"
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
