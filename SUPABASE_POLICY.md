# Supabase Storage Bucket Policy Recommendations

This project uses a storage bucket named `listings` (client code references `supabase.storage.from('listings')`). Below are recommended settings and RLS policies to allow authenticated users to upload images and keep public read access for images.

## 1) Create bucket
- Name: `listings`
- Public: Yes (for public read access via generated `publicUrl`)

## 2) Public access
If you want files to be directly accessible via `https://<project>.supabase.co/storage/v1/object/public/listings/<file>` set the bucket to public. This is simplest for marketplace images.

## 3) Restrict uploads to authenticated users (recommended)
If bucket is public, you should use RLS or storage policies to restrict who can upload. In Supabase SQL editor, run:

-- Allow insert for authenticated users into storage objects (example)
-- Note: adjust `auth.uid()` usage per your Supabase project

-- Grant insert to authenticated users
create policy "Allow authenticated uploads" on storage.objects
  for insert using ( auth.role() = 'authenticated' );

-- Optionally restrict bucket
create policy "Allow upload to listings bucket" on storage.objects
  for insert using (
    bucket_id = 'listings' AND auth.role() = 'authenticated'
  );

## 4) Optional: Prevent overwrites (upsert false already used in client)
To prevent accidental overwrites, disallow update on storage.objects unless owner:

create policy "Owner can update" on storage.objects
  for update using (
    metadata->>'owner_id' = auth.uid()
  );

When uploading, include metadata: `{ owner_id: auth.user().id }` via client options if you want server to enforce ownership.

## 5) CORS / Signed URLs
If you prefer to keep the bucket private, use `createSignedUrl` server-side and send signed URLs to frontend. That requires server-side route to call Supabase admin key.

## 6) Example upload flow (client)
- Client authenticates using Supabase Auth
- Client chooses file and generates a safe filename (we use `${user.id}-${Date.now()}.${ext}`)
- Client calls `supabase.storage.from('listings').upload(fileName, file, { upsert: false })`
- Client retrieves public URL via `getPublicUrl(fileName)` and stores it in `listings` table

## Notes
- Double-check your Supabase project's public URL is set in `NEXT_PUBLIC_SUPABASE_URL` and matches `next.config.ts` remotePatterns.
- For stronger security, keep bucket private and issue signed URLs from a server-side endpoint.

If you want, I can provide exact SQL policies tailored to your Supabase project's dialect and help generate a server endpoint for signed upload URLs.
