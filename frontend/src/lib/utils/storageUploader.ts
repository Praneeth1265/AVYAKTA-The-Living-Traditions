import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload an image to Supabase Storage (event-images bucket)
 * @param base64Data - Base64 encoded image data
 * @param folderPath - Folder path (e.g., "slugs", "posters")
 * @param fileName - File name for the image
 * @returns Upload result with URL or error
 */
export async function uploadImageToStorage(
  base64Data: string,
  folderPath: string,
  fileName: string,
): Promise<UploadResult> {
  try {
    // Remove data URL prefix if present
    const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");

    // Convert base64 to blob
    const binaryString = atob(cleanBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: "image/jpeg" });

    // Create unique file name with timestamp
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${fileName}`;
    const filePath = `${folderPath}/${uniqueFileName}`;

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from("event-images")
      .upload(filePath, blob, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Storage upload error:", error);
      return {
        success: false,
        error: error.message || "Failed to upload image",
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("event-images")
      .getPublicUrl(filePath);

    return {
      success: true,
      url: urlData?.publicUrl,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Upload failed";
    console.error("Image upload error:", errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Delete an image from Supabase Storage
 * @param imageUrl - Public URL of the image
 * @returns Success/failure result
 */
export async function deleteImageFromStorage(imageUrl: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Extract file path from public URL
    // URL format: https://...supabasecdn.com/storage/v1/object/public/event-images/path/to/file
    const pathMatch = imageUrl.match(/event-images\/(.+)$/);
    if (!pathMatch || !pathMatch[1]) {
      return {
        success: false,
        error: "Invalid image URL",
      };
    }

    const filePath = pathMatch[1];

    const { error } = await supabase.storage
      .from("event-images")
      .remove([filePath]);

    if (error) {
      console.error("Storage delete error:", error);
      return {
        success: false,
        error: error.message || "Failed to delete image",
      };
    }

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Delete failed";
    console.error("Image delete error:", errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Parse comma-separated image URLs
 * @param imageUrlString - Comma-separated URLs
 * @returns Array of image URLs
 */
export function parseImageUrls(imageUrlString: string | null): string[] {
  if (!imageUrlString) return [];
  return imageUrlString
    .split(",")
    .map((url) => url.trim())
    .filter((url) => url.length > 0);
}

/**
 * Convert array of URLs to comma-separated string
 * @param urls - Array of image URLs
 * @returns Comma-separated URL string
 */
export function formatImageUrls(urls: string[]): string {
  return urls.join(",");
}
