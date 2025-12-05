import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];

export const useProducts = (vendorId?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      let query = supabase.from("products").select("*").eq("is_available", true);
      
      if (vendorId) {
        query = query.eq("vendor_id", vendorId);
      }

      const [productsRes, categoriesRes] = await Promise.all([
        query,
        supabase.from("categories").select("*"),
      ]);

      if (productsRes.error) console.error("Error fetching products:", productsRes.error);
      if (categoriesRes.error) console.error("Error fetching categories:", categoriesRes.error);

      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
      setLoading(false);
    };

    fetchData();
  }, [vendorId]);

  const createProduct = async (product: Omit<Product, "id" | "created_at" | "updated_at">) => {
    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select()
      .single();

    if (error) {
      toast.error("Failed to create product");
      return { error };
    }

    setProducts((prev) => [data, ...prev]);
    toast.success("Product created!");
    return { data, error: null };
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const { error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id);

    if (error) {
      toast.error("Failed to update product");
      return { error };
    }

    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    toast.success("Product updated!");
    return { error: null };
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete product");
      return { error };
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Product deleted!");
    return { error: null };
  };

  return { products, categories, loading, createProduct, updateProduct, deleteProduct };
};
