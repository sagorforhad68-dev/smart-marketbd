'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { insertListing } from '@/lib/listings'
import { uploadProductImage } from '@/lib/storage'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PostListing() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [condition, setCondition] = useState('new')
  const [type, setType] = useState('regular')
  const [phone, setPhone] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const categories = ['Electronics', 'Cattle', 'Land', 'Cars', 'Clothing', 'Old Items']

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    let image_url = ''
    if (image) {
      try {
        image_url = await uploadProductImage(user.id, image)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Image upload failed.')
        setLoading(false)
        return
      }
    }

    const seoSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

    const { error } = await insertListing(user.id, {
      title,
      description,
      price: parseFloat(price),
      category,
      condition,
      type,
      phone,
      image_url,
      seo_slug: seoSlug,
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-green-400 hover:text-green-300 mb-6 inline-block">← Back</Link>
        <h1 className="text-4xl font-black mb-8">Post a Product</h1>

        {error && <p className="text-red-400 bg-red-900/30 p-3 rounded-xl mb-6">{error}</p>}

        <div className="space-y-4">
          <input placeholder="Product Title" value={title} onChange={e => setTitle(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 text-white p-3 rounded-xl outline-none focus:border-green-500" />

          <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} rows={4}
            className="w-full bg-zinc-900 border border-zinc-700 text-white p-3 rounded-xl outline-none focus:border-green-500" />

          <input placeholder="Price (৳)" type="number" value={price} onChange={e => setPrice(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 text-white p-3 rounded-xl outline-none focus:border-green-500" />

          <input placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 text-white p-3 rounded-xl outline-none focus:border-green-500" />

          <select value={category} onChange={e => setCategory(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 text-white p-3 rounded-xl outline-none focus:border-green-500">
            <option value="">Select Category</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <div className="flex gap-4">
            <select value={condition} onChange={e => setCondition(e.target.value)}
              className="flex-1 bg-zinc-900 border border-zinc-700 text-white p-3 rounded-xl outline-none focus:border-green-500">
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>
            <select value={type} onChange={e => setType(e.target.value)}
              className="flex-1 bg-zinc-900 border border-zinc-700 text-white p-3 rounded-xl outline-none focus:border-green-500">
              <option value="regular">Regular</option>
              <option value="single">Single Item</option>
            </select>
          </div>

          <div className="border-2 border-dashed border-zinc-700 rounded-xl p-6 text-center hover:border-green-500 transition-all">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={e => setImage(e.target.files?.[0] || null)}
              className="sr-only"
              id="image-upload"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full cursor-pointer"
            >
              {image ? (
                <div className="flex flex-col items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={URL.createObjectURL(image)} alt="Preview" className="w-48 h-48 object-cover rounded-md" />
                  <p className="text-green-400 font-bold">{image.name}</p>
                </div>
              ) : (
                <>
                  <p className="text-zinc-400 mb-2">Tap to upload product photo</p>
                  <p className="text-zinc-600 text-sm">JPG, PNG, WEBP — max 5MB</p>
                </>
              )}
            </button>
          </div>

          <button onClick={handleSubmit} disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-black py-4 rounded-xl text-lg transition-all">
            {loading ? 'Posting...' : 'Post Product'}
          </button>
        </div>
      </div>
    </div>
  )
}