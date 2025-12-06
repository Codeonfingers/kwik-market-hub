import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  ShoppingBag,
  Store,
  Briefcase,
  Shield,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

type AppRole = "consumer" | "vendor" | "shopper" | "admin";

const roleConfig: Record<AppRole, { icon: typeof ShoppingBag; label: string; path: string; color: string }> = {
  consumer: { icon: ShoppingBag, label: "Customer", path: "/consumer", color: "text-primary" },
  vendor: { icon: Store, label: "Vendor", path: "/vendor", color: "text-market" },
  shopper: { icon: Briefcase, label: "Shopper", path: "/shopper", color: "text-gold" },
  admin: { icon: Shield, label: "Admin", path: "/admin", color: "text-destructive" },
};

interface UserMenuProps {
  compact?: boolean;
}

const UserMenu = ({ compact = false }: UserMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, roles, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/auth">
          <Button variant="ghost" size={compact ? "sm" : "default"}>
            Login
          </Button>
        </Link>
        <Link to="/auth">
          <Button variant="default" size={compact ? "sm" : "default"}>
            Register
          </Button>
        </Link>
      </div>
    );
  }

  // Get user initials from email
  const initials = user.email?.slice(0, 2).toUpperCase() || "U";
  
  // Determine current role from path
  const getCurrentRole = (): AppRole => {
    if (location.pathname.startsWith("/admin")) return "admin";
    if (location.pathname.startsWith("/vendor")) return "vendor";
    if (location.pathname.startsWith("/shopper")) return "shopper";
    return "consumer";
  };
  
  const currentRole = getCurrentRole();
  const currentRoleConfig = roleConfig[currentRole];
  const CurrentIcon = currentRoleConfig.icon;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleRoleSwitch = (role: AppRole) => {
    setIsOpen(false);
    navigate(roleConfig[role].path);
  };

  const availableRoles = roles.filter((role): role is AppRole => role in roleConfig);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 px-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="" />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          {!compact && (
            <>
              <div className="hidden sm:flex items-center gap-1.5">
                <CurrentIcon className={`w-3.5 h-3.5 ${currentRoleConfig.color}`} />
                <span className="text-sm">{currentRoleConfig.label}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-medium">{user.email}</span>
            <span className="text-xs text-muted-foreground">
              {roles.length} role{roles.length !== 1 ? "s" : ""}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Role Switcher */}
        {availableRoles.length > 1 && (
          <>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Switch Role
              </DropdownMenuLabel>
              {availableRoles.map((role) => {
                const config = roleConfig[role];
                const Icon = config.icon;
                const isActive = role === currentRole;
                
                return (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => handleRoleSwitch(role)}
                    className="gap-3 cursor-pointer"
                  >
                    <Icon className={`w-4 h-4 ${config.color}`} />
                    <span className="flex-1">{config.label}</span>
                    {isActive && <Check className="w-4 h-4 text-primary" />}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuItem asChild>
          <Link to="/profile" className="gap-3 cursor-pointer">
            <Settings className="w-4 h-4" />
            Profile Settings
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleSignOut} className="gap-3 cursor-pointer text-destructive">
          <LogOut className="w-4 h-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
