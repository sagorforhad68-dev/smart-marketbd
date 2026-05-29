'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaEnvelope, FaLock, FaUser, FaStore } from 'react-icons/fa'

export default function SignupPage() {
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [name, setName] = useState('')
const [role, setRole] = useState('buyer')
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')
const [success, setSuccess] = useState(false)
const router = useRouter()

const handleSignup = async (e: React.FormEvent) => {
e.preventDefault()
setLoading(true)
setError('')

if (password.length < 6) {
setError('Password must be at least 6 characters.')
setLoading(false)
return
}

const { data, error: signupError } = await supabase.auth.signUp({
email,
password,
options: { data: { role, name } }
})

if (signupError) {
setError(signupError.message)
setLoading(false)
return
}

const user = data.user
if (user) {
await supabase.from('profiles').upsert({
id: user.id,
email: user.email,
name: name,
role: role,
})
}

setSuccess(true)
setLoading(false)
}

if (success) {
return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-4">
<div className="w-full max-w-md text-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
<div className="text-5xl mb-4">📧</div>
<h2 className="text-2xl font-bold text-white mb-3">Check your email!</h2>
<p className="text-zinc-400 text-sm mb-6">
We sent a verification link to <span className="text-emerald-400 font-semibold">{email}</span>.
Please verify your email before logging in.
</p>
<Link href="/login">
<button className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-zinc-950 font-bold py-3 rounded-xl transition hover:opacity-90">
Go to Login
</button>
</Link>
<Link href="/" className="text-zinc-500 hover:text-white text-xs mt-4 block">
← Back to Home
</Link>
</div>
</div>
)
}

return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-4">
<div className="w-full max-w-md">
<div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
<div className="text-center mb-8">
<h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
<p className="text-zinc-400 text-sm">Join Smart MarketBD today</p>
</div>

{error && (
<div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
{error}
</div>
)}

<form onSubmit={handleSignup} className="space-y-4">

{/* Role Selector */}
<div className="flex bg-white/5 border border-white/10 rounded-xl p-1 mb-2">
<button type="button" onClick={() => setRole('buyer')}
className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${role === 'buyer' ? 'bg-blue-500 text-white' : 'text-zinc-400'}`}>
<FaUser className="text-xs" /> Buyer
</button>
<button type="button" onClick={() => setRole('seller')}
className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${role === 'seller' ? 'bg-emerald-500 text-white' : 'text-zinc-400'}`}>
<FaStore className="text-xs" /> Seller
</button>
</div>

{/* Name */}
<div>
<label className="block text-sm font-medium text-white mb-2">Full Name</label>
<div className="relative">
<FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
<input
type="text"
placeholder="Your name"
value={name}
onChange={(e) => setName(e.target.value)}
required
className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
/>
</div>
</div>

{/* Email */}
<div>
<label className="block text-sm font-medium text-white mb-2">Email Address</label>
<div className="relative">
<FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
<input
type="email"
placeholder="you@example.com"
value={email}
onChange={(e) => setEmail(e.target.value)}
required
className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
/>
</div>
</div>

{/* Password */}
<div>
<label className="block text-sm font-medium text-white mb-2">Password</label>
<div className="relative">
<FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
<input
type="password"
placeholder="Min 6 characters"
value={password}
onChange={(e) => setPassword(e.target.value)}
required
minLength={6}
className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
/>
</div>
</div>

<button
type="submit"
disabled={loading}
className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 disabled:opacity-50 text-zinc-950 font-bold py-3 rounded-xl transition mt-4"
>
{loading ? 'Creating account...' : 'Create Account'}
</button>
</form>

<div className="mt-6 text-center text-sm">
<p className="text-zinc-400">
Already have an account?{' '}
<Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold">Login</Link>
</p>
<Link href="/" className="text-zinc-500 hover:text-white text-xs mt-3 block">
← Back to Home
</Link>
</div>
</div>
</div>
</div>
)
}