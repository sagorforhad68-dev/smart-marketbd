'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function SellerSettings() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    bio: '',
    avatar_url: '',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'seller') return router.push('/buyer/settings')

      setForm({
        name: profile.name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
      })

      setLoading(false)
    }

    fetchProfile()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({
        name: form.name,
        phone: form.phone,
        bio: form.bio,
        avatar_url: form.avatar_url,
      })
      .eq('id', user.id)

    setSaving(false)
    if (error) {
      setMessage('❌ Save failed. Try again.')
    } else {
      setMessage('✅ Profile updated successfully!')
    }
  }

  if (loading) return (
    <div className="text-center p-10 text-gray-500">Loading...</div>
  )

  return (
    <div className="max-w-xl mx-auto p-6 mt-8">
      <h1 className="text-2xl font-bold mb-6">Seller Settings</h1>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">

        {/* Avatar Preview */}
        <div className="flex items-center gap-4">
          <img
            src={form.avatar_url || '/file.svg'}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/file.svg'
            }}
            alt="Avatar"
            className="w-16 h-16 rounded-full object-cover border"
          />
          <div className="flex-1">
            <label className="text-sm text-gray-500">Avatar URL</label>
            <input
              type="text"
              value={form.avatar_url}
              onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="text-sm text-gray-500">Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 mt-1"
            placeholder="Your name"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm text-gray-500">Phone Number</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 mt-1"
            placeholder="01XXXXXXXXX"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="text-sm text-gray-500">Shop Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 mt-1"
            rows={3}
            placeholder="Tell buyers about your shop..."
          />
        </div>

        {/* Message */}
        {message && (
          <p className="text-sm font-medium">{message}</p>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>

        {/* Dashboard Link */}
        <button
          onClick={() => router.push('/seller/dashboard')}
          className="w-full border py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition"
        >
          ← Back to Dashboard
        </button>

      </div>
    </div>
  )
}