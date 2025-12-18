import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  DollarSign, 
  Star, 
  MapPin,
  Clock,
  CheckCircle2,
  Navigation,
  Camera,
  Package,
  Phone,
  Loader2,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardCard from "@/components/shared/DashboardCard";
import StatusBadge from "@/components/shared/StatusBadge";
import OrderTrackingMap from "@/components/tracking/OrderTrackingMap";
import { useAuth } from "@/contexts/AuthContext";
import { useShopperJobs } from "@/hooks/useShopperJobs";
import { useMarkets } from "@/hooks/useMarkets";
import { useRealtimeJobNotifications } from "@/hooks/useRealtimeNotifications";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";

// Map routes to tabs
const routeToTab: Record<string, string> = {
  "/shopper": "overview",
  "/shopper/jobs": "jobs",
  "/shopper/earnings": "history",
  "/shopper/performance": "overview",
  "/shopper/settings": "overview",
};

const ShopperDashboardNew = () => {
  const { user, addRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { availableJobs, myJobs, acceptJob, completeJob, loading } = useShopperJobs();
  const { markets } = useMarkets();
  
  // Sync tab with URL
  const getTabFromPath = () => routeToTab[location.pathname] || "overview";
  const [activeTab, setActiveTab] = useState(getTabFromPath);
  
  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const routes: Record<string, string> = {
      overview: "/shopper",
      jobs: "/shopper/jobs",
      history: "/shopper/earnings",
    };
    if (routes[tab]) navigate(routes[tab]);
  };
  
  const [shopper, setShopper] = useState<any>(null);
  const [shopperLoading, setShopperLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [currentJob, setCurrentJob] = useState<any>(null);
  const [mapDialog, setMapDialog] = useState(false);
  const [onboardingModal, setOnboardingModal] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState("");

  useRealtimeJobNotifications(shopper?.id);

  // Fetch shopper profile
  useEffect(() => {
    const fetchShopper = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("shoppers")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setShopper(data);
        setIsAvailable(data.is_available ?? true);
      } else {
        setOnboardingModal(true);
      }
      setShopperLoading(false);
    };

    fetchShopper();
  }, [user]);

  const handleCreateShopper = async () => {
    if (!user || !selectedMarket) return;

    const { data, error } = await supabase
      .from("shoppers")
      .insert({
        user_id: user.id,
        market_id: selectedMarket,
        is_available: true,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to create shopper profile");
      return;
    }

    await addRole("shopper");
    setShopper(data);
    setOnboardingModal(false);
    toast.success("Shopper profile created!");
  };

  const handleAvailabilityToggle = async (available: boolean) => {
    if (!shopper) return;
    setIsAvailable(available);
    
    await supabase
      .from("shoppers")
      .update({ is_available: available })
      .eq("id", shopper.id);
    
    toast.success(available ? "You're now available for jobs" : "You're now offline");
  };

  const handleAcceptJob = async (job: any) => {
    if (!shopper) return;
    await acceptJob(job.id);
    setCurrentJob(job);
    toast.success("Job accepted!");
  };

  const handleCompleteJob = async (jobId: string) => {
    await completeJob(jobId);
    setCurrentJob(null);
    toast.success("Job completed!");
  };

  if (shopperLoading) {
    return (
      <DashboardLayout role="shopper" title="Shopper Dashboard">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const jobs = availableJobs;
  const activeJobs = myJobs.filter(j => ["accepted", "in_progress"].includes(j.status));
  const completedJobs = myJobs.filter(j => j.status === "delivered" || j.status === "completed");
  const totalEarnings = completedJobs.reduce((sum, j) => sum + Number(j.commission_amount || 0), 0);

  return (
    <DashboardLayout role="shopper" title="Shopper Dashboard">
      {/* Onboarding Modal */}
      <Dialog open={onboardingModal} onOpenChange={setOnboardingModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Become a KwikMarket Shopper</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-muted-foreground">
              As a shopper, you'll help customers by picking up their orders from market vendors and earning commissions.
            </p>
            <div className="space-y-2">
              <Label>Select Your Market</Label>
              <Select value={selectedMarket} onValueChange={setSelectedMarket}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a market" />
                </SelectTrigger>
                <SelectContent>
                  {markets.map((market) => (
                    <SelectItem key={market.id} value={market.id}>
                      {market.name} - {market.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleCreateShopper} disabled={!selectedMarket}>
              Start as Shopper
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        {/* Availability Toggle */}
        <Card className={isAvailable ? "bg-success/5 border-success/30" : "bg-muted"}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isAvailable ? "bg-success animate-pulse" : "bg-muted-foreground"}`} />
              <div>
                <p className="font-bold">{isAvailable ? "You're Online" : "You're Offline"}</p>
                <p className="text-sm text-muted-foreground">
                  {isAvailable ? "Ready to accept jobs" : "Toggle to go online"}
                </p>
              </div>
            </div>
            <Switch checked={isAvailable} onCheckedChange={handleAvailabilityToggle} />
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Available Jobs"
            value={availableJobs.length}
            icon={Briefcase}
            variant={availableJobs.length > 0 ? "secondary" : "default"}
          />
          <DashboardCard
            title="Active Jobs"
            value={activeJobs.length}
            icon={Package}
            variant="primary"
          />
          <DashboardCard
            title="Total Earnings"
            value={`₵${totalEarnings.toFixed(2)}`}
            icon={DollarSign}
            variant="success"
          />
          <DashboardCard
            title="Rating"
            value={shopper?.rating?.toFixed(1) || "0.0"}
            icon={Star}
            variant="gold"
          />
        </div>

        {/* Active Job Banner */}
        {currentJob && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-primary/5 border-primary/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Badge className="mb-2">Active Job</Badge>
                    <p className="font-bold text-lg">Order #{currentJob.order?.order_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {currentJob.order?.items?.length || 0} items to pick up
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Commission</p>
                    <p className="font-display text-2xl font-bold text-primary">
                      ₵{Number(currentJob.commission_amount || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setMapDialog(true)}>
                    <Navigation className="w-4 h-4 mr-2" /> View Route
                  </Button>
                  <Button className="flex-1" onClick={() => handleCompleteJob(currentJob.id)}>
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Complete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">
              Jobs {availableJobs.length > 0 && <Badge variant="destructive" className="ml-2">{availableJobs.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Today's Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Today's Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <span className="text-muted-foreground">Jobs Completed</span>
                    <span className="font-bold">{completedJobs.filter(j => {
                      const today = new Date().toDateString();
                      return new Date(j.delivered_at || "").toDateString() === today;
                    }).length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <span className="text-muted-foreground">Earnings Today</span>
                    <span className="font-bold text-success">₵{completedJobs.filter(j => {
                      const today = new Date().toDateString();
                      return new Date(j.delivered_at || "").toDateString() === today;
                    }).reduce((sum, j) => sum + Number(j.commission_amount || 0), 0).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <span className="text-muted-foreground">Total Deliveries</span>
                    <span className="font-bold">{shopper?.total_deliveries || 0}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab("jobs")}>
                    <Briefcase className="w-6 h-6 mb-2" />
                    View Jobs
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" onClick={() => setMapDialog(true)}>
                    <MapPin className="w-6 h-6 mb-2" />
                    Market Map
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-4 mt-6">
            <h2 className="font-display text-xl font-bold">Available Jobs</h2>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : availableJobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold mb-2">No jobs available</h3>
                <p className="text-muted-foreground">New jobs will appear here when customers place orders</p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableJobs.map((job) => (
                  <Card key={job.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-bold">Order #{job.order?.order_number}</p>
                          <p className="text-sm text-muted-foreground">
                            Pickup order
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Earn</p>
                          <p className="font-display text-xl font-bold text-success">
                            ₵{Number(job.commission_amount || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="p-3 bg-muted/50 rounded-lg mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{markets.find(m => m.id === job.order?.market_id)?.name || "Market"}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1" onClick={() => setMapDialog(true)}>
                          <Navigation className="w-4 h-4 mr-1" /> Route
                        </Button>
                        <Button className="flex-1" onClick={() => handleAcceptJob(job)}>
                          Accept Job
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4 mt-6">
            <h2 className="font-display text-xl font-bold">Completed Jobs</h2>
            
            {completedJobs.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold mb-2">No completed jobs yet</h3>
                <p className="text-muted-foreground">Your completed jobs will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedJobs.map((job) => (
                  <Card key={job.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold">Order #{job.order?.order_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {job.delivered_at ? new Date(job.delivered_at).toLocaleDateString() : "Completed"}
                          </p>
                        </div>
                        <div className="text-right">
                          <StatusBadge status="completed" />
                          <p className="font-display text-lg font-bold text-success mt-1">
                            +₵{Number(job.commission_amount || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Map Dialog */}
        <Dialog open={mapDialog} onOpenChange={setMapDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Delivery Route</DialogTitle>
            </DialogHeader>
            <div className="h-80">
              <OrderTrackingMap
                shopperLocation={{ lat: 5.6037, lng: -0.1870, label: "Your Location" }}
                marketLocation={{ lat: 5.5500, lng: -0.2000, label: "Market" }}
                customerLocation={{ lat: 5.6200, lng: -0.1750, label: "Customer" }}
                orderStatus="picked_up"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ShopperDashboardNew;
