'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })
      
      if (loginError) {
        setError(loginError.message)
      } else if (data?.user) {
        // Get user metadata to check role
        const userMetadata = data.user.user_metadata
        const isAdmin = userMetadata?.isAdmin || false
        
        // Redirect based on role
        if (isAdmin) {
          router.push('/dashboard')
        } else {
          router.push('/')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
    setLoading(false)
  }

  const handleSignUp = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    if (!fullName.trim()) {
      setError('Full name is required')
      setLoading(false)
      return
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName,
            isAdmin: false // All new signups are regular customers by default
          }
        }
      })
      
      if (signUpError) {
        setError(signUpError.message)
      } else if (data?.user) {
        setSuccess('Account created successfully! Please log in with your credentials.')
        // Reset form
        setFullName('')
        setEmail('')
        setPassword('')
        setIsSignUp(false)
        
        // Auto login after signup
        setTimeout(async () => {
          const { error: autoLoginError } = await supabase.auth.signInWithPassword({ 
            email, 
            password 
          })
          if (!autoLoginError) {
            router.push('/')
          }
        }, 1500)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed')
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-zinc-900 px-4">
      <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-green-400 mb-2">Smart MarketBD</h1>
          <p className="text-zinc-400">{isSignUp ? 'Create Your Account' : 'Welcome Back'}</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-300 p-3 rounded-lg mb-4 text-sm">
            {success}
          </div>
        )}

        <div className="space-y-4">
          {isSignUp && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-zinc-900 border border-zinc-700 text-white p-3 rounded-lg outline-none focus:border-green-400 transition-colors"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
            />
          )}
          
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-zinc-900 border border-zinc-700 text-white p-3 rounded-lg outline-none focus:border-green-400 transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-zinc-900 border border-zinc-700 text-white p-3 rounded-lg outline-none focus:border-green-400 transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          
          <button
            onClick={isSignUp ? handleSignUp : handleLogin}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 text-black p-3 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Login'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
              setSuccess('')
              setEmail('')
              setPassword('')
              setFullName('')
            }}
            className="text-zinc-400 hover:text-green-400 transition-colors text-sm"
          >
            {isSignUp 
              ? 'Already have an account? Login' 
              : 'Don\'t have an account? Sign up'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link 
            href="/"
            className="text-zinc-400 hover:text-green-400 transition-colors text-sm inline-flex items-center gap-2"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}