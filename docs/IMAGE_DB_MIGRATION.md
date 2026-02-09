# Image Database Migration Guide

## Overview

Images are now stored in the database with proper relations to Packages and Destinations, while the actual files remain in Supabase Storage buckets. This provides better querying, management, and tracking of images.

## What Changed

### New Image Model
- Created `Image` model in Prisma schema
- Stores image metadata (URL, bucket, filename, size, dimensions, etc.)
- Relations to `Package` and `Destination` models
- Supports hero images and display ordering

### Backward Compatibility
- Original `String[]` arrays (`images` field) are kept for backward compatibility
- Existing code will continue to work
- Migration script available to move existing images to new structure

## Migration Steps

### 1. Update Prisma Schema

The schema has been updated. Run:

```bash
# Generate Prisma client
pnpm prisma:generate

# Create and apply migration
pnpm prisma:migrate
```

### 2. Run Migration Script

Migrate existing image URLs to the new Image model:

```bash
dotenv -e .env -- tsx scripts/migrate-images-to-db.ts
```

This script will:
- Find all packages with images
- Find all destinations with images (including heroImage)
- Create Image records in the database
- Preserve all existing data

### 3. Update Your Code (Optional)

You can now use the new Image model in your code:

```typescript
// Get images with metadata
import { getPackageImages } from "@/lib/dal/images";

const images = await getPackageImages(packageId);
// Returns: [{ id, url, bucket, filename, isHero, displayOrder, ... }]
```

Or query directly:

```typescript
import { prisma } from "@/lib/prisma";

const packageWithImages = await prisma.package.findUnique({
  where: { id: packageId },
  include: {
    packageImages: {
      orderBy: [
        { isHero: "desc" },
        { displayOrder: "asc" },
      ],
    },
  },
});
```

## API Changes

### Upload API (`POST /api/images/upload`)

Now accepts optional parameters to link images:

```typescript
const formData = new FormData();
formData.append("file", file);
formData.append("bucket", "packages");
formData.append("packageId", packageId); // Optional
formData.append("destinationId", destinationId); // Optional
formData.append("isHero", "true"); // Optional
formData.append("displayOrder", "0"); // Optional

const response = await fetch("/api/images/upload", {
  method: "POST",
  body: formData,
});

// Response includes imageId
const { url, imageId } = await response.json();
```

### Delete API (`POST /api/images/delete`)

Now accepts either `imageId` or `url` + `bucket`:

```typescript
// Option 1: Delete by imageId (recommended)
await fetch("/api/images/delete", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ imageId: "..." }),
});

// Option 2: Delete by URL (backward compatible)
await fetch("/api/images/delete", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: "...", bucket: "packages" }),
});
```

## Benefits

1. **Better Querying**: Query images by package, destination, bucket, etc.
2. **Metadata Tracking**: Store file size, dimensions, alt text, etc.
3. **Hero Image Management**: Easily identify and manage hero images
4. **Display Ordering**: Control the order images appear
5. **Relations**: Proper database relations for data integrity
6. **Analytics**: Track image usage, sizes, etc.

## Data Structure

### Image Model Fields

- `id`: Unique identifier
- `url`: Public URL from Supabase
- `bucket`: Supabase bucket name
- `filename`: Original filename
- `filePath`: Path in bucket
- `fileSize`: Size in bytes
- `mimeType`: MIME type (e.g., "image/jpeg")
- `width`: Image width (optional)
- `height`: Image height (optional)
- `alt`: Alt text for accessibility
- `isHero`: Is this a hero image?
- `displayOrder`: Order for display
- `packageId`: Related package (optional)
- `destinationId`: Related destination (optional)

## Helper Functions

See `lib/dal/images.ts` for helper functions:

- `createImage()` - Create image record
- `createImages()` - Create multiple images
- `getPackageImages()` - Get images for a package
- `getDestinationImages()` - Get images for a destination
- `deleteImage()` - Delete image
- `setHeroImage()` - Set hero image
- `updateImageOrder()` - Update display order

## Notes

- **Testimonials table is preserved** - No changes to reviews/testimonials
- **Backward compatible** - Existing code using `String[]` arrays still works
- **Gradual migration** - You can migrate at your own pace
- **No data loss** - Migration script preserves all existing images

## Troubleshooting

### Migration Fails

If migration fails, check:
1. Database connection
2. Prisma client is generated
3. Image URLs are valid
4. Bucket names match

### Images Not Showing

1. Verify Image records exist in database
2. Check relations (packageId/destinationId)
3. Verify Supabase bucket permissions
4. Check image URLs are accessible

### Performance

For large datasets:
- Migration runs in batches
- Use transactions for data integrity
- Indexes are created automatically
