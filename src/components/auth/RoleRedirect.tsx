import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Component that redirects authenticated users to their appropriate dashboard
 * based on their roles. Priority: admin > vendor > shopper > consumer
 */
const RoleRedirect = () => {
  const navigate = useNavigate();
  const { user, loading, roles, hasRole } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }

    // Wait for roles to load
    if (roles.length === 0) return;

    // Redirect based on role priority
    if (hasRole("admin")) {
      navigate("/admin", { replace: true });
    } else if (hasRole("vendor")) {
      navigate("/vendor", { replace: true });
    } else if (hasRole("shopper")) {
      navigate("/shopper", { replace: true });
    } else {
      navigate("/consumer", { replace: true });
    }
  }, [user, loading, roles, hasRole, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
};

export default RoleRedirect;
