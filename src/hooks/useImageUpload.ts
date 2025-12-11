import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File, bucket: string = "product-images"): Promise<{ url: string | null; error: string | null }> => {
    try {
      setUploading(true);

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload a JPG, PNG, WebP, or GIF image.");
        return { url: null, error: "Invalid file type" };
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("File too large. Maximum size is 5MB.");
        return { url: null, error: "File too large" };
      }

      // Generate unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast.error("Failed to upload image. Please try again.");
        return { url: null, error: uploadError.message };
      }

      // Get public URL
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return { url: data.publicUrl, error: null };
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An error occurred while uploading the image.");
      return { url: null, error: "Upload failed" };
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (url: string, bucket: string = "product-images"): Promise<boolean> => {
    try {
      // Extract file path from URL
      const urlParts = url.split(`/${bucket}/`);
      if (urlParts.length < 2) return false;
      
      const filePath = urlParts[1];

      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        console.error("Delete error:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Delete error:", error);
      return false;
    }
  };

  return {
    uploadImage,
    deleteImage,
    uploading,
  };
}