import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Store, Briefcase, Shield, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

type AppRole = "consumer" | "vendor" | "shopper" | "admin";

const roleConfig: Record<AppRole, { icon: typeof ShoppingBag; label: string; path: string; color: string }> = {
  consumer: {
    icon: ShoppingBag,
    label: "Customer",
    path: "/consumer",
    color: "text-primary",
  },
  vendor: {
    icon: Store,
    label: "Vendor",
    path: "/vendor",
    color: "text-market",
  },
  shopper: {
    icon: Briefcase,
    label: "Shopper",
    path: "/shopper",
    color: "text-gold",
  },
  admin: {
    icon: Shield,
    label: "Admin",
    path: "/admin",
    color: "text-destructive",
  },
};

interface RoleSwitcherProps {
  currentRole?: AppRole;
  compact?: boolean;
}

const RoleSwitcher = ({ currentRole, compact = false }: RoleSwitcherProps) => {
  const navigate = useNavigate();
  const { roles, hasRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Filter to only show roles the user has
  const availableRoles = roles.filter((role) => roleConfig[role]);

  // If user only has one role, don't show the switcher
  if (availableRoles.length <= 1) {
    return null;
  }

  const activeRole = currentRole || availableRoles[0];
  const config = roleConfig[activeRole];
  const Icon = config.icon;

  const handleRoleSwitch = (role: AppRole) => {
    setIsOpen(false);
    navigate(roleConfig[role].path);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size={compact ? "sm" : "default"}
          className="gap-2"
        >
          <Icon className={`w-4 h-4 ${config.color}`} />
          {!compact && <span>{config.label}</span>}
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableRoles.map((role) => {
          const roleInfo = roleConfig[role];
          const RoleIcon = roleInfo.icon;
          const isActive = role === activeRole;
          
          return (
            <DropdownMenuItem
              key={role}
              onClick={() => handleRoleSwitch(role)}
              className="gap-3 cursor-pointer"
            >
              <RoleIcon className={`w-4 h-4 ${roleInfo.color}`} />
              <span className="flex-1">{roleInfo.label}</span>
              {isActive && <Check className="w-4 h-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoleSwitcher;
