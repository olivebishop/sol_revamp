# Image Storage Architecture

## Overview

Images are stored in **Supabase Storage buckets**, while image metadata is tracked in the **PostgreSQL database**. This hybrid approach provides the best of both worlds:

- **Supabase Buckets**: Store actual image files (fast, scalable, CDN-ready)
- **Database**: Store metadata, relations, and enable powerful queries

## Architecture

```
┌─────────────────┐
│   Image File    │
│  (Supabase      │
│   Bucket)       │
└────────┬────────┘
         │
         │ URL stored in
         │
┌────────▼─────────────┐
│   Image Model        │
│   (Database)         │
│                      │
│  - url (Supabase)    │
│  - bucket            │
│  - filename          │
│  - filePath          │
│  - fileSize          │
│  - mimeType          │
│  - width/height      │
│  - isHero            │
│  - displayOrder      │
│  - Relations         │
└──────────────────────┘
```

## How It Works

### 1. Upload Flow

```
User uploads image
    ↓
POST /api/images/upload
    ↓
Upload to Supabase Bucket (packages/destinations)
    ↓
Get public URL from Supabase
    ↓
Create Image record in Database
    ↓
Return imageId + URL
```

### 2. Storage Locations

- **Actual Files**: Stored in Supabase Storage buckets
  - `packages` bucket → Package images
  - `destinations` bucket → Destination images
  - `gallery` bucket → Gallery images (if used)

- **Metadata**: Stored in PostgreSQL `Image` table
  - URL reference to Supabase
  - File information (size, type, dimensions)
  - Relations to Package/Destination
  - Display settings (hero, order)

### 3. Access Pattern

```typescript
// Query images from database
const images = await prisma.image.findMany({
  where: { packageId: "..." },
  orderBy: [{ isHero: "desc" }, { displayOrder: "asc" }],
});

// Use the URL to display (points to Supabase)
<Image src={image.url} alt={image.alt} />
```

## Database Schema

### Image Model

```prisma
model Image {
  id          String   @id @default(cuid())
  url         String   // Public URL from Supabase
  bucket      String   // Supabase bucket name
  filename    String   // Original filename
  filePath    String   // Path in bucket
  fileSize    Int      // File size in bytes
  mimeType    String   // MIME type
  width       Int?     // Image width
  height      Int?     // Image height
  alt         String?  // Alt text
  isHero      Boolean  @default(false)
  displayOrder Int     @default(0)
  
  // Relations
  packageId     String?
  package       Package?
  destinationId String?
  destination   Destination?
}
```

## API Endpoints

### POST /api/images/upload

Uploads image to Supabase bucket and creates database record.

**Request:**
```typescript
FormData {
  file: File
  bucket: "packages" | "destinations"
  packageId?: string
  destinationId?: string
  isHero?: boolean
  displayOrder?: number
}
```

**Response:**
```json
{
  "success": true,
  "url": "https://...supabase.co/...",
  "imageId": "clx...",
  "bucket": "packages",
  "filename": "image.jpg",
  "size": 123456
}
```

### POST /api/images/delete

Deletes image from both Supabase bucket and database.

**Request:**
```json
{
  "imageId": "clx..." // OR
  "url": "...",
  "bucket": "packages"
}
```

### GET /api/images/list

Lists images from a bucket (optional, for admin).

## Benefits

### ✅ Performance
- Images served from Supabase CDN (fast global delivery)
- Database only stores lightweight metadata
- No database bloat from binary data

### ✅ Scalability
- Supabase handles image storage and delivery
- Database queries remain fast
- Easy to add CDN caching

### ✅ Queryability
- Query images by package, destination, bucket
- Filter by metadata (size, type, dimensions)
- Sort by display order, hero status
- Proper database relations

### ✅ Management
- Track which images belong to which entities
- Manage hero images
- Control display order
- Delete images from both locations atomically

## Supabase Buckets Setup

Your buckets are already configured:
- ✅ `packages` bucket (public)
- ✅ `destinations` bucket (public)

See `SUPABASE_STORAGE_SETUP.md` for details.

## Usage Examples

### Upload Image

```typescript
const formData = new FormData();
formData.append("file", file);
formData.append("bucket", "packages");
formData.append("packageId", packageId);
formData.append("isHero", "true");

const response = await fetch("/api/images/upload", {
  method: "POST",
  body: formData,
});

const { url, imageId } = await response.json();
```

### Get Package Images

```typescript
import { getPackageImages } from "@/lib/dal/images";

const images = await getPackageImages(packageId);
// Returns: Image[] with URLs pointing to Supabase
```

### Display Image

```typescript
import { SupabaseImage } from "@/components/shared/supabase-image";

<SupabaseImage
  src={image.url} // Supabase URL
  alt={image.alt || "Image"}
  className="w-full h-64"
/>
```

## Migration

If you have existing images in `String[]` arrays, run:

```bash
dotenv -e .env -- tsx scripts/migrate-images-to-db.ts
```

This will:
1. Find all image URLs in packages/destinations
2. Create Image records in database
3. Link them to their parent entities
4. Preserve all existing data

## Notes

- **Testimonials table is preserved** - No changes to reviews
- **Backward compatible** - Old `String[]` arrays still work
- **No data loss** - Migration preserves everything
- **Supabase required** - Buckets must be set up and public

## Troubleshooting

### Images Not Uploading
- Check Supabase bucket exists and is public
- Verify bucket name matches exactly
- Check authentication (admin required)

### Images Not Displaying
- Verify URL in database points to Supabase
- Check bucket is public
- Test URL directly in browser
- Check CORS settings in Supabase

### Database Errors
- Ensure Prisma client is generated
- Run migrations if schema changed
- Check database connection
