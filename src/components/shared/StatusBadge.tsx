import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = 
  | "pending" 
  | "accepted" 
  | "preparing" 
  | "ready" 
  | "picked_up" 
  | "inspecting" 
  | "approved" 
  | "completed" 
  | "disputed" 
  | "cancelled"
  | "available"
  | "in_progress"
  | "delivered"
  | "active"
  | "inactive"
  | "verified"
  | "unverified";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-accent/20 text-accent-foreground border-accent/30" },
  accepted: { label: "Accepted", className: "bg-primary/20 text-primary border-primary/30" },
  preparing: { label: "Preparing", className: "bg-secondary/20 text-secondary border-secondary/30" },
  ready: { label: "Ready", className: "bg-success/20 text-success border-success/30" },
  picked_up: { label: "Picked Up", className: "bg-primary/20 text-primary border-primary/30" },
  inspecting: { label: "Inspecting", className: "bg-gold/20 text-gold border-gold/30" },
  approved: { label: "Approved", className: "bg-success/20 text-success border-success/30" },
  completed: { label: "Completed", className: "bg-success/20 text-success border-success/30" },
  disputed: { label: "Disputed", className: "bg-destructive/20 text-destructive border-destructive/30" },
  cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground border-muted" },
  available: { label: "Available", className: "bg-success/20 text-success border-success/30" },
  in_progress: { label: "In Progress", className: "bg-secondary/20 text-secondary border-secondary/30" },
  delivered: { label: "Delivered", className: "bg-success/20 text-success border-success/30" },
  active: { label: "Active", className: "bg-success/20 text-success border-success/30" },
  inactive: { label: "Inactive", className: "bg-muted text-muted-foreground border-muted" },
  verified: { label: "Verified", className: "bg-success/20 text-success border-success/30" },
  unverified: { label: "Unverified", className: "bg-accent/20 text-accent-foreground border-accent/30" },
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <Badge 
      variant="outline" 
      className={cn("border font-medium", config.className, className)}
    >
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
