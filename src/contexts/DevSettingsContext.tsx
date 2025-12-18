import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { DEV_MODE_NO_AUTH } from "./DevModeContext";

interface DevSettings {
  useMockData: boolean;
  mockApiDelay: number;
  simulateErrors: boolean;
  errorType: "401" | "403" | "404" | "500" | null;
}

interface DevSettingsContextType extends DevSettings {
  setUseMockData: (value: boolean) => void;
  setMockApiDelay: (value: number) => void;
  setSimulateErrors: (value: boolean) => void;
  setErrorType: (type: "401" | "403" | "404" | "500" | null) => void;
  isDevMode: boolean;
}

const STORAGE_KEY = "kwikmarket_dev_settings";

const defaultSettings: DevSettings = {
  useMockData: true,
  mockApiDelay: 0,
  simulateErrors: false,
  errorType: null,
};

const DevSettingsContext = createContext<DevSettingsContextType | undefined>(undefined);

export const DevSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<DevSettings>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return { ...defaultSettings, ...JSON.parse(stored) };
        } catch {
          return defaultSettings;
        }
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const setUseMockData = (value: boolean) => setSettings((s) => ({ ...s, useMockData: value }));
  const setMockApiDelay = (value: number) => setSettings((s) => ({ ...s, mockApiDelay: value }));
  const setSimulateErrors = (value: boolean) => setSettings((s) => ({ ...s, simulateErrors: value }));
  const setErrorType = (type: "401" | "403" | "404" | "500" | null) =>
    setSettings((s) => ({ ...s, errorType: type }));

  return (
    <DevSettingsContext.Provider
      value={{
        ...settings,
        setUseMockData,
        setMockApiDelay,
        setSimulateErrors,
        setErrorType,
        isDevMode: DEV_MODE_NO_AUTH,
      }}
    >
      {children}
    </DevSettingsContext.Provider>
  );
};

export const useDevSettings = () => {
  const context = useContext(DevSettingsContext);
  if (!context) {
    throw new Error("useDevSettings must be used within a DevSettingsProvider");
  }
  return context;
};

// Helper function to simulate API delay
export const simulateDelay = async (delay: number) => {
  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
};

// Helper function to simulate errors
export const shouldSimulateError = (
  simulateErrors: boolean,
  errorType: "401" | "403" | "404" | "500" | null
): { shouldError: boolean; errorType: string | null } => {
  if (!simulateErrors || !errorType) {
    return { shouldError: false, errorType: null };
  }
  // 30% chance of error when simulation is enabled
  const shouldError = Math.random() < 0.3;
  return { shouldError, errorType: shouldError ? errorType : null };
};
