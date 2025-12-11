import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  variant?: "default" | "primary" | "secondary" | "success" | "gold";
  className?: string;
}

const variantStyles = {
  default: "bg-card",
  primary: "bg-primary/5 border-primary/20",
  secondary: "bg-secondary/5 border-secondary/20",
  success: "bg-success/5 border-success/20",
  gold: "bg-gold/5 border-gold/20",
};

const iconVariantStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/20 text-primary",
  secondary: "bg-secondary/20 text-secondary",
  success: "bg-success/20 text-success",
  gold: "bg-gold/20 text-gold",
};

const DashboardCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  variant = "default",
  className 
}: DashboardCardProps) => {
  return (
    <Card className={cn("overflow-hidden", variantStyles[variant], className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center",
          iconVariantStyles[variant]
        )}>
          <Icon className="w-5 h-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl md:text-3xl font-display font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <p className={cn(
            "text-xs mt-2 font-medium",
            trend.positive ? "text-success" : "text-destructive"
          )}>
            {trend.positive ? "↑" : "↓"} {trend.value}% {trend.label}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
