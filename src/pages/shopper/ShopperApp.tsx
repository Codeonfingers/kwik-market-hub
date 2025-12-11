import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  CheckCircle2,
  Navigation,
  Camera,
  Phone,
  Star,
  Package,
  TrendingUp,
  CircleDollarSign,
  LogOut,
  Loader2,
  Map,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import StatsCard from "@/components/shared/StatsCard";
import OrderTrackingMap from "@/components/tracking/OrderTrackingMap";
import { useAuth } from "@/contexts/AuthContext";
import { useShopperJobs, SafeJobWithOrder } from "@/hooks/useShopperJobs";
import { useMarkets } from "@/hooks/useMarkets";
import { useRealtimeJobNotifications } from "@/hooks/useRealtimeNotifications";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const ShopperApp = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { shopper, availableJobs, myJobs, loading, createShopperProfile, acceptJob, completeJob } = useShopperJobs();
  const { markets } = useMarkets();
  
  const [isAvailable, setIsAvailable] = useState(true);
  const [currentJob, setCurrentJob] = useState<SafeJobWithOrder | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedMarketId, setSelectedMarketId] = useState("");
  const [showMap, setShowMap] = useState(false);
  
  const { permission, requestPermission, isSupported, notifyNewJob } = usePushNotifications();

  // Real-time job notifications with push
  useRealtimeJobNotifications(shopper?.id);

  // Auth is handled by ProtectedRoute wrapper


  useEffect(() => {
    if (!loading && !shopper && user) {
      setShowOnboarding(true);
    }
  }, [loading, shopper, user]);

  useEffect(() => {
    // Find active job
    const activeJob = myJobs.find((j) => j.status !== "completed");
    setCurrentJob(activeJob || null);
  }, [myJobs]);

  const handleCreateShopper = async () => {
    if (!selectedMarketId) {
      toast.error("Please select a market");
      return;
    }

    const { error } = await createShopperProfile(selectedMarketId);
    if (!error) {
      setShowOnboarding(false);
    }
  };

  const handleAcceptJob = async (job: SafeJobWithOrder) => {
    const { error } = await acceptJob(job.id);
    if (!error) {
      setCurrentJob(job);
    }
  };

  const handleCompleteJob = async () => {
    if (!currentJob) return;
    
    const { error } = await completeJob(currentJob.id);
    if (!error) {
      setCurrentJob(null);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const completedJobs = myJobs.filter((j) => j.status === "completed");
  const totalEarnings = completedJobs.reduce((sum, j) => sum + Number(j.commission_amount || 0), 0);

  const stats = [
    { title: "Today's Earnings", value: `₵${totalEarnings.toFixed(0)}`, icon: CircleDollarSign, variant: "gold" as const },
    { title: "Jobs Completed", value: String(completedJobs.length), icon: CheckCircle2, variant: "market" as const },
    { title: "Rating", value: shopper?.rating?.toString() || "0", icon: Star, variant: "primary" as const },
    { title: "Total Deliveries", value: String(shopper?.total_deliveries || 0), icon: Package, variant: "default" as const },
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Onboarding Modal
  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card variant="elevated">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-gold-foreground" />
              </div>
              <CardTitle className="font-display text-2xl">Become a Shopper</CardTitle>
              <p className="text-muted-foreground">Start earning by helping customers get their orders</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Your Market *</Label>
                <select
                  className="w-full h-10 px-3 rounded-md border bg-background"
                  value={selectedMarketId}
                  onChange={(e) => setSelectedMarketId(e.target.value)}
                >
                  <option value="">Choose a market</option>
                  {markets.map((market) => (
                    <option key={market.id} value={market.id}>{market.name}</option>
                  ))}
                </select>
              </div>
              <Button variant="hero" className="w-full" onClick={handleCreateShopper}>
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/">
                <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-gold-foreground" />
                </div>
              </Link>
              <div>
                <h1 className="font-display text-xl font-bold">Shopper App</h1>
                <p className="text-sm text-muted-foreground">Ready to earn!</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isSupported && permission !== "granted" && (
                <Button variant="ghost" size="icon" onClick={requestPermission} title="Enable notifications">
                  <Bell className="w-5 h-5" />
                </Button>
              )}
              <span className={`text-sm font-medium ${isAvailable ? "text-market" : "text-muted-foreground"}`}>
                {isAvailable ? "Available" : "Offline"}
              </span>
              <Switch
                checked={isAvailable}
                onCheckedChange={setIsAvailable}
              />
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Current Job Banner */}
        {currentJob && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="gradient-primary text-primary-foreground border-none">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Badge className="bg-primary-foreground/20 text-primary-foreground mb-2">
                      Active Job
                    </Badge>
                    <h2 className="font-display text-2xl font-bold">
                      Order {currentJob.order?.order_number}
                    </h2>
                    <p className="opacity-80">Items to collect</p>
                  </div>
                  <div className="text-right">
                    <p className="opacity-80 text-sm">Earnings</p>
                    <p className="font-display text-3xl font-bold">₵{Number(currentJob.commission_amount || 0).toFixed(2)}</p>
                  </div>
                </div>

                {/* Job Steps */}
                <div className="space-y-3 mt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-foreground/30 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="flex-1">Accept job</span>
                    <Badge className="bg-primary-foreground/20">Done</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-foreground flex items-center justify-center text-primary">
                      <Package className="w-5 h-5" />
                    </div>
                    <span className="flex-1 font-semibold">Collect from vendors</span>
                  </div>
                  <div className="flex items-center gap-3 opacity-60">
                    <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                      <Navigation className="w-5 h-5" />
                    </div>
                    <span className="flex-1">Hand over to customer</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button 
                    variant="outline"
                    className="flex-1 bg-primary-foreground/20 border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/30"
                    onClick={() => setShowMap(true)}
                  >
                    <Map className="w-4 h-4 mr-2" />
                    View Map
                  </Button>
                  <Button 
                    className="flex-1 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                    onClick={handleCompleteJob}
                  >
                    Mark as Completed
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} index={index} />
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="jobs" className="text-base">Available Jobs</TabsTrigger>
            <TabsTrigger value="history" className="text-base">History</TabsTrigger>
            <TabsTrigger value="earnings" className="text-base">Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            {!isAvailable && (
              <Card className="bg-muted">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    You're currently offline. Go online to see available jobs.
                  </p>
                  <Button variant="hero" onClick={() => setIsAvailable(true)}>
                    Go Online
                  </Button>
                </CardContent>
              </Card>
            )}

            {isAvailable && !currentJob && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-bold">Jobs Near You</h2>
                  <Badge variant="active">{availableJobs.length} available</Badge>
                </div>

                {availableJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="font-display text-xl font-bold mb-2">No jobs available</h3>
                    <p className="text-muted-foreground">Check back soon for new orders!</p>
                  </div>
                ) : (
                  availableJobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card variant="elevated">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">Order {job.order?.order_number}</h3>
                                <Badge variant="secondary">Items to collect</Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>Market delivery</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-display text-2xl font-bold text-market">
                                ₵{Number(job.commission_amount || 0).toFixed(2)}
                              </p>
                              <p className="text-xs text-muted-foreground">Est. earnings</p>
                            </div>
                          </div>
                          <Button 
                            variant="gold" 
                            className="w-full"
                            onClick={() => handleAcceptJob(job)}
                          >
                            Accept Job
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </>
            )}

            {currentJob && (
              <div className="text-center py-8">
                <Package className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Complete your current job to see more available jobs.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <h2 className="font-display text-xl font-bold mb-4">Completed Jobs</h2>
            
            {completedJobs.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold mb-2">No completed jobs yet</h3>
                <p className="text-muted-foreground">Your completed jobs will appear here.</p>
              </div>
            ) : (
              completedJobs.map((job, index) => (
                <Card key={job.id} variant="default">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <p className="font-semibold">Order {job.order?.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(job.delivered_at || job.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-market">₵{Number(job.commission_amount || 0).toFixed(2)}</p>
                      <div className="flex items-center gap-1 text-xs text-gold">
                        <Star className="w-3 h-3 fill-current" />
                        <span>5.0</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Total Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-display font-bold text-primary mb-4">₵{totalEarnings.toFixed(2)}</div>
                <div className="flex items-center gap-2 text-success text-sm mb-6">
                  <TrendingUp className="w-4 h-4" />
                  <span>From {completedJobs.length} completed jobs</span>
                </div>
              </CardContent>
            </Card>

            <Button variant="hero" className="w-full">
              <DollarSign className="w-5 h-5" />
              Request Settlement
            </Button>
          </TabsContent>
        </Tabs>
      </main>

      {/* GPS Map Modal */}
      <Dialog open={showMap} onOpenChange={setShowMap}>
        <DialogContent className="max-w-lg p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Delivery Route</DialogTitle>
          </DialogHeader>
          <OrderTrackingMap
            orderStatus={currentJob?.status || "picked_up"}
            shopperName="You"
            estimatedTime="10-15 mins"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShopperApp;
