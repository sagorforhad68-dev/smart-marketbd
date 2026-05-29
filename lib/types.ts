// Supabase database types
export interface User {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
    role?: 'buyer' | 'seller' | 'admin'
  }
  created_at: string
}

export interface Listing {
  id: string
  user_id: string
  seller_id: string
  title: string
  description: string
  price: number
  original_price?: number
  category: string
  condition: 'new' | 'used'
  type: 'regular' | 'hot_deal' | 'used'
  phone: string
  image_url: string
  is_sold: boolean
  is_published?: boolean
  review_count?: number
  average_rating?: number
  seller_verified?: boolean
  created_at: string
  updated_at: string
  stock?: number
  tags?: string[]
  seo_slug?: string
  negotiable?: boolean
}

export interface Shop {
  id: string
  seller_id: string
  shop_name: string
  logo_url?: string
  description?: string
  banner_url?: string
  is_verified: boolean
  joined_date: string
  total_sales: number
  average_rating: number
  review_count: number
  created_at: string
  updated_at: string
}

export interface SellerRole {
  id: string
  user_id: string
  is_verified: boolean
  verification_date?: string
  total_sales: number
  total_revenue: number
  joined_date: string
  verification_status: 'pending' | 'verified' | 'rejected'
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  listing_id?: string
  seller_id: string
  reviewer_id: string
  rating: number
  comment: string
  created_at: string
  updated_at: string
}

export interface AdminUser {
  id: string
  user_id: string
  role: 'moderator' | 'admin' | 'super_admin'
  permissions: string[]
  created_at: string
  updated_at: string
}

export interface FeaturedListing {
  id: string
  listing_id: string
  featured_until: string
  created_at: string
}

export interface Message {
  id: string
  listing_id: string
  sender_id: string
  receiver_id: string
  message: string
  read: boolean
  created_at: string
}
