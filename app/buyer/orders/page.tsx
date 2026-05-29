'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { FaArrowLeft, FaBox, FaCheckCircle, FaTruck, FaClock, FaTimes, FaUndo } from 'react-icons/fa'

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending:    { label: 'Pending',    color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30', icon: FaClock },
  confirmed:  { label: 'Confirmed', color: 'text-blue-400 bg-blue-400/10 border-blue-400/30',       icon: FaCheckCircle },
  processing: { label: 'Processing',color: 'text-purple-400 bg-purple-400/10 border-purple-400/30', icon: FaBox },
  shipped:    { label: 'Shipped',   color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',       icon: FaTruck },
  delivered:  { label: 'Delivered', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30', icon: FaCheckCircle },
  cancelled:  { label: 'Cancelled', color: 'text-red-400 bg-red-400/10 border-red-400/30',          icon: FaTimes },
  refunded:   { label: 'Refunded',  color: 'text-zinc-400 bg-zinc-400/10 border-zinc-400/30',       icon: FaUndo },
}

export default function OrdersPage() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/login'); return }
      setUser(u)

      const { data } = await supabase
        .from('orders')
        .select(`
          *,
          listing:listing_id (
            title,
            image_url,
            price
          )
        `)
        .eq('user_id', u.id)
        .order('created_at', { ascending: false })

      setOrders(data || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-blue-400 animate-pulse">Loading orders...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900/40 via-zinc-950 to-zinc-950 px-4 pt-6 pb-8">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link href="/buyer/home">
            <FaArrowLeft className="text-blue-400 hover:text-blue-300 cursor-pointer" />
          </Link>
          <h1 className="text-2xl font-bold">My Orders</h1>
          {orders.length > 0 && (
            <span className="ml-auto text-xs text-zinc-500">{orders.length} order{orders.length > 1 ? 's' : ''}</span>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6">

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <FaBox className="text-6xl text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg mb-2">No orders yet</p>
            <p className="text-zinc-600 text-sm mb-6">Your orders will appear here after purchase</p>
            <Link
              href="/buyer/home"
              className="inline-block rounded-xl bg-gradient-to-r from-blue-500 to-blue-400 px-6 py-2.5 text-sm font-bold text-white"
            >
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => {
              const status = STATUS_CONFIG[order.status] || STATUS_CONFIG['pending']
              const StatusIcon = status.icon

              return (
                <div key={order.id} className="rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden">

                  {/* Order Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <p className="text-xs text-zinc-500">
                      Order #{order.id?.slice(0, 8).toUpperCase()}
                    </p>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${status.color}`}>
                      <StatusIcon className="text-[10px]" />
                      {status.label}
                    </span>
                  </div>

                  {/* Order Body */}
                  <div className="flex gap-3 p-4">
                    {/* Product Image */}
                    {order.listing?.image_url ? (
                      <img
                        src={order.listing.image_url}
                        alt={order.listing?.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
                        <FaBox className="text-zinc-600" />
                      </div>
                    )}

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {order.listing?.title || 'Product'}
                      </p>
                      <p className="text-emerald-400 font-bold mt-1">
                        ৳{order.total_price || order.listing?.price || 0}
                      </p>
                      <p className="text-zinc-600 text-xs mt-1">
                        {new Date(order.created_at).toLocaleDateString('en-BD', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Order Timeline */}
                  {order.status && (
                    <div className="px-4 pb-4">
                      <div className="flex items-center gap-1">
                        {['pending', 'confirmed', 'shipped', 'delivered'].map((step, i) => {
                          const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']
                          const currentIndex = steps.indexOf(order.status)
                          const stepIndex = steps.indexOf(step)
                          const done = stepIndex <= currentIndex
                          return (
                            <div key={step} className="flex items-center flex-1">
                              <div className={`w-2 h-2 rounded-full shrink-0 ${done ? 'bg-emerald-400' : 'bg-zinc-700'}`} />
                              {i < 3 && <div className={`h-px flex-1 ${done ? 'bg-emerald-400/50' : 'bg-zinc-700'}`} />}
                            </div>
                          )
                        })}
                      </div>
                      <div className="flex justify-between mt-1">
                        {['Ordered', 'Confirmed', 'Shipped', 'Delivered'].map(label => (
                          <span key={label} className="text-[9px] text-zinc-600">{label}</span>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}