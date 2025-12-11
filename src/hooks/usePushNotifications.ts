import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export const usePushNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      toast.error("Push notifications are not supported in this browser");
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === "granted") {
        toast.success("Notifications enabled!");
        return true;
      } else if (result === "denied") {
        toast.error("Notifications blocked. Please enable in browser settings.");
        return false;
      }
      return false;
    } catch {
      toast.error("Failed to enable notifications");
      return false;
    }
  }, [isSupported]);

  const sendNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!isSupported || permission !== "granted") {
        return null;
      }

      try {
        const notification = new Notification(title, {
          icon: "/favicon-32x32.png",
          badge: "/favicon-32x32.png",
          ...options,
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        return notification;
      } catch {
        return null;
      }
    },
    [isSupported, permission]
  );

  const notifyNewOrder = useCallback(
    (orderNumber: string) => {
      sendNotification("New Order Received!", {
        body: `Order ${orderNumber} is waiting for your confirmation`,
        tag: `order-${orderNumber}`,
      });
    },
    [sendNotification]
  );

  const notifyOrderStatus = useCallback(
    (orderNumber: string, status: string) => {
      const statusMessages: Record<string, string> = {
        accepted: "Your order has been accepted by the vendor",
        preparing: "Your order is being prepared",
        ready: "Your order is ready for pickup",
        picked_up: "A shopper has picked up your order",
        completed: "Your order has been delivered!",
      };

      sendNotification(`Order ${orderNumber} Update`, {
        body: statusMessages[status] || `Status changed to ${status}`,
        tag: `order-${orderNumber}-status`,
      });
    },
    [sendNotification]
  );

  const notifyNewJob = useCallback(
    (commission: number) => {
      sendNotification("New Job Available!", {
        body: `Earn ₵${commission.toFixed(2)} - Accept now!`,
        tag: "new-job",
      });
    },
    [sendNotification]
  );

  return {
    isSupported,
    permission,
    requestPermission,
    sendNotification,
    notifyNewOrder,
    notifyOrderStatus,
    notifyNewJob,
  };
};
