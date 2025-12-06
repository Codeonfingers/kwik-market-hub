import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Rating = Database["public"]["Tables"]["ratings"]["Row"];

export const useRatings = () => {
  const { user } = useAuth();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRatings([]);
      setLoading(false);
      return;
    }

    const fetchRatings = async () => {
      const { data, error } = await supabase
        .from("ratings")
        .select("*")
        .eq("from_user_id", user.id);

      if (error) console.error("Error fetching ratings:", error);
      setRatings(data || []);
      setLoading(false);
    };

    fetchRatings();
  }, [user]);

  const createRating = async (
    orderId: string,
    toUserId: string,
    rating: number,
    comment?: string
  ) => {
    if (!user) return { error: new Error("Not authenticated") };

    // Check if already rated
    const existing = ratings.find(
      (r) => r.order_id === orderId && r.to_user_id === toUserId
    );
    if (existing) {
      toast.error("You've already rated this order");
      return { error: new Error("Already rated") };
    }

    const { data, error } = await supabase
      .from("ratings")
      .insert({
        order_id: orderId,
        from_user_id: user.id,
        to_user_id: toUserId,
        rating,
        comment,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to submit rating");
      return { error };
    }

    setRatings((prev) => [...prev, data]);
    toast.success("Rating submitted successfully!");
    return { data, error: null };
  };

  const hasRatedOrder = (orderId: string, toUserId: string) => {
    return ratings.some(
      (r) => r.order_id === orderId && r.to_user_id === toUserId
    );
  };

  const getAverageRating = async (userId: string) => {
    const { data, error } = await supabase
      .from("ratings")
      .select("rating")
      .eq("to_user_id", userId);

    if (error || !data || data.length === 0) return 0;

    const sum = data.reduce((acc, r) => acc + r.rating, 0);
    return sum / data.length;
  };

  return { ratings, loading, createRating, hasRatedOrder, getAverageRating };
};
