'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function PostPage() {
  const [form, setForm] = useState({
    title: '', description: '', price: '', category: 'Electronics',
    condition: 'new', type: 'regular', phone: '', image_url: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('Please login first')
      setLoading(false)
      return
    }
    const { error } = await supabase.from('listings').insert({
      ...form,
      price: parseFloat(form.price),
      user_id: user.id,
      is_sold: false,
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
      <input name="image_url" placeholder="Image URL" className="w-full border p-2 mb-6 rounded" onChange={handleChange} />
      <button onClick={handleSubmit} disabled={loading} className="w-full bg-green-500 text-white p-3 rounded font-bold hover:bg-green-400">
        {loading ? 'Posting...' : 'Post Item'}
      </button>
    </div>
  )
}