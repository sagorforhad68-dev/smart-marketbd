import { supabase } from '@/lib/supabase'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
const MAX_BYTES = 5 * 1024 * 1024

function getBucketPublicUrl(bucket: string, filePath: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return data?.publicUrl || null
}

function getContentType(file: File, ext: string) {
  if (file.type) return file.type
  return `image/${ext === 'jpg' ? 'jpeg' : ext}`
}

function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Unsupported image type. Use JPG, PNG or WEBP.'
  }
  if (file.size > MAX_BYTES) {
    return 'Image is too large. Max size is 5MB.'
  }
  return null
}

async function uploadImageToBucket(bucket: string, filePath: string, file: File): Promise<string> {
  const validationError = validateImageFile(file)
  if (validationError) throw new Error(validationError)

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: getContentType(file, filePath.split('.').pop() || 'jpg'),
    })

  if (uploadError) {
    throw new Error(uploadError.message)
  }

  const publicUrl = getBucketPublicUrl(bucket, filePath)
  if (!publicUrl) {
    throw new Error('Could not get public URL for uploaded image.')
  }
  return publicUrl
}

export async function uploadProductImage(userId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filePath = `${userId}/${Date.now()}.${ext}`
  return uploadImageToBucket('product-images', filePath, file)
}

export async function uploadShopLogo(userId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filePath = `${userId}-${Date.now()}.${ext}`
  return uploadImageToBucket('shop-logos', filePath, file)
}

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filePath = `${userId}-${Date.now()}.${ext}`
  return uploadImageToBucket('avatars', filePath, file)
}
