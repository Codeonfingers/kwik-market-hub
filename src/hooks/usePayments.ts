import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Payment = Database["public"]["Tables"]["payments"]["Row"];
type PaymentStatus = Database["public"]["Enums"]["payment_status"];

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

    // Create payment record
    const { data: payment, error } = await supabase
      .from("payments")
      .insert({
        order_id: orderId,
        user_id: user.id,
        amount,
        payment_method: "momo",
        momo_phone: momoPhone,
        momo_network: momoNetwork,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      setProcessing(false);
      toast.error("Failed to initiate payment");
      return { error };
    }

    // Simulate MoMo payment processing (in real implementation, this would call MoMo API)
    toast.info("Processing Mobile Money payment...");

    // Simulate a delay and successful payment
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update payment status to completed (simulated)
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status: "completed",
        transaction_id: `MOMO-${Date.now()}`,
      })
      .eq("id", payment.id);

    if (updateError) {
      setProcessing(false);
      toast.error("Payment processing failed");
      return { error: updateError };
    }

    // Update order status
    await supabase
      .from("orders")
      .update({ status: "completed" })
      .eq("id", orderId);

    setProcessing(false);
    toast.success("Payment successful!");
    return { data: payment, error: null };
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
