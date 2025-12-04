import { useState } from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard,
  Users,
  Store,
  Briefcase,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  MoreVertical,
  Shield,
  MapPin,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatsCard from "@/components/shared/StatsCard";
import { markets, vendors } from "@/lib/mock-data";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    { title: "Total Revenue", value: "₵125,430", icon: DollarSign, variant: "primary" as const, trend: { value: 15, isPositive: true } },
    { title: "Active Orders", value: "156", icon: Package, variant: "market" as const, trend: { value: 8, isPositive: true } },
    { title: "Verified Vendors", value: "1,245", icon: Store, variant: "gold" as const },
    { title: "Active Shoppers", value: "342", icon: Briefcase, variant: "default" as const },
  ];

  const recentActivities = [
    { type: "vendor", action: "New vendor registered", user: "Kwame's Fish Corner", time: "2 mins ago" },
    { type: "order", action: "Large order completed", user: "Order #12456", time: "15 mins ago" },
    { type: "dispute", action: "Dispute opened", user: "Order #12389", time: "1 hour ago" },
    { type: "shopper", action: "Shopper verified", user: "Ama Mensah", time: "2 hours ago" },
  ];

  const pendingVerifications = [
    { id: "v1", name: "Nana's Spice Shop", market: "Makola Market", type: "vendor", date: "2024-03-15" },
    { id: "v2", name: "Kofi Asante", market: "Kaneshie Market", type: "shopper", date: "2024-03-15" },
    { id: "v3", name: "Fresh Fish Plus", market: "Makola Market", type: "vendor", date: "2024-03-14" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r hidden lg:block">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">KwikAdmin</span>
          </Link>
        </div>

        <nav className="px-4 space-y-1">
          {[
            { icon: LayoutDashboard, label: "Dashboard", active: true },
            { icon: Package, label: "Orders", count: 12 },
            { icon: Store, label: "Vendors", count: 5 },
            { icon: Briefcase, label: "Shoppers", count: 3 },
            { icon: Users, label: "Consumers" },
            { icon: MapPin, label: "Markets" },
            { icon: AlertTriangle, label: "Disputes", count: 2 },
            { icon: DollarSign, label: "Settlements" },
          ].map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                item.active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.count && (
                <Badge variant="default" className="text-xs">
                  {item.count}
                </Badge>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-50 glass-card border-b">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search orders, vendors, shoppers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                A
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Welcome */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening across KwikMarket today.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} index={index} />
            ))}
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="verifications">Pending Verifications</TabsTrigger>
              <TabsTrigger value="disputes">Disputes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Activity Feed */}
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest actions across the platform</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.type === "vendor" ? "bg-market/20 text-market" :
                          activity.type === "order" ? "bg-primary/20 text-primary" :
                          activity.type === "dispute" ? "bg-destructive/20 text-destructive" :
                          "bg-gold/20 text-gold"
                        }`}>
                          {activity.type === "vendor" && <Store className="w-5 h-5" />}
                          {activity.type === "order" && <Package className="w-5 h-5" />}
                          {activity.type === "dispute" && <AlertTriangle className="w-5 h-5" />}
                          {activity.type === "shopper" && <Briefcase className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.user}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                {/* Market Performance */}
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>Market Performance</CardTitle>
                    <CardDescription>Orders by market this week</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {markets.map((market, index) => (
                      <div key={market.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{market.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {200 + index * 50} orders
                          </span>
                        </div>
                        <Progress value={60 + index * 10} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Platform Health */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Platform Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-display font-bold text-market">98.5%</div>
                      <p className="text-sm text-muted-foreground">Order Success Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-display font-bold text-primary">4.7</div>
                      <p className="text-sm text-muted-foreground">Avg. Customer Rating</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-display font-bold text-gold">23 min</div>
                      <p className="text-sm text-muted-foreground">Avg. Fulfillment Time</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-display font-bold text-destructive">0.8%</div>
                      <p className="text-sm text-muted-foreground">Dispute Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verifications">
              <Card variant="elevated">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Pending Verifications</CardTitle>
                      <CardDescription>Review and approve new vendors and shoppers</CardDescription>
                    </div>
                    <Badge variant="pending">{pendingVerifications.length} pending</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Market</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingVerifications.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>
                            <Badge variant={item.type === "vendor" ? "active" : "gold"}>
                              {item.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.market}</TableCell>
                          <TableCell>{item.date}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="market" size="sm">
                                Approve
                              </Button>
                              <Button variant="outline" size="sm">
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="disputes">
              <Card variant="elevated">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Active Disputes</CardTitle>
                      <CardDescription>Resolve customer and vendor issues</CardDescription>
                    </div>
                    <Badge variant="destructive">2 open</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { id: "D-001", order: "ORD-12389", type: "Quality Issue", status: "investigating", customer: "Ama K.", vendor: "Fresh Fish Corner" },
                    { id: "D-002", order: "ORD-12345", type: "Missing Item", status: "pending", customer: "Kofi A.", vendor: "Auntie Akua's" },
                  ].map((dispute, index) => (
                    <Card key={dispute.id} variant="outline">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-destructive" />
                              <span className="font-semibold">{dispute.id}</span>
                              <Badge variant="pending">{dispute.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Order: {dispute.order} • Type: {dispute.type}
                            </p>
                            <p className="text-sm">
                              {dispute.customer} → {dispute.vendor}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">View Details</Button>
                            <Button variant="hero" size="sm">Resolve</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
