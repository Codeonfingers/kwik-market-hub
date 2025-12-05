import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  ShoppingBasket, 
  Store, 
  Users, 
  MapPin, 
  Shield,
  ChevronRight,
  LogIn,
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home", icon: null },
  { href: "/markets", label: "Markets", icon: MapPin },
  { href: "/consumer", label: "Start Order", icon: ShoppingBasket },
  { href: "/vendor", label: "Vendors", icon: Store },
  { href: "/shopper", label: "Shoppers", icon: Users },
  { href: "/admin", label: "Admin", icon: Shield },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <ShoppingBasket className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl md:text-2xl font-bold">
              <span className="text-primary">Kwik</span>
              <span className="text-secondary">Market</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  location.pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="gap-2">
                <LogIn className="w-4 h-4" />
                Login
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="default" size="sm" className="gap-2">
                <UserPlus className="w-4 h-4" />
                Register
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-t border-border overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center justify-between py-3 px-4 rounded-xl text-base font-medium transition-all",
                    location.pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <span className="flex items-center gap-3">
                    {link.icon && <link.icon className="w-5 h-5" />}
                    {link.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              ))}
              
              <div className="pt-4 mt-2 border-t border-border flex flex-col gap-2">
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full justify-center gap-2 h-12 text-base">
                    <LogIn className="w-5 h-5" />
                    Login
                  </Button>
                </Link>
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button variant="default" className="w-full justify-center gap-2 h-12 text-base">
                    <UserPlus className="w-5 h-5" />
                    Register
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;