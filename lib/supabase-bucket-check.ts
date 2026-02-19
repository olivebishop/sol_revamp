/**
 * Utility to check Supabase Storage bucket configuration
 * This helps diagnose image rendering issues
 */

import { supabase } from "./supabase";

export interface BucketCheckResult {
  bucket: string;
  exists: boolean;
  isPublic: boolean;
  error?: string;
  sampleUrl?: string;
}

/**
 * Check if a Supabase Storage bucket exists and is publicly accessible
 */
export async function checkBucketAccess(bucketName: string): Promise<BucketCheckResult> {
  try {
    // Try to list files in the bucket (requires public access or auth)
    const { data, error } = await supabase.storage.from(bucketName).list("", {
      limit: 1,
    });

    if (error) {
      return {
        bucket: bucketName,
        exists: false,
        isPublic: false,
        error: error.message,
      };
    }

    // If we can list, the bucket exists
    // Check if we can get a public URL (test with a sample file if available)
    let sampleUrl: string | undefined;
    if (data && data.length > 0) {
      const sampleFile = data[0];
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(sampleFile.name);
      sampleUrl = urlData.publicUrl;
    }

    return {
      bucket: bucketName,
      exists: true,
      isPublic: true, // If we can list without auth, it's public
      sampleUrl,
    };
  } catch (err) {
    return {
      bucket: bucketName,
      exists: false,
      isPublic: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Verify image URL format and accessibility
 */
export async function verifyImageUrl(url: string): Promise<{
  valid: boolean;
  accessible: boolean;
  error?: string;
}> {
  try {
    // Check if it's a Supabase URL
    if (!url.includes("supabase.co") && !url.includes("supabase")) {
      return {
        valid: false,
        accessible: false,
        error: "Not a Supabase URL",
      };
    }

    // Try to fetch the image (head request)
    const response = await fetch(url, { method: "HEAD" });
    
    return {
      valid: true,
      accessible: response.ok,
      error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`,
    };
  } catch (err) {
    return {
      valid: true,
      accessible: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
