"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Listing } from '@/lib/types'

function slugFromListing(listing: Listing) {
  if (listing.seo_slug) return listing.seo_slug
  return listing.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const [imageSrc, setImageSrc] = useState(listing.image_url || '/file.svg')
  const seoSlug = slugFromListing(listing)
  const hasDiscount =
    listing.original_price != null && listing.original_price > listing.price

  return (
    <Link href={`/product/${seoSlug}`} className="group block h-full">
      <motion.article
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 shadow-lg transition-shadow hover:border-emerald-500/30 hover:shadow-emerald-500/10"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-800">
          <Image
            src={imageSrc}
            alt={listing.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 25vw"
            onError={() => setImageSrc('/file.svg')}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
          <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {listing.category}
          </span>
          {listing.type === 'hot_deal' && (
            <span className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
              Hot deal
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-2 font-bold leading-snug text-white group-hover:text-emerald-300">
            {listing.title}
          </h3>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-xl font-black text-emerald-400">৳{Number(listing.price).toLocaleString()}</p>
              {hasDiscount && (
                <p className="text-xs text-zinc-500 line-through">
                  ৳{Number(listing.original_price).toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex flex-wrap justify-end gap-1.5">
              {listing.condition === 'used' && (
                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-300">
                  Used
                </span>
              )}
              {listing.seller_verified && (
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  )
}
