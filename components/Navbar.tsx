'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import {
FaBars, FaTimes, FaFire, FaRecycle, FaPlus,
FaUser, FaStore, FaCog, FaSignOutAlt, FaShoppingBag,
FaEnvelope,
} from 'react-icons/fa'

const navLinks = [
{ href: '/', label: 'Home' },
{ href: '/#marketplace', label: 'Marketplace' },
{ href: '/hot-deals', label: 'Hot Deals', icon: FaFire, accent: 'text-orange-400' },
{ href: '/used-goods', label: 'Used Goods', icon: FaRecycle, accent: 'text-emerald-400' },
]

export default function Navbar() {
const [user, setUser] = useState<User | null>(null)
const [role, setRole] = useState<string | null>(null)
const [userMenuOpen, setUserMenuOpen] = useState(false)
const [mobileOpen, setMobileOpen] = useState(false)
const [unreadCount, setUnreadCount] = useState(0)
const router = useRouter()
const pathname = usePathname()

useEffect(() => {
const loadUser = async () => {
const { data: { user: u } } = await supabase.auth.getUser()
setUser(u)
if (u) {
await fetchRole(u.id)
await fetchUnread(u.id)
}
}
loadUser()

const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
setUser(session?.user ?? null)
if (session?.user) {
await fetchRole(session.user.id)
await fetchUnread(session.user.id)
} else {
setRole(null)
setUnreadCount(0)
}
})
return () => listener.subscription.unsubscribe()
}, [])

const fetchRole = async (userId: string) => {
const { data } = await supabase
.from('profiles')
.select('role')
.eq('id', userId)
.maybeSingle()
setRole(data?.role || 'buyer')
}

const fetchUnread = async (userId: string) => {
const { count } = await supabase
.from('messages')
.select('*', { count: 'exact', head: true })
.eq('receiver_id', userId)
.eq('seen', false)
setUnreadCount(count || 0)
}

// Realtime unread count
useEffect(() => {
if (!user) return

const channel = supabase
.channel('navbar-unread')
.on('postgres_changes', {
event: 'INSERT',
schema: 'public',
table: 'messages',
filter: `receiver_id=eq.${user.id}`,
}, () => {
fetchUnread(user.id)
})
.on('postgres_changes', {
event: 'UPDATE',
schema: 'public',
table: 'messages',
filter: `receiver_id=eq.${user.id}`,
}, () => {
fetchUnread(user.id)
})
.subscribe()

return () => { supabase.removeChannel(channel) }
}, [user])

useEffect(() => {
setMobileOpen(false)
setUserMenuOpen(false)
}, [pathname])

const handleLogout = async () => {
await supabase.auth.signOut()
setUser(null)
setRole(null)
setUnreadCount(0)
setUserMenuOpen(false)
router.push('/login')
}

const messagesHref = role === 'seller' ? '/seller/messages' : '/buyer/messages'
const displayName = user?.email?.split('@')[0] ?? 'Account'

return (
<header className="sticky top-0 z-50 px-3 pt-3 md:px-6">
<nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl">

{/* Logo */}
<Link href="/" className="group flex shrink-0 items-center gap-3">
<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 text-sm font-black text-zinc-950 shadow-lg shadow-emerald-500/20 transition group-hover:scale-105">
SM
</div>
<div className="hidden sm:block">
<p className="text-base font-bold tracking-tight text-white">Smart MarketBD</p>
<p className="text-[11px] text-zinc-400">Buy & sell across Bangladesh</p>
</div>
</Link>

{/* Desktop Nav */}
<div className="hidden items-center gap-1 lg:flex">
{navLinks.map((link) => (
<Link
key={link.href}
href={link.href}
className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
>
<span className="inline-flex items-center gap-1.5">
{link.icon && <link.icon className={`text-xs ${link.accent ?? ''}`} />}
{link.label}
</span>
</Link>
))}
</div>

{/* Right Side */}
<div className="flex items-center gap-2">

{/* Messages Bell — logged in user */}
{user && (
<Link href={messagesHref} className="relative">
<motion.span
whileHover={{ scale: 1.1 }}
whileTap={{ scale: 0.95 }}
className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white transition"
>
<FaEnvelope className="text-sm" />
{unreadCount > 0 && (
<span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
{unreadCount > 9 ? '9+' : unreadCount}
</span>
)}
</motion.span>
</Link>
)}

{/* Sell button — only for sellers */}
{user && role === 'seller' && (
<Link href="/seller/dashboard/add-product" className="hidden sm:block">
<motion.span
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}
className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-2 text-sm font-bold text-zinc-950 shadow-lg shadow-emerald-500/25"
>
<FaPlus className="text-xs" /> Sell
</motion.span>
</Link>
)}

