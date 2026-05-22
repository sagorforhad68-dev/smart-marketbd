import Link from 'next/link'

export default function ListingCard({ listing }: { listing: any }) {
  return (
    <Link href={`/listings/${listing.id}`} className="block">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
        <img src={listing.image_url || '/placeholder.jpg'} alt={listing.title} className="h-48 w-full object-cover" />
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg truncate">{listing.title}</h3>
            <span className="text-green-600 font-bold ml-2">৳{listing.price}</span>
          </div>
          <div className="flex gap-2 mt-2 text-xs">
            <span className="bg-gray-200 px-2 py-1 rounded-full">{listing.category}</span>
            {listing.condition === 'used' && (
              <span className="bg-yellow-200 px-2 py-1 rounded-full">Used</span>
            )}
            {listing.type === 'single' && (
              <span className="bg-red-100 px-2 py-1 rounded-full">Only 1 item</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}