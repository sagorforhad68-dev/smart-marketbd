'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function PostPage() {
  const [form, setForm] = useState({
    title: '', description: '', price: '', category: 'Electronics',
    condition: 'new', type: 'regular', phone: '',
  })
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('Please login first')
      setLoading(false)
      return
    }

    let imageUrl = ''

    if (image) {
      const fileExt = image.name.split('.').pop() || 'jpg'
      const fileName = user.id + '/' + Date.now() + '.' + fileExt

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, image, {
          cacheControl: '3600',
          upsert: false,
          contentType: image.type,
        })

      if (uploadError) {
        setError('Image upload failed: ' + uploadError.message)
        setLoading(false)
        return
      }

      const { data: publicData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)

      imageUrl = publicData?.publicUrl || ''
    }

    const slug = form.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + Date.now()

    const { error } = await supabase.from('listings').insert({
      title: form.title,
      description: form.description,
      price: parseFloat(form.price),
      category: form.category,
      condition: form.condition,
      type: form.type,
      phone: form.phone,
      user_id: user.id,
      is_sold: false,
      image_url: imageUrl,
      slug: slug,
      seo_slug: slug,
    })

    if (error) setError(error.message)
    else router.push('/')
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow mt-8">
      <h1 className="text-2xl font-bold mb-6">Sell an item</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <input name="title" placeholder="Title" className="w-full border p-2 mb-3 rounded" onChange={handleChange} required />
      <textarea name="description" placeholder="Description" className="w-full border p-2 mb-3 rounded" onChange={handleChange} />
      <input name="price" type="number" placeholder="Price" className="w-full border p-2 mb-3 rounded" onChange={handleChange} required />
      <select name="category" className="w-full border p-2 mb-3 rounded" onChange={handleChange}>
        <option value="Electronics">Electronics</option>
        <option value="Cattle">Cattle</option>
        <option value="Land">Land</option>
        <option value="Cars">Cars</option>
        <option value="Clothing">Clothing</option>
        <option value="Books">Books</option>
        <option value="Old Items">Old Items</option>
      </select>
      <div className="flex gap-4 mb-3">
        <select name="condition" className="w-1/2 border p-2 rounded" onChange={handleChange}>
          <option value="new">New</option>
          <option value="used">Used</option>
        </select>
        <select name="type" className="w-1/2 border p-2 rounded" onChange={handleChange}>
          <option value="regular">Regular</option>
          <option value="single">Single item</option>
        </select>
      </div>
      <input name="phone" placeholder="Phone number" className="w-full border p-2 mb-3 rounded" onChange={handleChange} required />

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2 text-gray-600">Product Image</label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-green-500 transition-all">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="product-image"
          />
          <label htmlFor="product-image" className="cursor-pointer">
            {imagePreview ? (
              <img src={imagePreview} alt="preview" className="w-40 h-40 object-cover rounded-lg mx-auto" />
            ) : (
              <>
                <p className="text-gray-400 mb-1">Click to upload image</p>
                <p className="text-gray-300 text-sm">JPG, PNG, WEBP</p>
              </>
            )}
          </label>
        </div>
      </div>

      <button onClick={handleSubmit} disabled={loading} className="w-full bg-green-500 text-white p-3 rounded font-bold hover:bg-green-400">
        {loading ? 'Posting...' : 'Post Item'}
      </button>
    </div>
  )
}