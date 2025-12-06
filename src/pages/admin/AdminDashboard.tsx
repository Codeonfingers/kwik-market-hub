import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  Eye,
  LogOut,
  Loader2,
  XCircle,
  RefreshCw,
  UserCheck,
  Ban
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import StatsCard from "@/components/shared/StatsCard";
import OrderFilters from "@/components/shared/OrderFilters";
import { useAuth } from "@/contexts/AuthContext";
import { useMarkets } from "@/hooks/useMarkets";
import { useAdminData } from "@/hooks/useAdminData";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { markets } = useMarkets();
  const { 
    vendors, 
    shoppers, 
    orders, 
    stats, 
    loading,
    verifyVendor,
    verifyShopper,
    toggleVendorActive,
    toggleShopperAvailable,
    refetch
  } = useAdminData();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarTab, setSidebarTab] = useState("Dashboard");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userDetailModal, setUserDetailModal] = useState(false);
  
  // Order filters
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderStatus, setOrderStatus] = useState("all");
  const [orderDateRange, setOrderDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = order.order_number.toLowerCase().includes(orderSearchQuery.toLowerCase());
      const matchesStatus = orderStatus === "all" || order.status === orderStatus;
      
      let matchesDate = true;
      if (orderDateRange.from) {
        const orderDate = new Date(order.created_at);
        matchesDate = orderDate >= orderDateRange.from;
        if (orderDateRange.to) {
          matchesDate = matchesDate && orderDate <= orderDateRange.to;
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, orderSearchQuery, orderStatus, orderDateRange]);

  // Pending verifications
  const pendingVendors = vendors.filter((v) => !v.is_verified);
  const pendingShoppers = shoppers.filter((s) => !s.is_verified);
  const allPending = [
    ...pendingVendors.map((v) => ({ ...v, type: "vendor" as const })),
    ...pendingShoppers.map((s) => ({ ...s, type: "shopper" as const })),
  ];

  const dashboardStats = [
    { 
      title: "Total Revenue", 
      value: `₵${stats.totalRevenue.toLocaleString()}`, 
      icon: DollarSign, 
      variant: "primary" as const, 
      trend: { value: 15, isPositive: true } 
    },
    { 
      title: "Active Orders", 
      value: String(stats.activeOrders), 
      icon: Package, 
      variant: "market" as const, 
      trend: { value: 8, isPositive: true } 
    },
    { 
      title: "Verified Vendors", 
      value: String(stats.verifiedVendors), 
      icon: Store, 
      variant: "gold" as const 
    },
    { 
      title: "Active Shoppers", 
      value: String(stats.activeShoppers), 
      icon: Briefcase, 
      variant: "default" as const 
    },
  ];

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", tab: "overview" },
    { icon: Package, label: "Orders", tab: "orders", count: stats.activeOrders },
    { icon: Store, label: "Vendors", tab: "vendors", count: pendingVendors.length },
    { icon: Briefcase, label: "Shoppers", tab: "shoppers", count: pendingShoppers.length },
    { icon: Users, label: "Consumers", tab: "consumers" },
    { icon: MapPin, label: "Markets", tab: "markets" },
    { icon: AlertTriangle, label: "Disputes", tab: "disputes", count: 0 },
    { icon: DollarSign, label: "Settlements", tab: "settlements" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r hidden lg:block">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">KwikAdmin</span>
          </Link>
        </div>

        <nav className="px-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setActiveTab(item.tab);
                setSidebarTab(item.label);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                sidebarTab === item.label
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
                <Badge variant="default" className="text-xs">
                  {item.count}
                </Badge>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={refetch}>
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b">
          <div className="px-4 md:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <Link to="/" className="lg:hidden">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
              </Link>
              <div className="relative max-w-md flex-1 hidden sm:block">
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
            <div className="flex items-center gap-2 md:gap-3">
              {allPending.length > 0 && (
                <Badge variant="pending" className="hidden sm:flex">
                  {allPending.length} pending verifications
                </Badge>
              )}
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                A
              </div>
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={handleSignOut}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6">
          {/* Welcome */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8"
          >
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
              {sidebarTab === "Dashboard" ? "Admin Dashboard" : sidebarTab}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Welcome back! Here's what's happening across KwikMarket today.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            {dashboardStats.map((stat, index) => (
              <StatsCard key={index} {...stat} index={index} />
            ))}
          </div>

          {/* Dynamic Content Based on Sidebar Selection */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
                {/* Pending Verifications */}
                <Card className="border shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Pending Verifications</CardTitle>
                      <Badge variant="pending">{allPending.length}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {allPending.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No pending verifications
                      </p>
                    ) : (
                      allPending.slice(0, 5).map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              item.type === "vendor" ? "bg-market/20 text-market" : "bg-gold/20 text-gold"
                            }`}>
                              {item.type === "vendor" ? <Store className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="font-medium">
                                {item.type === "vendor" ? (item as any).business_name : `Shopper #${item.id.slice(0, 8)}`}
                              </p>
                              <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => {
                              if (item.type === "vendor") {
                                verifyVendor(item.id);
                              } else {
                                verifyShopper(item.id);
                              }
                            }}
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            Verify
                          </Button>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Market Performance */}
                <Card className="border shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Market Performance</CardTitle>
                    <CardDescription>Orders by market this week</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {markets.slice(0, 4).map((market, index) => (
                      <div key={market.id} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium truncate">{market.name}</span>
                          <span className="text-muted-foreground flex-shrink-0">
                            {orders.filter((o) => o.market_id === market.id).length} orders
                          </span>
                        </div>
                        <Progress value={60 + index * 10} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Platform Health */}
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Platform Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-display font-bold text-market">
                        {orders.length > 0
                          ? ((orders.filter((o) => o.status === "completed").length / orders.length) * 100).toFixed(1)
                          : 0}%
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground">Order Success</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-display font-bold text-primary">4.7</div>
                      <p className="text-xs md:text-sm text-muted-foreground">Avg. Rating</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-display font-bold text-secondary">23 min</div>
                      <p className="text-xs md:text-sm text-muted-foreground">Avg. Time</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-display font-bold text-destructive">0.8%</div>
                      <p className="text-xs md:text-sm text-muted-foreground">Disputes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-4">
              <OrderFilters
                searchQuery={orderSearchQuery}
                selectedStatus={orderStatus}
                dateRange={orderDateRange}
                onSearchChange={setOrderSearchQuery}
                onStatusChange={setOrderStatus}
                onDateRangeChange={setOrderDateRange}
              />
              
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order #</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.slice(0, 20).map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.order_number}</TableCell>
                            <TableCell>
                              <Badge variant={
                                order.status === "completed" ? "success" :
                                order.status === "cancelled" ? "destructive" :
                                "pending"
                              }>
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>₵{Number(order.total || 0).toFixed(2)}</TableCell>
                            <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "vendors" && (
            <Card>
              <CardHeader>
                <CardTitle>Vendor Management</CardTitle>
                <CardDescription>View and manage all vendors</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Business Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Verified</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vendors.map((vendor) => (
                        <TableRow key={vendor.id}>
                          <TableCell className="font-medium">{vendor.business_name}</TableCell>
                          <TableCell>
                            <Switch
                              checked={vendor.is_active ?? true}
                              onCheckedChange={(checked) => toggleVendorActive(vendor.id, checked)}
                            />
                          </TableCell>
                          <TableCell>
                            {vendor.is_verified ? (
                              <Badge variant="success">Verified</Badge>
                            ) : (
                              <Badge variant="pending">Pending</Badge>
                            )}
                          </TableCell>
                          <TableCell>{vendor.rating || "N/A"}</TableCell>
                          <TableCell>{vendor.total_orders || 0}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                {!vendor.is_verified && (
                                  <DropdownMenuItem onClick={() => verifyVendor(vendor.id)}>
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Verify
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem className="text-destructive">
                                  <Ban className="w-4 h-4 mr-2" />
                                  Suspend
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "shoppers" && (
            <Card>
              <CardHeader>
                <CardTitle>Shopper Management</CardTitle>
                <CardDescription>View and manage all shoppers</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Shopper ID</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead>Verified</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Deliveries</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shoppers.map((shopper) => (
                        <TableRow key={shopper.id}>
                          <TableCell className="font-medium font-mono">
                            {shopper.id.slice(0, 8)}...
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={shopper.is_available ?? true}
                              onCheckedChange={(checked) => toggleShopperAvailable(shopper.id, checked)}
                            />
                          </TableCell>
                          <TableCell>
                            {shopper.is_verified ? (
                              <Badge variant="success">Verified</Badge>
                            ) : (
                              <Badge variant="pending">Pending</Badge>
                            )}
                          </TableCell>
                          <TableCell>{shopper.rating || "N/A"}</TableCell>
                          <TableCell>{shopper.total_deliveries || 0}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                {!shopper.is_verified && (
                                  <DropdownMenuItem onClick={() => verifyShopper(shopper.id)}>
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Verify
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem className="text-destructive">
                                  <Ban className="w-4 h-4 mr-2" />
                                  Suspend
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "disputes" && (
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">Active Disputes</CardTitle>
                    <CardDescription>Resolve customer and vendor issues</CardDescription>
                  </div>
                  <Badge variant="destructive">0 open</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-market/50 mx-auto mb-4" />
                  <h3 className="font-display text-xl font-bold mb-2">No Active Disputes</h3>
                  <p className="text-muted-foreground">All clear! No disputes require attention.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {(activeTab === "consumers" || activeTab === "markets" || activeTab === "settlements") && (
            <Card className="border shadow-sm">
              <CardContent className="p-12 text-center">
                <Clock className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground">
                  This section is under development and will be available soon.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
