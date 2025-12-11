import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const usePayments = () => {
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);

  const initiatePayment = async (
    orderId: string,
    amount: number,
    momoPhone: string,
    momoNetwork: "mtn" | "vodafone" | "airteltigo"
  ) => {
    if (!user) return { error: new Error("Not authenticated") };

    setProcessing(true);
    toast.info("Processing Mobile Money payment...");

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (!token) {
        setProcessing(false);
        toast.error("Session expired. Please log in again.");
        return { error: new Error("No session token") };
      }

      const response = await supabase.functions.invoke("process-payment", {
        body: { orderId, amount, momoPhone, momoNetwork },
      });

      if (response.error) {
        setProcessing(false);
        toast.error(response.error.message || "Payment failed");
        return { error: response.error };
      }

      if (!response.data?.success) {
        setProcessing(false);
        toast.error(response.data?.error || "Payment processing failed");
        return { error: new Error(response.data?.error || "Payment failed") };
      }

      setProcessing(false);
      toast.success("Payment successful!");
      return { data: response.data.payment, error: null };
    } catch (error) {
      setProcessing(false);
      toast.error("An error occurred during payment");
      return { error: error instanceof Error ? error : new Error("Unknown error") };
    }
  };

  const getPaymentsByOrder = async (orderId: string) => {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("order_id", orderId);

    return { data, error };
  };

  return { initiatePayment, getPaymentsByOrder, processing };
};
