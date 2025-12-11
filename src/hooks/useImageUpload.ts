import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File, bucket: string = "product-images"): Promise<{ url: string | null; error: string | null }> => {
    try {
      setUploading(true);

      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload a JPG, PNG, WebP, or GIF image.");
        return { url: null, error: "Invalid file type" };
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("File too large. Maximum size is 5MB.");
        return { url: null, error: "File too large" };
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        toast.error("Failed to upload image. Please try again.");
        return { url: null, error: uploadError.message };
      }

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return { url: data.publicUrl, error: null };
    } catch {
      toast.error("An error occurred while uploading the image.");
      return { url: null, error: "Upload failed" };
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (url: string, bucket: string = "product-images"): Promise<boolean> => {
    try {
      const urlParts = url.split(`/${bucket}/`);
      if (urlParts.length < 2) return false;
      
      const filePath = urlParts[1];

      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      return !error;
    } catch {
      return false;
    }
  };

  return { uploadImage, deleteImage, uploading };
}
