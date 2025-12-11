import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Vendor = Database["public"]["Tables"]["vendors"]["Row"];
type Shopper = Database["public"]["Tables"]["shoppers"]["Row"];
type Order = Database["public"]["Tables"]["orders"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface VendorWithProfile extends Vendor {
  profile?: Profile;
}

interface ShopperWithProfile extends Shopper {
  profile?: Profile;
}

interface Dispute {
  id: string;
  order_id: string;
  order_number: string;
  type: string;
  status: "open" | "investigating" | "resolved";
  created_at: string;
  consumer_name: string;
  vendor_name: string;
  description: string;
}

type Market = Database["public"]["Tables"]["markets"]["Row"];

export const useAdminData = () => {
  const [vendors, setVendors] = useState<VendorWithProfile[]>([]);
  const [shoppers, setShoppers] = useState<ShopperWithProfile[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeOrders: 0,
    verifiedVendors: 0,
    activeShoppers: 0,
    pendingVerifications: 0,
    openDisputes: 0,
  });

  useEffect(() => {
    fetchAllData();
    setupRealtimeSubscription();
  }, []);

  const fetchAllData = async () => {
    try {
      const [vendorsRes, shoppersRes, ordersRes, marketsRes] = await Promise.all([
        supabase.from("vendors").select("*"),
        supabase.from("shoppers").select("*"),
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("markets").select("*"),
      ]);

      if (vendorsRes.data) setVendors(vendorsRes.data);
      if (shoppersRes.data) setShoppers(shoppersRes.data);
      if (marketsRes.data) setMarkets(marketsRes.data);
      if (ordersRes.data) {
        setOrders(ordersRes.data);
        
        // Calculate stats
        const completedOrders = ordersRes.data.filter((o) => o.status === "completed");
        const totalRevenue = completedOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
        const activeOrders = ordersRes.data.filter(
          (o) => !["completed", "cancelled"].includes(o.status)
        ).length;

        setStats({
          totalRevenue,
          activeOrders,
          verifiedVendors: vendorsRes.data?.filter((v) => v.is_verified).length || 0,
          activeShoppers: shoppersRes.data?.filter((s) => s.is_available).length || 0,
          pendingVerifications:
            (vendorsRes.data?.filter((v) => !v.is_verified).length || 0) +
            (shoppersRes.data?.filter((s) => !s.is_verified).length || 0),
          openDisputes: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel("admin-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => fetchAllData()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vendors" },
        () => fetchAllData()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "shoppers" },
        () => fetchAllData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const verifyVendor = async (vendorId: string) => {
    const { error } = await supabase
      .from("vendors")
      .update({ is_verified: true })
      .eq("id", vendorId);

    if (error) {
      toast.error("Failed to verify vendor");
      return { error };
    }

    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, is_verified: true } : v))
    );
    toast.success("Vendor verified successfully");
    return { error: null };
  };

  const verifyShopper = async (shopperId: string) => {
    const { error } = await supabase
      .from("shoppers")
      .update({ is_verified: true })
      .eq("id", shopperId);

    if (error) {
      toast.error("Failed to verify shopper");
      return { error };
    }

    setShoppers((prev) =>
      prev.map((s) => (s.id === shopperId ? { ...s, is_verified: true } : s))
    );
    toast.success("Shopper verified successfully");
    return { error: null };
  };

  const toggleVendorActive = async (vendorId: string, isActive: boolean) => {
    const { error } = await supabase
      .from("vendors")
      .update({ is_active: isActive })
      .eq("id", vendorId);

    if (error) {
      toast.error("Failed to update vendor status");
      return { error };
    }

    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, is_active: isActive } : v))
    );
    toast.success(`Vendor ${isActive ? "activated" : "deactivated"}`);
    return { error: null };
  };

  const toggleShopperAvailable = async (shopperId: string, isAvailable: boolean) => {
    const { error } = await supabase
      .from("shoppers")
      .update({ is_available: isAvailable })
      .eq("id", shopperId);

    if (error) {
      toast.error("Failed to update shopper status");
      return { error };
    }

    setShoppers((prev) =>
      prev.map((s) => (s.id === shopperId ? { ...s, is_available: isAvailable } : s))
    );
    return { error: null };
  };

  const updateVendorStatus = async (vendorId: string, updates: { is_verified?: boolean; is_active?: boolean }) => {
    const { error } = await supabase
      .from("vendors")
      .update(updates)
      .eq("id", vendorId);

    if (error) {
      toast.error("Failed to update vendor");
      return { error };
    }

    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, ...updates } : v))
    );
    return { error: null };
  };

  const updateShopperStatus = async (shopperId: string, updates: { is_verified?: boolean; is_available?: boolean }) => {
    const { error } = await supabase
      .from("shoppers")
      .update(updates)
      .eq("id", shopperId);

    if (error) {
      toast.error("Failed to update shopper");
      return { error };
    }

    setShoppers((prev) =>
      prev.map((s) => (s.id === shopperId ? { ...s, ...updates } : s))
    );
    return { error: null };
  };

  return {
    vendors,
    shoppers,
    orders,
    markets,
    disputes,
    stats,
    loading,
    verifyVendor,
    verifyShopper,
    toggleVendorActive,
    toggleShopperAvailable,
    updateVendorStatus,
    updateShopperStatus,
    refetch: fetchAllData,
  };
};
