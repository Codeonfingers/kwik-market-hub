import { useState } from "react";
import { motion } from "framer-motion";
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
  CircleDollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsCard from "@/components/shared/StatsCard";
import { availableJobs, markets } from "@/lib/mock-data";
import { Job } from "@/types";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const ShopperApp = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);

  const stats = [
    { title: "Today's Earnings", value: "₵125", icon: CircleDollarSign, variant: "gold" as const },
    { title: "Jobs Completed", value: "8", icon: CheckCircle2, variant: "market" as const },
    { title: "Rating", value: "4.9", icon: Star, variant: "primary" as const },
    { title: "Active Time", value: "5h 30m", icon: Clock, variant: "default" as const },
  ];

  const handleAcceptJob = (job: Job) => {
    setCurrentJob(job);
    toast.success(`Accepted job for ${job.consumerName}`);
  };

  const handleCompleteStep = (step: string) => {
    toast.success(`${step} completed!`);
  };

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
                <p className="text-sm text-muted-foreground">Kwame Asante</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${isAvailable ? "text-market" : "text-muted-foreground"}`}>
                {isAvailable ? "Available" : "Offline"}
              </span>
              <Switch
                checked={isAvailable}
                onCheckedChange={setIsAvailable}
              />
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
                      Order for {currentJob.consumerName}
                    </h2>
                    <p className="opacity-80">{currentJob.itemCount} items from {currentJob.vendorCount} vendors</p>
                  </div>
                  <div className="text-right">
                    <p className="opacity-80 text-sm">Earnings</p>
                    <p className="font-display text-3xl font-bold">₵{currentJob.estimatedEarnings}</p>
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
                    <Button 
                      size="sm" 
                      className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                      onClick={() => handleCompleteStep("Collection")}
                    >
                      Mark Done
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 opacity-60">
                    <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                      <Camera className="w-5 h-5" />
                    </div>
                    <span className="flex-1">Upload photos for inspection</span>
                  </div>
                  <div className="flex items-center gap-3 opacity-60">
                    <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                      <Navigation className="w-5 h-5" />
                    </div>
                    <span className="flex-1">Hand over to customer</span>
                  </div>
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

                {availableJobs.map((job, index) => (
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
                              <h3 className="font-semibold text-lg">{job.consumerName}</h3>
                              <Badge variant="secondary">{job.itemCount} items</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{markets[0].name}</span>
                              <span>•</span>
                              <span>{job.vendorCount} vendors</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-display text-2xl font-bold text-market">
                              ₵{job.estimatedEarnings}
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
                ))}
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
            
            {[1, 2, 3, 4, 5].map((_, index) => (
              <Card key={index} variant="default">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="font-semibold">Order #{1000 + index}</p>
                      <p className="text-sm text-muted-foreground">
                        {5 - index} items • {new Date(Date.now() - index * 86400000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-market">₵{15 + index * 5}</p>
                    <div className="flex items-center gap-1 text-xs text-gold">
                      <Star className="w-3 h-3 fill-current" />
                      <span>5.0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>This Week's Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-display font-bold text-primary mb-4">₵875</div>
                <div className="flex items-center gap-2 text-success text-sm mb-6">
                  <TrendingUp className="w-4 h-4" />
                  <span>+23% from last week</span>
                </div>
                <div className="space-y-3">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                    <div key={day} className="flex items-center gap-3">
                      <span className="w-8 text-sm text-muted-foreground">{day}</span>
                      <Progress value={20 + Math.random() * 70} className="h-3 flex-1" />
                      <span className="text-sm font-medium w-12 text-right">
                        ₵{Math.floor(80 + Math.random() * 70)}
                      </span>
                    </div>
                  ))}
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
    </div>
  );
};

export default ShopperApp;
