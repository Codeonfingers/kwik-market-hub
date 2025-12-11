import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface OrderNotification {
  id: string;
  order_number: string;
  status: string;
  created_at: string;
  type: "new_order" | "status_change";
}

interface JobNotification {
  id: string;
  order_id: string;
  status: string;
  commission_amount: number | null;
  type: "new_job" | "job_update";
}

export const useRealtimeOrderNotifications = (vendorId: string | undefined) => {
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);

  useEffect(() => {
    if (!vendorId) return;

    console.log("Setting up realtime order notifications for vendor:", vendorId);

    const channel = supabase
      .channel(`vendor-orders-${vendorId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
          filter: `vendor_id=eq.${vendorId}`,
        },
        (payload) => {
          console.log("New order received:", payload);
          const newOrder = payload.new as any;
          
          toast.success(`New Order ${newOrder.order_number}!`, {
            description: "You have a new order to process",
            action: {
              label: "View",
              onClick: () => {
                // Could navigate to orders tab
              },
            },
          });

          setNotifications((prev) => [
            {
              id: newOrder.id,
              order_number: newOrder.order_number,
              status: newOrder.status,
              created_at: newOrder.created_at,
              type: "new_order",
            },
            ...prev,
          ]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `vendor_id=eq.${vendorId}`,
        },
        (payload) => {
          console.log("Order updated:", payload);
          const updatedOrder = payload.new as any;
          
          toast.info(`Order ${updatedOrder.order_number} Updated`, {
            description: `Status: ${updatedOrder.status}`,
          });

          setNotifications((prev) => [
            {
              id: updatedOrder.id,
              order_number: updatedOrder.order_number,
              status: updatedOrder.status,
              created_at: new Date().toISOString(),
              type: "status_change",
            },
            ...prev,
          ]);
        }
      )
      .subscribe((status) => {
        console.log("Vendor order subscription status:", status);
      });

    return () => {
      console.log("Cleaning up vendor order subscription");
      supabase.removeChannel(channel);
    };
  }, [vendorId]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return { notifications, clearNotifications };
};

export const useRealtimeJobNotifications = (shopperId: string | undefined) => {
  const [notifications, setNotifications] = useState<JobNotification[]>([]);
  const { hasRole } = useAuth();

  useEffect(() => {
    // Only subscribe if user is a shopper
    if (!hasRole("shopper")) return;

    console.log("Setting up realtime job notifications");

    const channel = supabase
      .channel("shopper-jobs")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "shopper_jobs",
          filter: `status=eq.available`,
        },
        (payload) => {
          console.log("New job available:", payload);
          const newJob = payload.new as any;
          
          toast.success("New Job Available!", {
            description: `Earn ₵${Number(newJob.commission_amount || 0).toFixed(2)} commission`,
            action: {
              label: "View",
              onClick: () => {
                // Could navigate to jobs tab
              },
            },
          });

          setNotifications((prev) => [
            {
              id: newJob.id,
              order_id: newJob.order_id,
              status: newJob.status,
              commission_amount: newJob.commission_amount,
              type: "new_job",
            },
            ...prev,
          ]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "shopper_jobs",
          filter: shopperId ? `shopper_id=eq.${shopperId}` : undefined,
        },
        (payload) => {
          console.log("Job updated:", payload);
          const updatedJob = payload.new as any;
          
          if (updatedJob.shopper_id === shopperId) {
            toast.info("Job Update", {
              description: `Job status: ${updatedJob.status}`,
            });
          }
        }
      )
      .subscribe((status) => {
        console.log("Shopper job subscription status:", status);
      });

    return () => {
      console.log("Cleaning up shopper job subscription");
      supabase.removeChannel(channel);
    };
  }, [shopperId, hasRole]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return { notifications, clearNotifications };
};

export const useRealtimeConsumerNotifications = (consumerId: string | undefined) => {
  useEffect(() => {
    if (!consumerId) return;

    console.log("Setting up realtime consumer notifications for:", consumerId);

    const channel = supabase
      .channel(`consumer-orders-${consumerId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `consumer_id=eq.${consumerId}`,
        },
        (payload) => {
          console.log("Consumer order updated:", payload);
          const updatedOrder = payload.new as any;
          
          const statusMessages: Record<string, string> = {
            accepted: "Your order has been accepted!",
            preparing: "Your order is being prepared",
            ready: "Your order is ready for pickup!",
            picked_up: "Your order has been picked up",
            inspecting: "Your order is ready for inspection",
            completed: "Order completed! Thank you!",
          };

          const message = statusMessages[updatedOrder.status];
          if (message) {
            toast.success(message, {
              description: `Order ${updatedOrder.order_number}`,
            });
          }
        }
      )
      .subscribe((status) => {
        console.log("Consumer order subscription status:", status);
      });

    return () => {
      console.log("Cleaning up consumer order subscription");
      supabase.removeChannel(channel);
    };
  }, [consumerId]);
};

// Alias for vendor notifications
export const useRealtimeVendorNotifications = useRealtimeOrderNotifications;

// Alias for shopper notifications
export const useRealtimeShopperNotifications = useRealtimeJobNotifications;
