import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Feature flag - set to false to restore normal auth
export const DEV_MODE_NO_AUTH = true;

type AppRole = "consumer" | "vendor" | "shopper" | "admin";

interface DevModeContextType {
  isDevMode: boolean;
  currentRole: AppRole;
  setCurrentRole: (role: AppRole) => void;
  demoUser: DemoUser;
}

interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: AppRole;
}

const demoUsers: Record<AppRole, DemoUser> = {
  consumer: {
    id: "demo-consumer-001",
    email: "demo.consumer@kwikmarket.dev",
    name: "Demo Customer",
    role: "consumer",
  },
  vendor: {
    id: "demo-vendor-001",
    email: "demo.vendor@kwikmarket.dev",
    name: "Demo Vendor",
    role: "vendor",
  },
  shopper: {
    id: "demo-shopper-001",
    email: "demo.shopper@kwikmarket.dev",
    name: "Demo Shopper",
    role: "shopper",
  },
  admin: {
    id: "demo-admin-001",
    email: "demo.admin@kwikmarket.dev",
    name: "Demo Admin",
    role: "admin",
  },
};

const STORAGE_KEY = "kwikmarket_dev_role";

const DevModeContext = createContext<DevModeContextType | undefined>(undefined);

export const DevModeProvider = ({ children }: { children: ReactNode }) => {
  const [currentRole, setCurrentRoleState] = useState<AppRole>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && ["consumer", "vendor", "shopper", "admin"].includes(stored)) {
        return stored as AppRole;
      }
    }
    return "consumer";
  });

  const setCurrentRole = (role: AppRole) => {
    setCurrentRoleState(role);
    localStorage.setItem(STORAGE_KEY, role);
  };

  const demoUser = demoUsers[currentRole];

  return (
    <DevModeContext.Provider
      value={{
        isDevMode: DEV_MODE_NO_AUTH,
        currentRole,
        setCurrentRole,
        demoUser,
      }}
    >
      {children}
    </DevModeContext.Provider>
  );
};

export const useDevMode = () => {
  const context = useContext(DevModeContext);
  if (!context) {
    throw new Error("useDevMode must be used within a DevModeProvider");
  }
  return context;
};

export const getDemoUserForRole = (role: AppRole): DemoUser => demoUsers[role];
