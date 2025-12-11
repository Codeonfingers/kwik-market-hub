import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LogOut,
  Bell,
  User,
  ChevronRight,
  Package,
  Home,
  Settings,
  ShoppingCart,
  Store,
  Briefcase,
  LayoutDashboard,
  Users,
  MapPin,
  BarChart3,
  AlertTriangle,
  DollarSign,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import MobileNav from "./MobileNav";
import { cn } from "@/lib/utils";

type AppRole = "consumer" | "vendor" | "shopper" | "admin";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
}

interface DashboardLayoutProps {
  children: ReactNode;
  role: AppRole;
  title: string;
}

const roleConfig: Record<AppRole, { 
  color: string; 
  label: string; 
  navItems: NavItem[];
  basePath: string;
}> = {
  consumer: {
    color: "text-primary",
    label: "Customer",
    basePath: "/customer",
    navItems: [
      { icon: Home, label: "Dashboard", path: "/customer" },
      { icon: MapPin, label: "Markets", path: "/customer/market" },
      { icon: Search, label: "Shop", path: "/customer/shop" },
      { icon: ShoppingCart, label: "My Orders", path: "/customer/orders" },
      { icon: Package, label: "Subscriptions", path: "/customer/subscription" },
      { icon: Settings, label: "Settings", path: "/customer/settings" },
    ],
  },
  vendor: {
    color: "text-secondary",
    label: "Vendor",
    basePath: "/vendor",
    navItems: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/vendor" },
      { icon: ShoppingCart, label: "Orders", path: "/vendor/orders" },
      { icon: Package, label: "Catalog", path: "/vendor/catalog" },
      { icon: DollarSign, label: "Earnings", path: "/vendor/earnings" },
      { icon: BarChart3, label: "Performance", path: "/vendor/performance" },
      { icon: Settings, label: "Settings", path: "/vendor/settings" },
    ],
  },
  shopper: {
    color: "text-earth",
    label: "Shopper",
    basePath: "/shopper",
    navItems: [
      { icon: Home, label: "Dashboard", path: "/shopper" },
      { icon: Briefcase, label: "Available Jobs", path: "/shopper/jobs" },
      { icon: DollarSign, label: "Earnings", path: "/shopper/earnings" },
      { icon: BarChart3, label: "Performance", path: "/shopper/performance" },
      { icon: Settings, label: "Settings", path: "/shopper/settings" },
    ],
  },
  admin: {
    color: "text-destructive",
    label: "Admin",
    basePath: "/admin",
    navItems: [
      { icon: LayoutDashboard, label: "Overview", path: "/admin" },
      { icon: Store, label: "Vendors", path: "/admin/vendors" },
      { icon: Users, label: "Shoppers", path: "/admin/shoppers" },
      { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
      { icon: MapPin, label: "Markets", path: "/admin/markets" },
      { icon: DollarSign, label: "Pricing", path: "/admin/pricing" },
      { icon: AlertTriangle, label: "Disputes", path: "/admin/disputes" },
      { icon: BarChart3, label: "Reports", path: "/admin/reports" },
    ],
  },
};

const DashboardLayout = ({ children, role, title }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const config = roleConfig[role];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Package className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <span className="font-display text-lg font-bold">KwikMarket</span>
            <Badge variant="secondary" className={cn("ml-2 text-xs", config.color)}>
              {config.label}
            </Badge>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {config.navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== config.basePath && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.badge && (
                <Badge variant="destructive" className="ml-auto text-xs">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <User className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{user?.email}</p>
            <p className="text-xs text-muted-foreground capitalize">{role}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2" 
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r hidden lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-card border-b">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <span className="font-display font-bold">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={cn(
        "min-h-screen pb-20 lg:pb-8",
        "lg:ml-64"
      )}>
        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between px-8 h-16 bg-card border-b">
          <h1 className="font-display text-xl font-bold">{title}</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{user?.email}</span>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav role={role} />
    </div>
  );
};

export default DashboardLayout;
