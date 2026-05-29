'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaPhone, FaComment, FaMapMarkerAlt, FaCheckCircle, FaStar, FaStore } from 'react-icons/fa'

export default function ShopPage() {
  const params = useParams()
  const shopId = params.id as string
  const router = useRouter()

  const [shop, setShop] = useState<any>(null)
  const [listings, setListings] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showChat, setShowChat] = useState(false)
  const [message, setMessage] = useState('')
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [sending, setSending] = useState(false)

  const fetchShopData = useCallback(async () => {
    const { data: shopData } = await supabase
      .from('shops')
      .select('*')
      .eq('id', shopId)
      .maybeSingle()

    if (!shopData) { router.push('/'); return }

    setShop(shopData)

    const { data: listingData } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', shopData.seller_id)
      .eq('is_sold', false)
      .order('created_at', { ascending: false })

    if (listingData) {
      setListings(listingData)
      setFiltered(listingData)
      const cats = ['All', ...Array.from(new Set(listingData.map((l: any) => l.category).filter(Boolean)))]
      setCategories(cats)
    }

    const { data: userData } = await supabase.auth.getUser()
    setCurrentUser(userData?.user || null)
    setLoading(false)
  }, [shopId, router])

  useEffect(() => { fetchShopData() }, [fetchShopData])

  useEffect(() => {
    if (listings.length === 0) return
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % Math.min(listings.length, 5))
    }, 3000)
    return () => clearInterval(interval)
  }, [listings])

  const filterCategory = (cat: string) => {
    setActiveCategory(cat)
    if (cat === 'All') setFiltered(listings)
    else setFiltered(listings.filter(l => l.category === cat))
  }

  const fetchMessages = useCallback(async () => {
    if (!currentUser || !shop) return
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
      .order('created_at', { ascending: true })
    setChatMessages(data || [])
  }, [currentUser, shop])

  useEffect(() => {
    if (!showChat) return
    fetchMessages()

    // FIXED: Realtime for chat modal
    const channel = supabase
      .channel('shop-chat-' + shopId)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, (payload) => {
        setChatMessages(prev => [...prev, payload.new])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [showChat, fetchMessages, shopId])

  const sendMessage = async () => {
    if (!message.trim() || !currentUser || !shop || sending) return
    setSending(true)
    await supabase.from('messages').insert({
      sender_id: currentUser.id,
      receiver_id: shop.seller_id,
      // FIXED: 'message' field — 'content' না
      message: message.trim(),
      listing_id: null,
      seen: false,
    })
    setMessage('')
    setSending(false)
  }

  const handleWhatsApp = () => {
    if (!shop?.phone) return
    const phone = shop.phone.replace(/\D/g, '')
    window.open('https://wa.me/88' + phone, '_blank')
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
    </div>
  )

  if (!shop) return null

  const sliderImages = listings.slice(0, 5).filter(l => l.image_url)

  // FIXED: slug fallback
  const getProductHref = (item: any) =>
    '/product/' + (item.slug || item.seo_slug || item.id)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07070a] via-[#0b0b12] to-[#050508] text-white">

      {/* Back */}
      <div className="px-4 pt-6">
        <Link href="/" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300">
          <FaArrowLeft /> Back to Marketplace
        </Link>
      </div>

      {/* Hero Slider */}
      {sliderImages.length > 0 && (
        <div className="relative mx-4 mt-4 h-64 overflow-hidden rounded-2xl md:h-96" style={{ width: 'calc(100% - 2rem)' }}>
          {sliderImages.map((item, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-700 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-white font-black text-2xl">{item.title}</p>
                <p className="text-green-400 font-bold text-xl">৳{item.price?.toLocaleString()}</p>
              </div>
            </div>
          ))}
          <div className="absolute bottom-3 right-6 flex gap-2">
            {sliderImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-green-400 w-4' : 'w-2 bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Shop Info */}
      <div className="px-4 md:px-8 mt-8">
        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start">
          {shop.logo_url ? (
            <img src={shop.logo_url} alt={shop.shop_name} className="w-24 h-24 rounded-2xl object-cover border-2 border-green-500" />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-zinc-800 flex items-center justify-center border-2 border-zinc-600">
              <FaStore className="text-4xl text-zinc-500" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black">{shop.shop_name}</h1>
              {shop.is_verified && (
                <span className="flex items-center gap-1 text-green-400 text-sm bg-green-500/10 px-2 py-1 rounded-full">
                  <FaCheckCircle /> Verified
                </span>
              )}
            </div>
            <p className="text-zinc-400 mb-4">{shop.description || 'No description available'}</p>
            <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
              <span className="flex items-center gap-1">
                <FaStar className="text-yellow-400" /> {shop.average_rating || 0} Rating
              </span>
              <span>{shop.total_sales || 0} Sales</span>
              <span>Joined {shop.joined_date ? new Date(shop.joined_date).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto">
            {shop.phone && (
              <a href={'tel:' + shop.phone}
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black font-black px-6 py-3 rounded-xl transition-all">
                <FaPhone /> Call Seller
              </a>
            )}
            <button
              onClick={() => { if (!currentUser) { router.push('/login'); return } setShowChat(true) }}
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-black px-6 py-3 rounded-xl transition-all"
            >
              <FaComment /> Message
            </button>
            {shop.phone && (
              <button onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20c55a] text-white font-black px-6 py-3 rounded-xl transition-all">
                WhatsApp
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Location */}
      {shop.address && (
        <div className="px-4 md:px-8 mt-6">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-400" /> Location
            </h2>
            <p className="text-zinc-300 mb-4">{shop.address}</p>
            
              href={'https://www.google.com/maps/search/' + encodeURIComponent(shop.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white font-bold px-5 py-2.5 rounded-xl transition-all"
            >
              <FaMapMarkerAlt /> Open in Google Maps
            </a>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="px-4 md:px-8 mt-8">
        <h2 className="text-2xl font-black mb-4">Products</h2>
        <div className="flex gap-3 overflow-x-auto pb-3">
          {categories.map(cat => (
            <button key={cat} onClick={() => filterCategory(cat)}
              className={`px-5 py-2 rounded-full font-bold whitespace-nowrap transition-all ${
                activeCategory === cat ? 'bg-green-500 text-black' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-4 md:px-8 mt-6 pb-20">
        {filtered.length === 0 ? (
          <div className="text-center text-zinc-400 py-20">No products found</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(item => (
              // FIXED: slug fallback with seo_slug and id
              <Link key={item.id} href={getProductHref(item)}
                className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden hover:border-green-500 transition-all group">
                <div className="aspect-square overflow-hidden bg-zinc-800">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">No Image</div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-bold text-sm truncate">{item.title}</p>
                  <p className="text-green-400 font-black">৳{item.price?.toLocaleString()}</p>
                  {item.category && (
                    <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">{item.category}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg flex flex-col" style={{ height: '70vh' }}>
            <div className="flex items-center justify-between p-4 border-b border-zinc-700">
              <h3 className="font-black text-lg">{shop.shop_name}</h3>
              <button onClick={() => setShowChat(false)} className="text-zinc-400 hover:text-white text-2xl">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 && (
                <p className="text-center text-zinc-500 mt-10">No messages yet. Say hi!</p>
              )}
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-4 py-2 rounded-2xl max-w-xs text-sm ${msg.sender_id === currentUser?.id ? 'bg-green-500 text-black' : 'bg-zinc-700 text-white'}`}>
                    {/* FIXED: 'message' field — 'content' না */}
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-zinc-700 flex gap-3">
              <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-zinc-800 border border-zinc-600 text-white p-3 rounded-xl outline-none focus:border-green-500"
              />
              <button onClick={sendMessage} disabled={sending}
                className="bg-green-500 hover:bg-green-400 text-black font-black px-5 rounded-xl transition-all disabled:opacity-50">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}