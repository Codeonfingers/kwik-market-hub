import { useState } from "react";
import { Settings, X, Database, Clock, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDevSettings } from "@/contexts/DevSettingsContext";
import { DEV_MODE_NO_AUTH } from "@/contexts/DevModeContext";
import { cn } from "@/lib/utils";

const DevSettingsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const {
    useMockData,
    setUseMockData,
    mockApiDelay,
    setMockApiDelay,
    simulateErrors,
    setSimulateErrors,
    errorType,
    setErrorType,
  } = useDevSettings();

  // Don't show if dev mode is disabled
  if (!DEV_MODE_NO_AUTH) return null;

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-[98] w-12 h-12 rounded-full shadow-lg bg-muted hover:bg-muted/80 border border-border"
        size="icon"
        variant="ghost"
      >
        <Settings className="w-5 h-5 text-foreground" />
      </Button>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-[98] bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-xl transition-all duration-200",
        isMinimized ? "w-64" : "w-80"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">🛠️ Developer Settings</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="p-4 space-y-5">
          {/* Mock Data Toggle */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Mock Data</Label>
            </div>
            <div className="flex items-center justify-between pl-6">
              <span className="text-xs text-muted-foreground">
                {useMockData ? "Using demo data" : "Using real API"}
              </span>
              <Switch checked={useMockData} onCheckedChange={setUseMockData} />
            </div>
          </div>

          {/* API Delay */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm font-medium">API Delay</Label>
            </div>
            <div className="pl-6">
              <Select
                value={mockApiDelay.toString()}
                onValueChange={(value) => setMockApiDelay(parseInt(value))}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None (0ms)</SelectItem>
                  <SelectItem value="300">Fast (300ms)</SelectItem>
                  <SelectItem value="800">Medium (800ms)</SelectItem>
                  <SelectItem value="1500">Slow (1500ms)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Error Simulation */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Error Simulation</Label>
            </div>
            <div className="flex items-center justify-between pl-6">
              <span className="text-xs text-muted-foreground">
                {simulateErrors ? "30% error chance" : "Disabled"}
              </span>
              <Switch checked={simulateErrors} onCheckedChange={setSimulateErrors} />
            </div>
            {simulateErrors && (
              <div className="pl-6">
                <Select
                  value={errorType || "500"}
                  onValueChange={(value) =>
                    setErrorType(value as "401" | "403" | "404" | "500")
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Error type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="401">401 Unauthorized</SelectItem>
                    <SelectItem value="403">403 Forbidden</SelectItem>
                    <SelectItem value="404">404 Not Found</SelectItem>
                    <SelectItem value="500">500 Server Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Status Display */}
          <div className="p-3 bg-muted/50 rounded-lg space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mock Data:</span>
              <span className={useMockData ? "text-primary font-medium" : "text-muted-foreground"}>
                {useMockData ? "ON" : "OFF"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">API Delay:</span>
              <span className="font-medium">{mockApiDelay}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Error Sim:</span>
              <span className={simulateErrors ? "text-destructive font-medium" : "text-muted-foreground"}>
                {simulateErrors ? `ON (${errorType})` : "OFF"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Minimized Status Bar */}
      {isMinimized && (
        <div className="p-2 flex items-center justify-around text-xs">
          <span className={useMockData ? "text-primary" : "text-muted-foreground"}>
            Mock: {useMockData ? "ON" : "OFF"}
          </span>
          <span className="text-muted-foreground">|</span>
          <span>{mockApiDelay}ms</span>
          <span className="text-muted-foreground">|</span>
          <span className={simulateErrors ? "text-destructive" : "text-muted-foreground"}>
            Err: {simulateErrors ? "ON" : "OFF"}
          </span>
        </div>
      )}
    </div>
  );
};

export default DevSettingsPanel;
