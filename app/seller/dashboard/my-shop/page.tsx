'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { FaArrowLeft, FaCheckCircle, FaStore, FaCamera } from 'react-icons/fa'

export default function MyShopPage() {
  const [user, setUser] = useState<any>(null)
  const [shop, setShop] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [shopName, setShopName] = useState('')
  const [description, setDescription] = useState('')
  const [logo, setLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchShop()
  }, [])

  const fetchShop = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUser(user)
    const { data: shopData } = await supabase
      .from('shops')
      .select('*')
      .eq('seller_id', user.id)
      .single()
    if (shopData) {
      setShop(shopData)
      setShopName(shopData.shop_name || '')
      setDescription(shopData.description || '')
      setLogoUrl(shopData.logo_url || '')
    }
    setLoading(false)
  }

  const handleLogoChange = (e: any) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogo(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleSave = async () => {
    if (!shopName.trim()) {
      setMessage('Shop name is required')
      return
    }
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let logoUploadUrl = logoUrl

    if (logo) {
      const fileExt = logo.name.split('.').pop() || 'jpg'
      const fileName = user.id + '-' + Date.now() + '.' + fileExt
      const { error: uploadError } = await supabase.storage
        .from('shop-logos')
        .upload(fileName, logo, {
          cacheControl: '3600',
          upsert: true,
          contentType: logo.type,
        })
      if (uploadError) {
        setMessage('Error uploading logo: ' + uploadError.message)
        setSaving(false)
        return
      }
      const { data: publicData } = supabase.storage
        .from('shop-logos')
        .getPublicUrl(fileName)
      logoUploadUrl = publicData?.publicUrl || logoUploadUrl
    }

    const { error } = await supabase
      .from('shops')
      .update({
        shop_name: shopName,
        description: description,
        logo_url: logoUploadUrl,
      })
      .eq('seller_id', user.id)

    if (error) {
      setMessage('Error saving shop: ' + error.message)
    } else {
      setMessage('Shop updated successfully!')
      setLogoUrl(logoUploadUrl)
      setLogo(null)
      setLogoPreview('')
      await fetchShop()
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading shop...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07070a] via-[#0b0b12] to-[#050508] text-white">
      <div className="px-8 py-6 border-b border-zinc-800">
        <Link href="/seller/dashboard" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 mb-4">
          <FaArrowLeft /> Back to Dashboard
        </Link>
        <h1 className="text-4xl font-black">My Shop</h1>
      </div>

      <div className="px-8 py-12">
        <div className="max-w-2xl mx-auto">
          {message && (
            <div className={`p-4 rounded-xl mb-6 ${message.includes('successfully') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {message}
            </div>
          )}

          {/* Shop Logo Preview */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative">
              {logoPreview || logoUrl ? (
                <img
                  src={logoPreview || logoUrl}
                  alt="Shop Logo"
                  className="w-32 h-32 rounded-full object-cover border-4 border-green-500"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-zinc-800 border-4 border-zinc-600 flex items-center justify-center">
                  <FaStore className="text-4xl text-zinc-500" />
                </div>
              )}
              <label htmlFor="logo-upload" className="absolute bottom-0 right-0 bg-green-500 hover:bg-green-400 text-black p-2 rounded-full cursor-pointer">
                <FaCamera className="text-lg" />
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
                id="logo-upload"
              />
            </div>
            <p className="text-zinc-400 text-sm mt-3">Click camera icon to change logo</p>
            {logoPreview && (
              <p className="text-green-400 text-sm mt-1">New logo selected — save to apply</p>
            )}
          </div>

          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-8">
            <div className="space-y-6">
              {shop?.is_verified && (
                <div className="flex items-center gap-2 bg-green-500/20 border border-green-500 text-green-400 p-4 rounded-xl">
                  <FaCheckCircle /> Your shop is verified!
                </div>
              )}

              <div>
                <label className="text-zinc-400 text-sm font-semibold block mb-2">Shop Name</label>
                <input
                  placeholder="Enter your shop name"
                  value={shopName}
                  onChange={e => setShopName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-xl outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="text-zinc-400 text-sm font-semibold block mb-2">Shop Description</label>
                <textarea
                  placeholder="Tell customers about your shop"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-xl outline-none focus:border-green-500"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-green-500 hover:bg-green-400 text-black font-black py-4 rounded-xl text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Shop'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}