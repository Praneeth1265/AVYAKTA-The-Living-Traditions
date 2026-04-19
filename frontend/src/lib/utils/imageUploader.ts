import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

interface UploadOptions {
  bucket: string;
  folder: string;
  fileName?: string;
}

/**
 * Uploads a base64 image to Supabase Storage and returns the public URL
 */
export async function uploadImageToStorage(
  base64Data: string,
  options: UploadOptions,
): Promise<string> {
  try {
    // Extract file extension from base64 data
    const matches = base64Data.match(/^data:image\/(\w+);base64,/);
    const extension = matches ? matches[1] : "jpg";

    // Remove data URI prefix
    const base64String = base64Data.replace(/^data:image\/\w+;base64,/, "");

    // Convert base64 to blob
    const binaryString = atob(base64String);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: `image/${extension}` });

    // Generate filename
    const fileName = options.fileName || `image-${Date.now()}.${extension}`;
    const filePath = `${options.folder}/${fileName}`;

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from(options.bucket)
      .upload(filePath, blob, {
        upsert: false,
        contentType: `image/${extension}`,
      });

    if (error) {
      console.error("Upload error:", error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(options.bucket).getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to upload image";
    console.error("Image upload failed:", errorMessage);
    throw new Error(errorMessage);
  }
}

/**
 * Uploads multiple images and returns an array of public URLs
 */
export async function uploadMultipleImages(
  images: string[],
  options: UploadOptions,
): Promise<string[]> {
  try {
    const uploadPromises = images.map((image, index) =>
      uploadImageToStorage(image, {
        ...options,
        fileName: options.fileName ? `${options.fileName}-${index}` : undefined,
      }),
    );

    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to upload images";
    console.error("Batch image upload failed:", errorMessage);
    throw new Error(errorMessage);
  }
}

/**
 * Deletes an image from Supabase Storage
 */
export async function deleteImageFromStorage(
  publicUrl: string,
  bucket: string,
): Promise<void> {
  try {
    // Extract file path from public URL
    const urlParts = publicUrl.split(`${bucket}/`);
    if (urlParts.length < 2) {
      throw new Error("Invalid storage URL");
    }

    const filePath = decodeURIComponent(urlParts[1]);

    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) {
      console.error("Delete error:", error);
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete image";
    console.error("Image deletion failed:", errorMessage);
    throw new Error(errorMessage);
  }
}
