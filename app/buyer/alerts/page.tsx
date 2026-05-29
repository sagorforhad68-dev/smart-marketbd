'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { FaArrowLeft, FaBell, FaShoppingBag, FaComments, FaTag, FaInfoCircle, FaCheckCircle } from 'react-icons/fa'

const TYPE_CONFIG: Record<string, { icon: any; color: string }> = {
  order:     { icon: FaShoppingBag, color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  message:   { icon: FaComments,    color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  listing:   { icon: FaTag,         color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  promotion: { icon: FaTag,         color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  alert:     { icon: FaInfoCircle,  color: 'text-red-400 bg-red-400/10 border-red-400/20' },
}

export default function AlertsPage() {
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) { router.push('/login'); return }
      setUser(u)
      await fetchNotifications(u.id)
      setLoading(false)
    }
    load()
  }, [])

  const fetchNotifications = async (userId: string) => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    setNotifications(data || [])
  }

  const markAllSeen = async () => {
    if (!user) return
    await supabase
      .from('notifications')
      .update({ seen: true })
      .eq('user_id', user.id)
      .eq('seen', false)

    setNotifications(prev => prev.map(n => ({ ...n, seen: true })))
  }

  const markOneSeen = async (id: string) => {
    await supabase
      .from('notifications')
      .update({ seen: true })
      .eq('id', id)

    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, seen: true } : n)
    )
  }

  const unreadCount = notifications.filter(n => !n.seen).length

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-blue-400 animate-pulse">Loading notifications...</div>
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
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
          {unreadCount > 0 && (
            <button
              onClick={markAllSeen}
              className="ml-auto text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition"
            >
              <FaCheckCircle className="text-emerald-400" /> Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6">
        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <FaBell className="text-6xl text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg mb-2">No notifications yet</p>
            <p className="text-zinc-600 text-sm mb-6">We'll notify you about orders, messages, and deals</p>
            <Link
              href="/buyer/home"
              className="inline-block rounded-xl bg-gradient-to-r from-blue-500 to-blue-400 px-6 py-2.5 text-sm font-bold text-white"
            >
              Back to Home →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n: any) => {
              const config = TYPE_CONFIG[n.type] || TYPE_CONFIG['alert']
              const Icon = config.icon
              return (
                <div
                  key={n.id}
                  onClick={() => !n.seen && markOneSeen(n.id)}
                  className={`flex items-start gap-3 rounded-2xl border p-4 transition cursor-pointer
                    ${n.seen
                      ? 'border-white/5 bg-zinc-900/50'
                      : 'border-white/10 bg-zinc-900 hover:bg-zinc-800'
                    }`}
                >
                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${config.color}`}>
                    <Icon className="text-sm" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-semibold ${n.seen ? 'text-zinc-400' : 'text-white'}`}>
                        {n.title}
                      </p>
                      {!n.seen && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                      )}
                    </div>
                    {n.message && (
                      <p className="text-zinc-500 text-xs mt-0.5 line-clamp-2">{n.message}</p>
                    )}
                    <p className="text-zinc-600 text-[11px] mt-1">
                      {new Date(n.created_at).toLocaleDateString('en-BD', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}