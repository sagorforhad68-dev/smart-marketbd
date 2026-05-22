'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push('/dashboard')
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-96 border border-gray-700">
        
        {/* Toggle Buttons */}
        <div className="flex mb-8 bg-gray-900 rounded-xl p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              isLogin ? 'bg-green-500 text-black' : 'text-gray-400'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              !isLogin ? 'bg-green-500 text-black' : 'text-gray-400'
            }`}
          >
            Sign Up
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-6 text-center text-white">
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </h1>

        {error && (
          <p className="text-red-400 mb-4 text-sm bg-red-900/30 p-3 rounded-lg">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full bg-gray-900 border border-gray-600 text-white p-3 mb-4 rounded-xl outline-none focus:border-green-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full bg-gray-900 border border-gray-600 text-white p-3 mb-6 rounded-xl outline-none focus:border-green-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 hover:bg-green-400 text-black font-bold p-3 rounded-xl transition-all"
        >
          {loading ? 'Loading...' : isLogin ? 'Login' : 'Create Account'}
        </button>

        <p className="text-center mt-4 text-gray-400 text-sm">
          <Link href="/" className="text-green-400 hover:text-green-300">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  )
}