import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import RoleRedirect from "@/components/auth/RoleRedirect";
import Index from "./pages/Index";
import Markets from "./pages/Markets";
import HowItWorks from "./pages/HowItWorks";
import Auth from "./pages/Auth";
import ProfileSettings from "./pages/ProfileSettings";
import ConsumerApp from "./pages/consumer/ConsumerApp";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import ShopperApp from "./pages/shopper/ShopperApp";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/markets" element={<Markets />} />
            <Route path="/markets/:id" element={<Markets />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Smart redirect for authenticated users */}
            <Route path="/dashboard" element={<RoleRedirect />} />
            
            {/* Profile settings - any authenticated user */}
            <Route path="/profile" element={<ProfileSettings />} />
            
            {/* Consumer routes - default role, any authenticated user can access */}
            <Route path="/consumer" element={
              <ProtectedRoute requiredRole="consumer">
                <ConsumerApp />
              </ProtectedRoute>
            } />
            <Route path="/consumer/*" element={
              <ProtectedRoute requiredRole="consumer">
                <ConsumerApp />
              </ProtectedRoute>
            } />
            
            {/* Vendor routes - requires vendor role */}
            <Route path="/vendor" element={
              <ProtectedRoute requiredRole="vendor">
                <VendorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/vendor/*" element={
              <ProtectedRoute requiredRole="vendor">
                <VendorDashboard />
              </ProtectedRoute>
            } />
            
            {/* Shopper routes - requires shopper role */}
            <Route path="/shopper" element={
              <ProtectedRoute requiredRole="shopper">
                <ShopperApp />
              </ProtectedRoute>
            } />
            <Route path="/shopper/*" element={
              <ProtectedRoute requiredRole="shopper">
                <ShopperApp />
              </ProtectedRoute>
            } />
            
            {/* Admin routes - requires admin role */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/*" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
