import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, Store, Briefcase, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDevMode, DEV_MODE_NO_AUTH } from "@/contexts/DevModeContext";
import { useDevSettings } from "@/contexts/DevSettingsContext";

type AppRole = "consumer" | "vendor" | "shopper" | "admin";

const roleConfig: Record<AppRole, { icon: typeof ShoppingBag; label: string; path: string; color: string }> = {
  consumer: {
    icon: ShoppingBag,
    label: "Consumer",
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

const DevRoleSwitcher = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentRole, setCurrentRole, demoUser } = useDevMode();
  const { useMockData, mockApiDelay, simulateErrors } = useDevSettings();

  // Don't show if dev mode is disabled
  if (!DEV_MODE_NO_AUTH) return null;

  const handleRoleChange = (role: AppRole) => {
    setCurrentRole(role);
    navigate(roleConfig[role].path);
  };

  const config = roleConfig[currentRole];
  const Icon = config.icon;

  // Don't show on auth page or landing
  const isLandingOrAuth = location.pathname === "/" || location.pathname.startsWith("/auth");

  return (
    <>
      {/* Dev Mode Banner */}
      <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-amber-950 text-center py-1 px-4 text-xs font-semibold flex items-center justify-center gap-2 flex-wrap">
        <AlertTriangle className="w-3 h-3" />
        <span>DEV MODE — AUTH DISABLED — {demoUser.name}</span>
        <span className="hidden sm:inline">|</span>
        <span className="text-amber-800">
          Mock: {useMockData ? "ON" : "OFF"} | Delay: {mockApiDelay}ms {simulateErrors && "| Errors: ON"}
        </span>
        <AlertTriangle className="w-3 h-3" />
      </div>

      {/* Floating Role Switcher */}
      {!isLandingOrAuth && (
        <div className="fixed top-10 right-4 z-[99] bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${config.color}`} />
            <span className="text-xs font-medium text-muted-foreground">Role:</span>
          </div>
          
          <Select value={currentRole} onValueChange={(value) => handleRoleChange(value as AppRole)}>
            <SelectTrigger className="w-[130px] h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(roleConfig) as AppRole[]).map((role) => {
                const RoleIcon = roleConfig[role].icon;
                return (
                  <SelectItem key={role} value={role}>
                    <div className="flex items-center gap-2">
                      <RoleIcon className={`w-3 h-3 ${roleConfig[role].color}`} />
                      {roleConfig[role].label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
};

export default DevRoleSwitcher;
