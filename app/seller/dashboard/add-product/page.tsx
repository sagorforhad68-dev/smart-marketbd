'use client'

import { useState, useRef } from 'react'
import { insertListing } from '@/lib/listings'
import { uploadProductImage } from '@/lib/storage'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa'

export default function AddProductPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [category, setCategory] = useState('')
  const [condition, setCondition] = useState('new')
  const [type, setType] = useState('regular')
  const [phone, setPhone] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [stock, setStock] = useState('1')
  const [tags, setTags] = useState('')
  const [seoCaption, setSeoCaption] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const categories = ['Electronics', 'Mobiles', 'Cars', 'Land', 'Clothing', 'Furniture', 'Books', 'Gaming', 'Cameras', 'Sports', 'Other']

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    if (!title.trim() || !price.trim() || !category.trim() || !phone.trim()) {
      setError('Please fill in all required fields: title, price, category, and phone.')
      setLoading(false)
      return
    }

    const parsedPrice = parseFloat(price)
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Please enter a valid price greater than 0.')
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

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

    const { error: dbError } = await insertListing(user.id, {
      title,
      description,
      price: parsedPrice,
      original_price: originalPrice ? parseFloat(originalPrice) : null,
      category,
      condition,
      type,
      phone,
      image_url,
      stock: parseInt(stock, 10) || 1,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      seo_slug: seoSlug,
    })

    if (dbError) {
      setError(dbError.message)
      setLoading(false)
    } else {
      router.push('/seller/dashboard/inventory')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07070a] via-[#0b0b12] to-[#050508] text-white">
      <div className="px-8 py-6 border-b border-zinc-800">
        <Link href="/seller/dashboard" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 mb-4">
          <FaArrowLeft /> Back to Dashboard
        </Link>
        <h1 className="text-4xl font-black">Add New Product</h1>
      </div>

      <div className="px-8 py-12">
        <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-700 rounded-xl p-8">
          {error && <p className="text-red-400 bg-red-900/30 p-3 rounded-xl mb-6">{error}</p>}

          <div className="space-y-4">
            <div>
              <label className="text-zinc-400 text-sm font-semibold block mb-2">Product Title</label>
              <input
                placeholder="Enter product title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-xl outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="text-zinc-400 text-sm font-semibold block mb-2">Description</label>
              <textarea
                placeholder="Detailed product description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-xl outline-none focus:border-green-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-zinc-400 text-sm font-semibold block mb-2">Price (৳)</label>
                <input
                  placeholder="Current price"
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-xl outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="text-zinc-400 text-sm font-semibold block mb-2">Original Price (Optional)</label>
                <input
                  placeholder="Original price"
                  type="number"
                  value={originalPrice}
                  onChange={e => setOriginalPrice(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-xl outline-none focus:border-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-zinc-400 text-sm font-semibold block mb-2">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-xl outline-none focus:border-green-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-zinc-400 text-sm font-semibold block mb-2">Condition</label>
                <select
                  value={condition}
                  onChange={e => setCondition(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-xl outline-none focus:border-green-500"
                >
                  <option value="new">New</option>
                  <option value="used">Used</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-zinc-400 text-sm font-semibold block mb-2">Listing Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-xl outline-none focus:border-green-500"
                >
                  <option value="regular">Regular</option>
                  <option value="hot_deal">Hot Deal</option>
                  <option value="used">Used Goods</option>
                </select>
              </div>
              <div>
                <label className="text-zinc-400 text-sm font-semibold block mb-2">Stock Quantity</label>
                <input
                  placeholder="1"
                  type="number"
                  value={stock}
                  onChange={e => setStock(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-xl outline-none focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label className="text-zinc-400 text-sm font-semibold block mb-2">Phone Number</label>
              <input
                placeholder="Contact number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-xl outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="text-zinc-400 text-sm font-semibold block mb-2">SEO-Friendly Caption</label>
              <input
                placeholder="Short SEO description for listings"
                value={seoCaption}
                onChange={e => setSeoCaption(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-xl outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="text-zinc-400 text-sm font-semibold block mb-2">Tags (comma separated)</label>
              <input
                placeholder="e.g., electronics, smartphone, new"
                value={tags}
                onChange={e => setTags(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-xl outline-none focus:border-green-500"
              />
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

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-400 text-black font-black py-4 rounded-xl text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Publishing Product...' : 'Publish Product'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
