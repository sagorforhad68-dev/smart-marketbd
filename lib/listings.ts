import { supabase } from '@/lib/supabase'

export const LISTING_PUBLIC_FIELDS =
  'id,user_id,title,description,price,original_price,category,condition,type,phone,image_url,is_sold,created_at,tags,seo_slug,slug,negotiable,stock,seller_verified'

export type ListingInsertInput = {
  title: string
  description: string
  price: number
  original_price?: number | null
  category: string
  condition: string
  type: string
  phone: string
  image_url: string
  stock?: number
  tags?: string[]
}

export function buildListingInsert(userId: string, input: ListingInsertInput) {
  const slug = input.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') + '-' + Date.now()

  const row: Record<string, unknown> = {
    user_id: userId,
    title: input.title,
    description: input.description,
    price: input.price,
    category: input.category,
    condition: input.condition,
    type: input.type,
    phone: input.phone,
    image_url: input.image_url,
    is_sold: false,
    seo_slug: slug,
    slug: slug,
  }

  if (input.original_price != null) row.original_price = input.original_price
  if (input.stock != null) row.stock = input.stock
  if (input.tags?.length) row.tags = input.tags

  return row
}

export async function insertListing(userId: string, input: ListingInsertInput) {
  const row = buildListingInsert(userId, input)
  const result = await supabase.from('listings').insert(row)
  return result
}

export type ListingFilters = {
  type?: string
  condition?: string
  category?: string
  search?: string
}

export async function fetchPublicListings(filters: ListingFilters = {}) {
  let query = supabase
    .from('listings')
    .select(LISTING_PUBLIC_FIELDS)
    .eq('is_sold', false)

  if (filters.type) query = query.eq('type', filters.type)
  if (filters.condition) query = query.eq('condition', filters.condition)
  if (filters.category) query = query.eq('category', filters.category)
  if (filters.search) query = query.ilike('title', '%' + filters.search + '%')

  const { data, error } = await query.order('created_at', { ascending: false })

  return { data: data ?? [], error }
}

export async function fetchListingBySlug(slug: string) {
  const { data, error } = await supabase
    .from('listings')
    .select(LISTING_PUBLIC_FIELDS)
    .or('seo_slug.eq.' + slug + ',slug.eq.' + slug)
    .eq('is_sold', false)
    .limit(1)

  if (error) return { listing: null, error }
  if (data && data.length > 0) return { listing: data[0], error: null }

  const { data: all } = await supabase
    .from('listings')
    .select(LISTING_PUBLIC_FIELDS)
    .eq('is_sold', false)

  const match = all?.find(item => {
    const generated = item.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    return generated === slug || item.seo_slug === slug || item.slug === slug
  })

  return {
    listing: match ?? null,
    error: match ? null : new Error('Listing not found')
  }
}