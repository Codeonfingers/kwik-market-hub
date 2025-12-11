import { Link, useLocation } from "react-router-dom";
import { Home, Search, ShoppingCart, User, Package, Store, Briefcase, Settings, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

type AppRole = "consumer" | "vendor" | "shopper" | "admin";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const roleNavItems: Record<AppRole, NavItem[]> = {
  consumer: [
    { icon: Home, label: "Home", path: "/customer" },
    { icon: Search, label: "Shop", path: "/customer/shop" },
    { icon: ShoppingCart, label: "Orders", path: "/customer/orders" },
    { icon: User, label: "Account", path: "/customer/settings" },
  ],
  vendor: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/vendor" },
    { icon: Package, label: "Products", path: "/vendor/catalog" },
    { icon: ShoppingCart, label: "Orders", path: "/vendor/orders" },
    { icon: Settings, label: "Settings", path: "/vendor/settings" },
  ],
  shopper: [
    { icon: Home, label: "Dashboard", path: "/shopper" },
    { icon: Briefcase, label: "Jobs", path: "/shopper/jobs" },
    { icon: Package, label: "Earnings", path: "/shopper/earnings" },
    { icon: User, label: "Profile", path: "/shopper/settings" },
  ],
  admin: [
    { icon: LayoutDashboard, label: "Overview", path: "/admin" },
    { icon: Store, label: "Vendors", path: "/admin/vendors" },
    { icon: User, label: "Shoppers", path: "/admin/shoppers" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ],
};

interface MobileNavProps {
  role: AppRole;
}

const MobileNav = ({ role }: MobileNavProps) => {
  const location = useLocation();
  const navItems = roleNavItems[role] || roleNavItems.consumer;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== "/" && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform",
                isActive && "scale-110"
              )} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 w-12 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
