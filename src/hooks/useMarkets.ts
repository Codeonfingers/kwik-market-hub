import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Market = Database["public"]["Tables"]["markets"]["Row"];

export const useMarkets = () => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarkets = async () => {
      const { data, error } = await supabase
        .from("markets")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) {
        console.error("Error fetching markets:", error);
      } else {
        setMarkets(data || []);
      }
      setLoading(false);
    };

    fetchMarkets();
  }, []);

  return { markets, loading };
};
