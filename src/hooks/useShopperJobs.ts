import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type ShopperJob = Database["public"]["Tables"]["shopper_jobs"]["Row"];
type Shopper = Database["public"]["Tables"]["shoppers"]["Row"];
type Order = Database["public"]["Tables"]["orders"]["Row"];

export interface JobWithOrder extends ShopperJob {
  order?: Order;
}

export const useShopperJobs = () => {
  const { user, addRole } = useAuth();
  const [shopper, setShopper] = useState<Shopper | null>(null);
  const [availableJobs, setAvailableJobs] = useState<JobWithOrder[]>([]);
  const [myJobs, setMyJobs] = useState<JobWithOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setShopper(null);
      setAvailableJobs([]);
      setMyJobs([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      // Fetch shopper profile
      const { data: shopperData } = await supabase
        .from("shoppers")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      setShopper(shopperData);

      // Fetch available jobs
      const { data: availableData } = await supabase
        .from("shopper_jobs")
        .select("*, orders(*)")
        .eq("status", "available")
        .is("shopper_id", null);

      setAvailableJobs(
        availableData?.map((j) => ({ ...j, order: j.orders as unknown as Order })) || []
      );

      // Fetch my jobs if shopper exists
      if (shopperData) {
        const { data: myJobsData } = await supabase
          .from("shopper_jobs")
          .select("*, orders(*)")
          .eq("shopper_id", shopperData.id);

        setMyJobs(
          myJobsData?.map((j) => ({ ...j, order: j.orders as unknown as Order })) || []
        );
      }

      setLoading(false);
    };

    fetchData();

    // Set up real-time subscription for jobs
    const channel = supabase
      .channel("shopper-jobs-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "shopper_jobs",
        },
        (payload) => {
          console.log("Job change:", payload);
          if (payload.eventType === "INSERT" && payload.new.status === "available") {
            // Fetch the full job with order details
            supabase
              .from("shopper_jobs")
              .select("*, orders(*)")
              .eq("id", payload.new.id)
              .single()
              .then(({ data }) => {
                if (data) {
                  setAvailableJobs((prev) => [
                    { ...data, order: data.orders as unknown as Order },
                    ...prev,
                  ]);
                }
              });
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as ShopperJob;
            if (updated.status !== "available") {
              setAvailableJobs((prev) => prev.filter((j) => j.id !== updated.id));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const createShopperProfile = async (marketId: string) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { data, error } = await supabase
      .from("shoppers")
      .insert({
        user_id: user.id,
        market_id: marketId,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to create shopper profile");
      return { error };
    }

    await addRole("shopper");
    setShopper(data);
    toast.success("Shopper profile created!");
    return { data, error: null };
  };

  const acceptJob = async (jobId: string) => {
    if (!shopper) return { error: new Error("No shopper profile") };

    const { error } = await supabase
      .from("shopper_jobs")
      .update({
        shopper_id: shopper.id,
        status: "accepted",
        accepted_at: new Date().toISOString(),
      })
      .eq("id", jobId);

    if (error) {
      toast.error("Failed to accept job");
      return { error };
    }

    // Update order status
    const job = availableJobs.find((j) => j.id === jobId);
    if (job?.order_id) {
      await supabase
        .from("orders")
        .update({ shopper_id: shopper.id, status: "picked_up" })
        .eq("id", job.order_id);
    }

    toast.success("Job accepted!");
    return { error: null };
  };

  const updateJobStatus = async (jobId: string, status: string) => {
    const { error } = await supabase
      .from("shopper_jobs")
      .update({ status })
      .eq("id", jobId);

    if (error) {
      toast.error("Failed to update job status");
      return { error };
    }

    toast.success(`Job status updated to ${status}`);
    return { error: null };
  };

  const completeJob = async (jobId: string) => {
    if (!shopper) return { error: new Error("No shopper profile") };

    const { error } = await supabase
      .from("shopper_jobs")
      .update({
        status: "completed",
        delivered_at: new Date().toISOString(),
      })
      .eq("id", jobId);

    if (error) {
      toast.error("Failed to complete job");
      return { error };
    }

    // Update shopper stats
    await supabase
      .from("shoppers")
      .update({ total_deliveries: (shopper.total_deliveries || 0) + 1 })
      .eq("id", shopper.id);

    toast.success("Job completed!");
    return { error: null };
  };

  return {
    shopper,
    availableJobs,
    myJobs,
    loading,
    createShopperProfile,
    acceptJob,
    updateJobStatus,
    completeJob,
  };
};