{user ? (
<div className="relative">
<button
type="button"
onClick={() => setUserMenuOpen((o) => !o)}
className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:border-emerald-500/40 hover:bg-white/10"
>
<span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
<FaUser className="text-xs" />
</span>
<span className="hidden max-w-[88px] truncate md:inline">{displayName}</span>
</button>

<AnimatePresence>
{userMenuOpen && (
<motion.div
initial={{ opacity: 0, y: 8, scale: 0.96 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
exit={{ opacity: 0, y: 8, scale: 0.96 }}
className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/95 py-1 shadow-2xl backdrop-blur-xl"
>
<p className="border-b border-white/10 px-4 py-3 text-xs text-zinc-400">
Signed in as
<span className="block truncate font-semibold text-emerald-400">{user.email}</span>
</p>

{role === 'seller' && (
<Link href="/seller/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-200 hover:bg-white/5">
<FaStore className="text-emerald-400" /> Seller Dashboard
</Link>
)}

{role === 'buyer' && (
<Link href="/buyer/home" className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-200 hover:bg-white/5">
<FaShoppingBag className="text-blue-400" /> My Dashboard
</Link>
)}

{/* Messages link dropdown এ */}
<Link
href={messagesHref}
className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-200 hover:bg-white/5"
>
<FaEnvelope className="text-yellow-400" />
Messages
{unreadCount > 0 && (
<span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
{unreadCount > 9 ? '9+' : unreadCount}
</span>
)}
</Link>

<Link href="/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-200 hover:bg-white/5">
<FaCog /> Settings
</Link>

<button
type="button"
onClick={handleLogout}
className="flex w-full items-center gap-2 border-t border-white/10 px-4 py-2.5 text-sm text-red-400 hover:bg-white/5"
>
<FaSignOutAlt /> Logout
</button>
</motion.div>
)}
</AnimatePresence>
</div>
) : (
<Link
href="/login"
className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-400 transition hover:bg-emerald-500/20"
>
Login
</Link>
)}

<button
type="button"
aria-label="Toggle menu"
onClick={() => setMobileOpen((o) => !o)}
className="rounded-xl border border-white/10 p-2.5 text-zinc-300 lg:hidden"
>
{mobileOpen ? <FaTimes /> : <FaBars />}
</button>
</div>
</nav>

{/* Mobile Menu */}
<AnimatePresence>
{mobileOpen && (
<motion.div
initial={{ opacity: 0, height: 0 }}
animate={{ opacity: 1, height: 'auto' }}
exit={{ opacity: 0, height: 0 }}
className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 backdrop-blur-xl lg:hidden"
>
<div className="flex flex-col gap-1 p-3">
{navLinks.map((link) => (
<Link
key={link.href}
href={link.href}
className="rounded-xl px-4 py-3 text-sm font-medium text-zinc-200 hover:bg-white/5"
>
{link.label}
</Link>
))}

{/* Mobile Messages */}
{user && (
<Link
href={messagesHref}
className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-zinc-200 hover:bg-white/5"
>
<span className="flex items-center gap-2">
<FaEnvelope className="text-yellow-400" /> Messages
</span>
{unreadCount > 0 && (
<span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
{unreadCount > 9 ? '9+' : unreadCount}
</span>
)}
</Link>
)}

{user && role === 'seller' && (
<Link
href="/seller/dashboard/add-product"
className="mt-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-3 text-center text-sm font-bold text-zinc-950"
>
+ Add Product
</Link>
)}

{user && role === 'buyer' && (
<Link
href="/buyer/home"
className="mt-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-400 px-4 py-3 text-center text-sm font-bold text-white"
>
My Dashboard
</Link>
)}

{!user && (
<Link
href="/login"
className="mt-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-3 text-center text-sm font-bold text-zinc-950"
>
Login / Sign Up
</Link>
)}
</div>
</motion.div>
)}
</AnimatePresence>
</header>
)
}
