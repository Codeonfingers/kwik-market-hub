import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "market" | "gold";
  index?: number;
}

const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  variant = "default",
  index = 0 
}: StatsCardProps) => {
  const variants = {
    default: "bg-card",
    primary: "gradient-primary text-primary-foreground",
    market: "gradient-market text-market-foreground",
    gold: "gradient-gold text-gold-foreground",
  };

  const iconBg = {
    default: "bg-primary/10 text-primary",
    primary: "bg-primary-foreground/20 text-primary-foreground",
    market: "bg-market-foreground/20 text-market-foreground",
    gold: "bg-gold-foreground/20 text-gold-foreground",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className={cn("border-none shadow-md", variants[variant])}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className={cn(
                "text-sm font-medium",
                variant === "default" ? "text-muted-foreground" : "opacity-80"
              )}>
                {title}
              </p>
              <p className="text-3xl font-display font-bold">{value}</p>
              {subtitle && (
                <p className={cn(
                  "text-sm",
                  variant === "default" ? "text-muted-foreground" : "opacity-70"
                )}>
                  {subtitle}
                </p>
              )}
              {trend && (
                <p className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}>
                  {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% from last week
                </p>
              )}
            </div>
            <div className={cn("p-3 rounded-xl", iconBg[variant])}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;
