"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function ListingCard({ listing }: { listing: any }) {
  const [imageSrc, setImageSrc] = useState(listing.image_url || '/file.svg')
  return (
    <Link href={`/listings/${listing.id}`} className="block">
      <motion.div whileHover={{ y: -6, scale: 1.01 }} className="glass rounded-2xl overflow-hidden transition-shadow hover:shadow-2xl">
        <div className="relative h-56 w-full bg-zinc-900">
          <Image
            src={imageSrc}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            onError={() => setImageSrc('/file.svg')}
          />
          <div className="absolute left-3 top-3 bg-black/40 text-white px-2 py-1 rounded-md text-sm">{listing.category}</div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg truncate">{listing.title}</h3>
            <span className="text-teal-300 font-extrabold ml-2">৳{listing.price}</span>
          </div>
          <div className="flex gap-2 mt-2 text-xs">
            {listing.condition === 'used' && (
              <span className="bg-yellow-200/20 text-yellow-300 px-2 py-1 rounded-full">Used</span>
            )}
            {listing.type === 'single' && (
              <span className="bg-red-200/10 text-red-300 px-2 py-1 rounded-full">Only 1</span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}