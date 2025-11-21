# Supabase Storage Setup Guide

## Problem
Images are being saved to the database but not displaying because Supabase Storage buckets need to be created and configured.

## Solution - Create Storage Buckets

### Step 1: Go to Supabase Dashboard
1. Visit: https://supabase.com/dashboard/project/dehakhyjxyadeogocxxi
2. Click on **Storage** in the left sidebar

### Step 2: Create Buckets

#### Create "packages" Bucket
1. Click **"New bucket"**
2. Name: `packages`
3. Toggle **"Public bucket"** to **ON** ✅
4. Click **"Create bucket"**

#### Create "destinations" Bucket
1. Click **"New bucket"**
2. Name: `destinations`
3. Toggle **"Public bucket"** to **ON** ✅
4. Click **"Create bucket"**

### Step 3: Set Bucket Policies (If Needed)

If images still don't show, you may need to add policies:

1. Click on the bucket name
2. Go to **"Policies"** tab
3. Click **"New Policy"**
4. Select **"For full customization"**

#### Policy for Public Read Access:
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'packages' );
```

Repeat for `destinations` bucket.

#### Policy for Authenticated Upload:
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( 
  bucket_id = 'packages' 
  AND auth.role() = 'authenticated' 
);
```

Repeat for `destinations` bucket.

### Step 4: Verify Setup

1. Go to Storage > packages
2. Try uploading a test image manually
3. Click on the image
4. Copy the public URL
5. Open it in a new tab - it should display

The URL should look like:
```
https://dehakhyjxyadeogocxxi.supabase.co/storage/v1/object/public/packages/filename.jpg
```

### Step 5: Test in Your App

1. Create a new package or destination
2. Upload an image
3. Check if it displays on the detail page
4. If not, check browser console for errors

## Troubleshooting

### Images Not Uploading
- Check that buckets exist
- Verify bucket names are exactly: `packages` and `destinations`
- Check browser console for errors

### Images Not Displaying
- Verify buckets are set to **PUBLIC**
- Check the image URL in the database - it should start with `https://dehakhyjxyadeogocxxi.supabase.co/`
- Try opening the image URL directly in browser
- Check browser console for CORS or 404 errors

### 404 Errors
- Bucket doesn't exist
- Bucket name is wrong
- File wasn't uploaded successfully

### 403 Forbidden Errors
- Bucket is not public
- Missing storage policies
- Need to add the policies mentioned above

## Quick Check

Run this in your browser console on any page:
```javascript
fetch('https://dehakhyjxyadeogocxxi.supabase.co/storage/v1/object/public/packages/')
  .then(r => console.log('Packages bucket:', r.status))
  .catch(e => console.error('Error:', e));

fetch('https://dehakhyjxyadeogocxxi.supabase.co/storage/v1/object/public/destinations/')
  .then(r => console.log('Destinations bucket:', r.status))
  .catch(e => console.error('Error:', e));
```

If you get 404, the buckets don't exist.
If you get 200, the buckets are set up correctly.

## After Setup

Once buckets are created and public:
1. Images will upload automatically when creating packages/destinations
2. Images will display on all pages
3. No code changes needed - it will just work!
