import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types";
import { 
  Clock, 
  CheckCircle2, 
  Package, 
  Truck, 
  Search, 
  ThumbsUp, 
  XCircle,
  AlertCircle 
} from "lucide-react";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  showIcon?: boolean;
}

const statusConfig: Record<OrderStatus, { label: string; variant: "pending" | "active" | "success" | "destructive" | "gold"; icon: typeof Clock }> = {
  pending: { label: "Pending", variant: "pending", icon: Clock },
  accepted: { label: "Accepted", variant: "active", icon: CheckCircle2 },
  preparing: { label: "Preparing", variant: "active", icon: Package },
  ready: { label: "Ready", variant: "gold", icon: Package },
  picked_up: { label: "Picked Up", variant: "active", icon: Truck },
  inspecting: { label: "Inspecting", variant: "pending", icon: Search },
  approved: { label: "Approved", variant: "success", icon: ThumbsUp },
  completed: { label: "Completed", variant: "success", icon: CheckCircle2 },
  disputed: { label: "Disputed", variant: "destructive", icon: AlertCircle },
  cancelled: { label: "Cancelled", variant: "destructive", icon: XCircle },
};

const OrderStatusBadge = ({ status, showIcon = true }: OrderStatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1.5">
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      {config.label}
    </Badge>
  );
};

export default OrderStatusBadge;
