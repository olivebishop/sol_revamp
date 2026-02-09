# Image Components & APIs

Comprehensive image handling system for Supabase Storage with Next.js 16+ optimizations.

## Components

### `SupabaseImage`
Client-side optimized image component for Supabase Storage URLs.

```tsx
import { SupabaseImage } from "@/components/shared/supabase-image";

<SupabaseImage
  src="https://your-project.supabase.co/storage/v1/object/public/bucket/image.jpg"
  alt="Description"
  className="w-full h-64"
  priority={false}
  loading="lazy"
/>
```

**Features:**
- Automatic fallback handling
- Loading states with blur placeholder
- Error handling
- Next.js Image optimization
- Memoized for performance

### `ServerImage`
Server-side image component optimized for caching.

```tsx
import { ServerImage } from "@/components/shared/server-image";

// In a Server Component
<ServerImage
  src={imageUrl}
  alt="Description"
  className="w-full h-64"
  priority={true}
/>
```

**Features:**
- Uses React `cache()` for request-level memoization
- Optimized for server-side rendering
- Can be used in static shell components

### `ImageUpload`
Drag-and-drop image upload component with preview.

```tsx
import { ImageUpload } from "@/components/shared/image-upload";

<ImageUpload
  bucket="packages"
  maxFiles={10}
  maxSizeMB={5}
  onUploadComplete={(urls) => console.log("Uploaded:", urls)}
  onUploadError={(error) => console.error(error)}
  existingImages={existingImageUrls}
  onRemove={(url) => console.log("Removed:", url)}
/>
```

**Features:**
- Drag and drop support
- Multiple file upload
- Real-time preview
- Progress indicators
- Error handling
- Automatic Supabase upload

### `ImageGallery`
Image gallery with lightbox functionality.

```tsx
import { ImageGallery } from "@/components/shared/image-gallery";

<ImageGallery
  images={imageUrls}
  alt="Gallery images"
  showThumbnails={true}
  className="my-4"
/>
```

**Features:**
- Lightbox modal
- Keyboard navigation (Arrow keys, Escape)
- Thumbnail grid
- Smooth animations
- Responsive design

### `ImagePreview`
Preview component for files before upload.

```tsx
import { ImagePreview } from "@/components/shared/image-preview";

<ImagePreview
  file={fileObject}
  onRemove={() => handleRemove()}
  showRemove={true}
/>
```

## API Routes

### `POST /api/images/upload`
Upload an image to Supabase Storage.

**Request:**
```typescript
FormData {
  file: File
  bucket: string
}
```

**Response:**
```json
{
  "success": true,
  "url": "https://...",
  "bucket": "packages",
  "filename": "image.jpg",
  "size": 123456
}
```

### `POST /api/images/delete`
Delete an image from Supabase Storage.

**Request:**
```json
{
  "url": "https://...",
  "bucket": "packages"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

### `GET /api/images/list`
List images from a bucket.

**Query Parameters:**
- `bucket` (required): Bucket name
- `folder` (optional): Folder path
- `limit` (optional): Max results (default: 100)

**Response:**
```json
{
  "success": true,
  "images": [...],
  "count": 10,
  "bucket": "packages"
}
```

## Usage Examples

### In a Form (Client Component)

```tsx
"use client";
import { ImageUpload } from "@/components/shared/image-upload";
import { useState } from "react";

export function PackageForm() {
  const [images, setImages] = useState<string[]>([]);

  return (
    <form>
      <ImageUpload
        bucket="packages"
        maxFiles={5}
        onUploadComplete={(urls) => setImages([...images, ...urls])}
        existingImages={images}
        onRemove={(url) => setImages(images.filter(img => img !== url))}
      />
    </form>
  );
}
```

### In a Page (Server Component with Streaming)

```tsx
import { Suspense, cache } from "react";
import { ServerImage } from "@/components/shared/server-image";

// Cached static shell
const StaticShell = cache(() => (
  <div>
    <h1>Gallery</h1>
  </div>
));

// Dynamic content (streams in)
async function GalleryContent() {
  const images = await fetchImages(); // Your data fetching
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((img) => (
        <ServerImage
          key={img.id}
          src={img.url}
          alt={img.alt}
          className="aspect-square"
        />
      ))}
    </div>
  );
}

export default function GalleryPage() {
  return (
    <>
      <StaticShell />
      <Suspense fallback={<div>Loading...</div>}>
        <GalleryContent />
      </Suspense>
    </>
  );
}
```

## Best Practices

### Caching (Next.js 16+)
- Use `ServerImage` with `cache()` for static shell components
- Use `SupabaseImage` in client components
- API routes automatically revalidate cache tags

### Streaming
- Wrap dynamic image content in `<Suspense>`
- Use static shell for immediate rendering
- Stream in image galleries and lists

### Performance
- Always provide `sizes` prop for responsive images
- Use `priority` for above-the-fold images
- Use `loading="lazy"` for below-the-fold images
- Memoize components with `React.memo` where appropriate

### Error Handling
- Components handle errors gracefully with fallbacks
- API routes return proper error responses
- Always handle upload errors in callbacks

## Environment Variables

Required in `.env`:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Supabase Setup

1. Create storage buckets in Supabase dashboard
2. Set buckets to public
3. Configure bucket policies for read/write access

See `docs/IMAGE_UPLOAD_SETUP.md` for detailed setup instructions.
