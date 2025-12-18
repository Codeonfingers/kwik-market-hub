import { useDevSettings, simulateDelay, shouldSimulateError } from "@/contexts/DevSettingsContext";
import { DEV_MODE_NO_AUTH } from "@/contexts/DevModeContext";
import { toast } from "sonner";
import {
  mockConsumerOrders,
  mockVendor,
  mockVendorProducts,
  mockVendorOrders,
  mockShopper,
  mockAvailableJobs,
  mockActiveJobs,
  mockCompletedJobs,
  mockAdminStats,
  mockAdminOrders,
  mockAdminUsers,
  mockDisputes,
} from "@/lib/mock-dashboard-data";
import { markets, categories } from "@/lib/mock-data";

// Type for mock API wrapper
type MockApiResult<T> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
};

export const useMockDataEnabled = () => {
  const { useMockData, isDevMode } = useDevSettings();
  return isDevMode && useMockData;
};

// Hook to wrap API calls with dev settings (delay, error simulation)
export const useDevApiWrapper = () => {
  const { mockApiDelay, simulateErrors, errorType } = useDevSettings();

  const wrapApiCall = async <T>(
    realApiCall: () => Promise<T>,
    mockData: T
  ): Promise<T> => {
    const shouldUseMock = useMockDataEnabled();
    
    // Simulate delay
    await simulateDelay(mockApiDelay);
    
    // Simulate errors
    const { shouldError, errorType: errorTypeToThrow } = shouldSimulateError(
      simulateErrors,
      errorType
    );
    
    if (shouldError && errorTypeToThrow) {
      const errorMessages: Record<string, string> = {
        "401": "Unauthorized - Please log in",
        "403": "Forbidden - You don't have permission",
        "404": "Not Found - Resource doesn't exist",
        "500": "Server Error - Please try again",
      };
      toast.error(`Simulated ${errorTypeToThrow}: ${errorMessages[errorTypeToThrow]}`);
      throw new Error(errorMessages[errorTypeToThrow]);
    }
    
    if (shouldUseMock) {
      return mockData;
    }
    
    return realApiCall();
  };

  return { wrapApiCall };
};

// Consumer Dashboard Mock Data
export const useMockConsumerData = () => {
  const isMockEnabled = useMockDataEnabled();
  
  if (!isMockEnabled) return null;

  return {
    orders: mockConsumerOrders,
    markets,
    categories,
    pendingOrders: mockConsumerOrders.filter(o => ["pending", "accepted", "preparing"].includes(o.status)),
    activeOrders: mockConsumerOrders.filter(o => ["ready", "picked_up", "inspecting"].includes(o.status)),
    completedOrders: mockConsumerOrders.filter(o => o.status === "completed"),
  };
};

// Vendor Dashboard Mock Data
export const useMockVendorData = () => {
  const isMockEnabled = useMockDataEnabled();
  
  if (!isMockEnabled) return null;

  const vendorOrders = mockVendorOrders;
  const pendingOrders = vendorOrders.filter(o => o.status === "pending");
  const todayOrders = vendorOrders.filter(o => {
    const today = new Date().toDateString();
    return new Date(o.created_at).toDateString() === today;
  });
  const completedOrders = vendorOrders.filter(o => o.status === "completed");
  const totalEarnings = completedOrders.reduce((sum, o) => sum + Number(o.subtotal || 0), 0);

  return {
    vendor: mockVendor,
    products: mockVendorProducts,
    orders: vendorOrders,
    categories,
    markets,
    pendingOrders,
    todayOrders,
    completedOrders,
    totalEarnings,
  };
};

// Shopper Dashboard Mock Data
export const useMockShopperData = () => {
  const isMockEnabled = useMockDataEnabled();
  
  if (!isMockEnabled) return null;

  const activeJobs = mockActiveJobs;
  const completedJobs = mockCompletedJobs;
  const totalEarnings = completedJobs.reduce((sum, j) => sum + Number(j.commission_amount || 0), 0);

  return {
    shopper: mockShopper,
    availableJobs: mockAvailableJobs,
    activeJobs,
    completedJobs,
    markets,
    totalEarnings,
    todayEarnings: completedJobs
      .filter(j => {
        const today = new Date().toDateString();
        return new Date(j.delivered_at || "").toDateString() === today;
      })
      .reduce((sum, j) => sum + Number(j.commission_amount || 0), 0),
    todayCompleted: completedJobs.filter(j => {
      const today = new Date().toDateString();
      return new Date(j.delivered_at || "").toDateString() === today;
    }).length,
  };
};

// Admin Dashboard Mock Data
export const useMockAdminData = () => {
  const isMockEnabled = useMockDataEnabled();
  
  if (!isMockEnabled) return null;

  return {
    stats: mockAdminStats,
    orders: mockAdminOrders,
    users: mockAdminUsers,
    disputes: mockDisputes,
    markets,
    vendors: mockAdminUsers.filter(u => u.role === "vendor").map(u => ({
      id: u.id,
      user_id: u.id,
      business_name: u.full_name + "'s Shop",
      market_id: markets[0].id,
      is_verified: u.is_verified,
      is_active: true,
      rating: 4.5,
      total_orders: Math.floor(Math.random() * 100),
    })),
    shoppers: mockAdminUsers.filter(u => u.role === "shopper").map(u => ({
      id: u.id,
      user_id: u.id,
      market_id: markets[0].id,
      is_verified: u.is_verified,
      is_available: true,
      rating: 4.7,
      total_deliveries: Math.floor(Math.random() * 50),
    })),
    pendingVendors: mockAdminUsers.filter(u => u.role === "vendor" && !u.is_verified),
    pendingShoppers: mockAdminUsers.filter(u => u.role === "shopper" && !u.is_verified),
    activeOrders: mockAdminOrders.filter(o => !["completed", "cancelled"].includes(o.status)),
    totalRevenue: mockAdminOrders
      .filter(o => o.status === "completed")
      .reduce((sum, o) => sum + Number(o.total || 0), 0),
  };
};

export default useMockDataEnabled;
