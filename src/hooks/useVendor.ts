import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Vendor = Database["public"]["Tables"]["vendors"]["Row"];

export const useVendor = () => {
  const { user, addRole } = useAuth();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setVendor(null);
      setLoading(false);
      return;
    }

    const fetchVendor = async () => {
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) console.error("Error fetching vendor:", error);
      setVendor(data);
      setLoading(false);
    };

    fetchVendor();
  }, [user]);

  const createVendor = async (
    businessName: string,
    marketId: string,
    description?: string,
    stallNumber?: string
  ) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { data, error } = await supabase
      .from("vendors")
      .insert({
        user_id: user.id,
        business_name: businessName,
        market_id: marketId,
        description,
        stall_number: stallNumber,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to create vendor profile");
      return { error };
    }

    // Add vendor role
    await addRole("vendor");

    setVendor(data);
    toast.success("Vendor profile created!");
    return { data, error: null };
  };

  const updateVendor = async (updates: Partial<Vendor>) => {
    if (!vendor) return { error: new Error("No vendor profile") };

    const { error } = await supabase
      .from("vendors")
      .update(updates)
      .eq("id", vendor.id);

    if (error) {
      toast.error("Failed to update vendor profile");
      return { error };
    }

    setVendor((prev) => (prev ? { ...prev, ...updates } : null));
    toast.success("Vendor profile updated!");
    return { error: null };
  };

  return { vendor, loading, createVendor, updateVendor };
};
