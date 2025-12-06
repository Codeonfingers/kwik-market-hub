import { Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface WhatsAppOrderButtonProps {
  marketName?: string;
  items?: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  specialInstructions?: string;
  phoneNumber?: string;
  variant?: "default" | "floating" | "inline";
}

const WhatsAppOrderButton = ({
  marketName = "KwikMarket",
  items = [],
  specialInstructions = "",
  phoneNumber = "+233201234567", // Default Ghana number - replace with actual
  variant = "default",
}: WhatsAppOrderButtonProps) => {
  const generateOrderMessage = () => {
    let message = `🛒 *New Order from KwikMarket*\n\n`;
    message += `📍 *Market:* ${marketName}\n\n`;

    if (items.length > 0) {
      message += `📦 *Items:*\n`;
      items.forEach((item, index) => {
        message += `${index + 1}. ${item.name} - ${item.quantity} ${item.unit}\n`;
      });
      message += `\n`;
    } else {
      message += `I would like to place an order. Here are the items I need:\n\n`;
      message += `(Please list your items here)\n\n`;
    }

    if (specialInstructions) {
      message += `📝 *Special Instructions:*\n${specialInstructions}\n\n`;
    }

    message += `Thank you! 🙏`;

    return encodeURIComponent(message);
  };

  const handleWhatsAppClick = () => {
    const message = generateOrderMessage();
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${message}`;
    
    window.open(whatsappUrl, "_blank");
    toast.success("Opening WhatsApp...");
  };

  if (variant === "floating") {
    return (
      <Button
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-[#25D366] hover:bg-[#128C7E] text-white z-50"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  if (variant === "inline") {
    return (
      <Button
        onClick={handleWhatsAppClick}
        variant="outline"
        className="gap-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"
      >
        <MessageCircle className="w-4 h-4" />
        Order via WhatsApp
      </Button>
    );
  }

  return (
    <Button
      onClick={handleWhatsAppClick}
      className="w-full gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white"
    >
      <MessageCircle className="w-5 h-5" />
      Order via WhatsApp
    </Button>
  );
};

export default WhatsAppOrderButton;
