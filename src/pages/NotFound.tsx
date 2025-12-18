import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { DEV_MODE_NO_AUTH } from "@/contexts/DevModeContext";

type AppRole = "consumer" | "vendor" | "shopper" | "admin";

const NotFound = () => {
  const navigate = useNavigate();
  const { user, roles, hasRole, loading } = useAuth();

  useEffect(() => {
    // DEV MODE: Always redirect based on selected role
    if (DEV_MODE_NO_AUTH) {
      const timer = setTimeout(() => {
        const devRole = localStorage.getItem("kwikmarket_dev_role") as AppRole || "consumer";
        const roleRoutes: Record<AppRole, string> = {
          admin: "/admin",
          vendor: "/vendor",
          shopper: "/shopper",
          consumer: "/consumer",
        };
        navigate(roleRoutes[devRole], { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }

    // PRODUCTION MODE: If user is authenticated, redirect to their dashboard after a delay
    if (!loading && user && roles.length > 0) {
      const timer = setTimeout(() => {
        if (hasRole("admin")) {
          navigate("/admin", { replace: true });
        } else if (hasRole("vendor")) {
          navigate("/vendor", { replace: true });
        } else if (hasRole("shopper")) {
          navigate("/shopper", { replace: true });
        } else {
          navigate("/consumer", { replace: true });
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, roles, hasRole, loading, navigate]);

  const getDashboardPath = () => {
    if (DEV_MODE_NO_AUTH) {
      const devRole = localStorage.getItem("kwikmarket_dev_role") as AppRole || "consumer";
      const roleRoutes: Record<AppRole, string> = {
        admin: "/admin",
        vendor: "/vendor",
        shopper: "/shopper",
        consumer: "/consumer",
      };
      return roleRoutes[devRole];
    }
    if (hasRole("admin")) return "/admin";
    if (hasRole("vendor")) return "/vendor";
    if (hasRole("shopper")) return "/shopper";
    return "/consumer";
  };

  const showDashboardButton = DEV_MODE_NO_AUTH || user;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="text-center max-w-md w-full">
        <h1 className="mb-4 text-6xl sm:text-8xl font-display font-bold text-primary">404</h1>
        <h2 className="mb-2 text-xl sm:text-2xl font-bold">Page Not Found</h2>
        <p className="mb-6 text-muted-foreground">
          {showDashboardButton 
            ? "This page doesn't exist. Redirecting you to your dashboard..."
            : "The page you're looking for doesn't exist or has been moved."
          }
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate(-1)} className="touch-manipulation">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          {showDashboardButton ? (
            <Button asChild variant="hero" className="touch-manipulation">
              <Link to={getDashboardPath()}>
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Link>
            </Button>
          ) : (
            <Button asChild variant="hero" className="touch-manipulation">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
