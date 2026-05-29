'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function SettingsRedirect() {
  const router = useRouter()

  useEffect(() => {
    const redirect = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'seller') {
        router.push('/seller/settings')
      } else {
        router.push('/buyer/settings')
      }
    }

    redirect()
  }, [])

  return (
    <div className="text-center p-10 text-gray-500">Loading...</div>
  )
}