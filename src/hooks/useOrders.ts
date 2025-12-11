import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Order = Database["public"]["Tables"]["orders"]["Row"];
type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
type OrderStatus = Database["public"]["Enums"]["order_status"];

export interface OrderWithItems extends Order {
  items?: OrderItem[];
}

export const useOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });

      if (!error) {
        setOrders(data?.map(o => ({ ...o, items: o.order_items })) || []);
      }
      setLoading(false);
    };

    fetchOrders();

    // Set up real-time subscription
    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setOrders((prev) => [payload.new as Order, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setOrders((prev) =>
              prev.map((o) => (o.id === payload.new.id ? { ...o, ...payload.new } : o))
            );
            toast.info(`Order ${(payload.new as Order).order_number} status updated`);
          } else if (payload.eventType === "DELETE") {
            setOrders((prev) => prev.filter((o) => o.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const createOrder = async (
    vendorId: string,
    marketId: string,
    items: { productId: string; productName: string; quantity: number; unitPrice: number }[],
    specialInstructions?: string
  ) => {
    if (!user) return { error: new Error("Not authenticated") };

    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const shopperFee = subtotal * 0.1;
    const total = subtotal + shopperFee;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([{
        consumer_id: user.id,
        vendor_id: vendorId,
        market_id: marketId,
        special_instructions: specialInstructions,
        subtotal,
        shopper_fee: shopperFee,
        total,
        order_number: `KM-${Date.now()}`,
      }])
      .select()
      .single();

    if (orderError) return { error: orderError };

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.unitPrice * item.quantity,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

    if (itemsError) return { error: itemsError };

    // Create shopper job
    await supabase.from("shopper_jobs").insert({
      order_id: order.id,
      commission_amount: shopperFee,
    });

    toast.success("Order placed successfully!");
    return { data: order, error: null };
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const response = await supabase.functions.invoke("update-order-status", {
        body: { orderId, newStatus: status },
      });

      if (response.error) {
        toast.error(response.error.message || "Failed to update order status");
        return { error: response.error };
      }

      if (!response.data?.success) {
        toast.error(response.data?.error || "Status update failed");
        return { error: new Error(response.data?.error || "Update failed") };
      }

      toast.success(`Order status updated to ${status}`);
      return { error: null };
    } catch (error) {
      toast.error("An error occurred updating order status");
      return { error: error instanceof Error ? error : new Error("Unknown error") };
    }
  };

  return { orders, loading, createOrder, updateOrderStatus };
};
