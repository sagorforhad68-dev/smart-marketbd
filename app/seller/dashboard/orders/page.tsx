'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FaArrowLeft, FaBox } from 'react-icons/fa'

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07070a] via-[#0b0b12] to-[#050508] text-white">
      <div className="px-8 py-6 border-b border-zinc-800">
        <Link href="/seller/dashboard" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 mb-4">
          <FaArrowLeft /> Back to Dashboard
        </Link>
        <h1 className="text-4xl font-black">Orders</h1>
      </div>

      <div className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {orders.length === 0 ? (
            <div className="text-center py-16 border border-zinc-800 rounded-2xl">
              <FaBox className="text-6xl text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-400 text-xl mb-2">No orders yet</p>
              <p className="text-zinc-600">Orders will appear here when customers purchase your products</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Orders list will go here */}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
