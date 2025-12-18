import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DEV_MODE_NO_AUTH } from "@/contexts/DevModeContext";

type AppRole = "consumer" | "vendor" | "shopper" | "admin";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: AppRole;
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  redirectTo = "/auth" 
}: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { user, loading, roles, hasRole } = useAuth();

  useEffect(() => {
    // DEV MODE: Skip all auth checks
    if (DEV_MODE_NO_AUTH) {
      // In dev mode, if a role is required but user doesn't have it,
      // redirect to the correct dashboard based on their dev role
      if (requiredRole && !hasRole(requiredRole)) {
        const devRole = localStorage.getItem("kwikmarket_dev_role") as AppRole || "consumer";
        const roleRoutes: Record<AppRole, string> = {
          admin: "/admin",
          vendor: "/vendor",
          shopper: "/shopper",
          consumer: "/consumer",
        };
        navigate(roleRoutes[devRole], { replace: true });
      }
      return;
    }

    // PRODUCTION MODE: Normal auth checks
    if (loading) return;

    if (!user) {
      navigate(redirectTo, { replace: true });
      return;
    }

    if (requiredRole && !hasRole(requiredRole)) {
      if (hasRole("admin")) {
        navigate("/admin", { replace: true });
      } else if (hasRole("vendor")) {
        navigate("/vendor", { replace: true });
      } else if (hasRole("shopper")) {
        navigate("/shopper", { replace: true });
      } else {
        navigate("/consumer", { replace: true });
      }
    }
  }, [user, loading, roles, requiredRole, hasRole, navigate, redirectTo]);

  // DEV MODE: Always render children (with role check for redirect)
  if (DEV_MODE_NO_AUTH) {
    if (requiredRole && !hasRole(requiredRole)) {
      return null;
    }
    return <>{children}</>;
  }

  // PRODUCTION MODE: Show loading and auth checks
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
