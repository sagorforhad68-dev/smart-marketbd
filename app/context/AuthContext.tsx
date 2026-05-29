'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

// FIXED: role type add করা হয়েছে
type UserRole = 'buyer' | 'seller' | 'admin' | null

interface AuthContextType {
  user: User | null
  role: UserRole
  isAdmin: boolean
  isSeller: boolean
  isBuyer: boolean
  isLoading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// FIXED: database থেকে role fetch করার function
const fetchUserRole = async (userId: string): Promise<UserRole> => {
  try {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle()

    return (data?.role as UserRole) || 'buyer'
  } catch {
    return 'buyer'
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<UserRole>(null)
  const [isLoading, setIsLoading] = useState(true)

  // FIXED: subscription cleanup সঠিকভাবে করা হয়েছে
  useEffect(() => {
    let isMounted = true

    const initializeAuth = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser()

        if (currentUser && isMounted) {
          const userRole = await fetchUserRole(currentUser.id)
          setUser(currentUser)
          setRole(userRole)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    initializeAuth()

    // FIXED: subscription কে useEffect এর top level এ রাখা হয়েছে
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return

        if (session?.user) {
          const userRole = await fetchUserRole(session.user.id)
          setUser(session.user)
          setRole(userRole)
        } else {
          setUser(null)
          setRole(null)
        }

        if (isMounted) setIsLoading(false)
      }
    )

    // FIXED: cleanup সঠিকভাবে কাজ করবে এখন
    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setRole(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // FIXED: isAdmin database role থেকে নেওয়া হচ্ছে, metadata থেকে না
  const value: AuthContextType = {
    user,
    role,
    isAdmin: role === 'admin',
    isSeller: role === 'seller',
    isBuyer: role === 'buyer',
    isLoading,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}