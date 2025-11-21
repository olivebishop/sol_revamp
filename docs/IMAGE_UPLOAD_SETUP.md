# Image Upload with Supabase Storage

✅ **Image uploads are now enabled using Supabase Storage!**

## Setup Complete

The application is configured to upload images to Supabase Storage buckets:
- **Packages**: Stored in the `packages` bucket
- **Destinations**: Stored in the `destinations` bucket

## Supabase Storage Buckets Setup

You need to create the storage buckets in your Supabase dashboard:

1. Go to your Supabase project: https://dehakhyjxyadeogocxxi.supabase.co
2. Navigate to **Storage** in the left sidebar
3. Create two public buckets:
   - `packages` - for package images
   - `destinations` - for destination images
4. Make sure both buckets are set to **public** so images can be accessed via URL

### Creating a Bucket

1. Click "New bucket"
2. Enter bucket name (e.g., `packages`)
3. Toggle "Public bucket" to ON
4. Click "Create bucket"

### Setting Bucket Policies

For public access, you may need to add a policy:

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'packages' );

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'packages' AND auth.role() = 'authenticated' );
```

## How It Works

1. **Upload**: When you create a package or destination, images are uploaded to Supabase Storage
2. **Storage**: Files are stored with unique names (timestamp + random string)
3. **URL**: Public URLs are generated and stored in the database
4. **Fallback**: If upload fails, default placeholder images are used

## Files Involved

- `lib/supabase.ts` - Supabase client and upload utilities
- `app/api/packages/route.ts` - Package creation with image upload
- `app/api/destinations/route.ts` - Destination creation with image upload
- Form components - Handle file selection and upload

## Environment Variables

Already configured in `.env`:
```
NEXT_PUBLIC_SUPABASE_URL=https://dehakhyjxyadeogocxxi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Testing

1. Go to `/the-sol/dashboard/packages/add`
2. Fill in the form and select images
3. Submit - images will be uploaded to Supabase
4. Check your Supabase Storage dashboard to see the uploaded files
