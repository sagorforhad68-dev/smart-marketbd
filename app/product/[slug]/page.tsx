'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Listing, Shop } from '@/lib/types'
import { fetchListingBySlug } from '@/lib/listings'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaShare, FaStar, FaPhone, FaCalendar, FaCheckCircle, FaComment, FaStore, FaImage } from 'react-icons/fa'

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<Listing | null>(null)
  const [shop, setShop] = useState<Shop | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [message, setMessage] = useState('')
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [sending, setSending] = useState(false)
  const [chatImage, setChatImage] = useState<File | null>(null)
  const [chatImagePreview, setChatImagePreview] = useState('')
  const messagesEndRef = useRef<any>(null)
  const router = useRouter()

  const fetchProduct = useCallback(async () => {
    try {
      const { listing, error } = await fetchListingBySlug(slug)
      if (error || !listing) {
        router.push('/')
        return
      }
      setProduct(listing as Listing)
      const { data: shopData } = await supabase
        .from('shops')
        .select('*')
        .eq('seller_id', listing.user_id)
        .maybeSingle()
      setShop(shopData)
      const { data: userData } = await supabase.auth.getUser()
      setCurrentUser(userData?.user || null)
    } catch (err) {
      router.push('/')
    } finally {
      setLoading(false)
    }
  }, [slug, router])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  const fetchMessages = useCallback(async () => {
    if (!currentUser || !shop) return
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or('sender_id.eq.' + currentUser.id + ',receiver_id.eq.' + currentUser.id)
      .order('inserted_at', { ascending: true })
    setChatMessages(data || [])
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }, [currentUser, shop])

  useEffect(() => {
    if (showChat) fetchMessages()
  }, [showChat, fetchMessages])

  useEffect(() => {
    if (!showChat || !currentUser || !shop) return
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        fetchMessages()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [showChat, currentUser, shop, fetchMessages])

  const sendMessage = async () => {
    if ((!message.trim() && !chatImage) || !currentUser || !shop) return
    setSending(true)

    let imageUrl = ''
    if (chatImage) {
      const fileExt = chatImage.name.split('.').pop() || 'jpg'
      const fileName = currentUser.id + '-msg-' + Date.now() + '.' + fileExt
      const { error: uploadError } = await supabase.storage
        .from('shop-logos')
        .upload(fileName, chatImage, { cacheControl: '3600', upsert: true, contentType: chatImage.type })
      if (!uploadError) {
        const { data: publicData } = supabase.storage.from('shop-logos').getPublicUrl(fileName)
        imageUrl = publicData?.publicUrl || ''
      }
      setChatImage(null)
      setChatImagePreview('')
    }

    await supabase.from('messages').insert({
      sender_id: currentUser.id,
      receiver_id: shop.seller_id,
      message: message,
      content: message,
      image_url: imageUrl,
      listing_id: product?.id || null,
    })
    setMessage('')
    await fetchMessages()
    setSending(false)
  }

  const handleWhatsApp = () => {
    if (!product?.phone) return
    const phone = product.phone.replace(/\D/g, '')
    const text = 'Hi, I am interested in your product: ' + product.title
    window.open('https://wa.me/88' + phone + '?text=' + encodeURIComponent(text), '_blank')
  }

  const copyLink = () => {
    const link = window.location.origin + '/product/' + slug
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-zinc-400">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07070a] via-[#0b0b12] to-[#050508] text-white">
      <div className="px-4 md:px-8 pt-6">
        <Link href="/" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors">
          <FaArrowLeft /> Back to Marketplace
        </Link>
      </div>

      <div className="px-4 md:px-8 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-zinc-900 rounded-xl overflow-hidden aspect-square relative flex items-center justify-center">
            {product.image_url ? (
              <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <p className="text-zinc-400">No image available</p>
            )}
            {product.type === 'hot_deal' && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">HOT DEAL</div>
            )}
            {product.condition === 'used' && (
              <div className="absolute top-4 left-4 bg-amber-500 text-black px-4 py-2 rounded-full font-bold">USED</div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black mb-2">{product.title}</h1>
              <div className="flex items-center gap-4 text-zinc-400 text-sm">
                <span>{product.category}</span>
                <span>•</span>
                <span className="capitalize">{product.condition}</span>
                {product.seller_verified && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-green-400">
                      <FaCheckCircle /> Verified Seller
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="border-b border-zinc-700 pb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <p className="text-4xl font-black text-green-400">৳{product.price.toLocaleString()}</p>
                {product.original_price != null && product.original_price > product.price && (
                  <>
                    <p className="text-xl text-zinc-500 line-through">৳{product.original_price.toLocaleString()}</p>
                    <p className="text-sm bg-red-500/20 text-red-400 px-2 py-1 rounded font-bold">
                      {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                    </p>
                  </>
                )}
              </div>
              {product.negotiable && <p className="text-blue-400 text-sm">Price is negotiable</p>}
            </div>

            <div>
              <h3 className="text-lg font-bold mb-3">Description</h3>
              <p className="text-zinc-300 whitespace-pre-wrap">{product.description}</p>
            </div>

            {product.type === 'hot_deal' && (
              <div className="bg-orange-500/20 border border-orange-500 text-orange-400 p-4 rounded-xl">
                <p className="font-bold mb-1">Limited Stock Available</p>
                <p className="text-sm">Only {product.stock || 1} left in stock. Act fast!</p>
              </div>
            )}

            <a
              href={'tel:' + product.phone}
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-400 text-black font-black py-4 rounded-xl text-lg transition-all"
            >
              <FaPhone /> Call Seller
            </a>

            <button
              onClick={() => {
                if (!currentUser) { router.push('/login'); return }
                setShowChat(true)
              }}
              className="flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-400 text-white font-black py-4 rounded-xl text-lg transition-all"
            >
              <FaComment /> Message Seller (In-App)
            </button>

            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20c55a] text-white font-black py-4 rounded-xl text-lg transition-all"
            >
              <FaComment /> Message on WhatsApp
            </button>

            <button
              type="button"
              onClick={copyLink}
              className="flex items-center justify-center gap-2 w-full border border-zinc-600 hover:border-zinc-400 text-zinc-300 font-bold py-3.5 rounded-xl transition-all"
            >
              <FaShare /> {copied ? 'Link copied!' : 'Share product link'}
            </button>
          </div>
        </div>

        {shop && (
          <div className="max-w-6xl mx-auto mt-16 bg-zinc-900 border border-zinc-700 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6">Seller Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Link href={'/shop/' + shop.id} className="flex items-center gap-3 mb-4 hover:opacity-80 transition-all">
                  {shop.logo_url ? (
                    <img src={shop.logo_url} alt={shop.shop_name} className="w-16 h-16 rounded-xl object-cover border-2 border-green-500" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-zinc-800 flex items-center justify-center border-2 border-zinc-600">
                      <FaStore className="text-2xl text-zinc-500" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      {shop.shop_name}
                      {shop.is_verified && (
                        <span className="text-green-400 inline-flex items-center gap-1 text-sm">
                          <FaCheckCircle /> Verified
                        </span>
                      )}
                    </h3>
                    <p className="text-green-400 text-sm">View Shop →</p>
                  </div>
                </Link>
                <p className="text-zinc-300">{shop.description}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FaStar className="text-yellow-400 text-xl" />
                  <div>
                    <p className="text-sm text-zinc-400">Average Rating</p>
                    <p className="font-bold">{shop.average_rating || 'No ratings yet'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaCalendar className="text-blue-400 text-xl" />
                  <div>
                    <p className="text-sm text-zinc-400">Member Since</p>
                    <p className="font-bold">{shop.joined_date ? new Date(shop.joined_date).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
                <Link
                  href={'/shop/' + shop.id}
                  className="flex items-center justify-center gap-2 w-full bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-3 rounded-xl mt-4 transition-all"
                >
                  <FaStore /> Visit Shop
                </Link>
                <a
                  href={'tel:' + product.phone}
                  className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-xl transition-all"
                >
                  <FaPhone /> Call Seller
                </a>
                <button
                  onClick={() => {
                    if (!currentUser) { router.push('/login'); return }
                    setShowChat(true)
                  }}
                  className="flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 rounded-xl transition-all"
                >
                  <FaComment /> Message Seller
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto mt-12 bg-zinc-900 border border-zinc-700 rounded-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6">Contact Seller</h2>
          <div className="flex items-center gap-4">
            <FaPhone className="text-green-400 text-2xl" />
            <div>
              <p className="text-sm text-zinc-400">Phone Number</p>
              <p className="text-lg font-bold">{product.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {showChat && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg flex flex-col" style={{height: '70vh'}}>
            <div className="flex items-center justify-between p-4 border-b border-zinc-700">
              <div className="flex items-center gap-3">
                {shop?.logo_url ? (
                  <img src={shop.logo_url} alt={shop.shop_name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                    <FaStore className="text-zinc-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-black text-lg">{shop?.shop_name}</h3>
                  <p className="text-zinc-400 text-xs">Usually replies quickly</p>
                </div>
              </div>
              <button onClick={() => setShowChat(false)} className="text-zinc-400 hover:text-white text-2xl">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 && (
                <p className="text-center text-zinc-500 mt-10">No messages yet. Say hi!</p>
              )}
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={'flex ' + (msg.sender_id === currentUser?.id ? 'justify-end' : 'justify-start')}>
                  <div className={'px-4 py-2 rounded-2xl max-w-xs text-sm ' + (msg.sender_id === currentUser?.id ? 'bg-green-500 text-black' : 'bg-zinc-700 text-white')}>
                    {(msg.content || msg.message) && <p>{msg.content || msg.message}</p>}
                    {msg.image_url && (
                      <img src={msg.image_url} alt="sent image" className="w-48 h-48 object-cover rounded-xl mt-2 cursor-pointer" onClick={() => window.open(msg.image_url, '_blank')} />
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {chatImagePreview && (
              <div className="px-4 pt-2">
                <div className="relative inline-block">
                  <img src={chatImagePreview} alt="preview" className="w-20 h-20 object-cover rounded-xl" />
                  <button onClick={() => { setChatImage(null); setChatImagePreview('') }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">✕</button>
                </div>
              </div>
            )}

            <div className="p-4 border-t border-zinc-700 flex gap-2 items-center">
              <label htmlFor="chat-image" className="cursor-pointer text-zinc-400 hover:text-green-400 transition-all p-2">
                <FaImage className="text-xl" />
                <input
                  type="file"
                  id="chat-image"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setChatImage(file)
                      setChatImagePreview(URL.createObjectURL(file))
                    }
                  }}
                />
              </label>
              <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-zinc-800 border border-zinc-600 text-white p-3 rounded-xl outline-none focus:border-green-500"
              />
              <button
                onClick={sendMessage}
                disabled={sending}
                className="bg-green-500 hover:bg-green-400 text-black font-black px-5 py-3 rounded-xl transition-all disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}