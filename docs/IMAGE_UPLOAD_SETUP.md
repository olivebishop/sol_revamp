# Image Upload Setup Guide

Currently, image uploads are disabled because Vercel's serverless environment doesn't support persistent file system writes. To enable image uploads, you need to integrate with a cloud storage provider.

## Recommended Solutions

### Option 1: Vercel Blob (Easiest for Vercel deployments)

1. Install the package:
```bash
pnpm add @vercel/blob
```

2. Add environment variable to `.env`:
```
BLOB_READ_WRITE_TOKEN=your_token_here
```

3. Update API routes to use Vercel Blob:
```typescript
import { put } from '@vercel/blob';

const blob = await put(filename, file, {
  access: 'public',
});
const imageUrl = blob.url;
```

### Option 2: Cloudinary (Most feature-rich)

1. Install the package:
```bash
pnpm add cloudinary
```

2. Add environment variables:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. Update API routes to use Cloudinary.

### Option 3: AWS S3 (Most scalable)

1. Install AWS SDK:
```bash
pnpm add @aws-sdk/client-s3
```

2. Add environment variables and configure S3 client.

## Files to Update

When implementing image uploads, update these files:
- `app/api/packages/route.ts` - Package creation endpoint
- `app/api/destinations/route.ts` - Destination creation endpoint
- `app/(dashboard)/the-sol/dashboard/packages/add/page.tsx` - Re-enable file inputs
- `app/(dashboard)/the-sol/dashboard/destinations/add/page.tsx` - Re-enable file inputs

## Current Behavior

- Packages use default images: `/images/default-package.jpg`, `/images/lion.png`, `/images/elephant.png`
- Destinations use default images: `/images/default-destination.jpg`, `/images/giraffe.png`, `/images/elephant.png`
