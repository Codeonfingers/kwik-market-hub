import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Store, 
  Package, 
  DollarSign, 
  Star, 
  TrendingUp,
  Clock,
  CheckCircle2,
  Plus,
  Bell,
  Settings,
  LayoutGrid,
  List,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import StatsCard from "@/components/shared/StatsCard";
import OrderStatusBadge from "@/components/shared/OrderStatusBadge";
import { products, sampleOrders } from "@/lib/mock-data";
import { Link } from "react-router-dom";

const VendorDashboard = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const stats = [
    { title: "Today's Sales", value: "₵1,250", icon: DollarSign, variant: "primary" as const, trend: { value: 12, isPositive: true } },
    { title: "Active Orders", value: "8", icon: Package, variant: "market" as const },
    { title: "Total Products", value: "24", icon: Store, variant: "default" as const },
    { title: "Rating", value: "4.9", icon: Star, variant: "gold" as const },
  ];

  const pendingOrders = [
    { id: "ORD-001", customer: "Kofi A.", items: 3, total: 85, time: "5 mins ago" },
    { id: "ORD-002", customer: "Ama K.", items: 5, total: 120, time: "12 mins ago" },
    { id: "ORD-003", customer: "Kwame O.", items: 2, total: 45, time: "18 mins ago" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/">
                <div className="w-10 h-10 rounded-xl gradient-market flex items-center justify-center">
                  <Store className="w-5 h-5 text-market-foreground" />
                </div>
              </Link>
              <div>
                <h1 className="font-display text-xl font-bold">Vendor Portal</h1>
                <p className="text-sm text-muted-foreground">Auntie Akua's Fresh Produce</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                  3
                </span>
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card variant="gradient" className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl font-bold mb-2">
                    Good Morning, Auntie Akua! ☀️
                  </h2>
                  <p className="text-muted-foreground">
                    You have <span className="font-semibold text-primary">3 pending orders</span> to process.
                  </p>
                </div>
                <Badge variant="success" className="text-lg px-4 py-2">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Store Open
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} index={index} />
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="orders" className="text-base">Orders</TabsTrigger>
            <TabsTrigger value="products" className="text-base">Products</TabsTrigger>
            <TabsTrigger value="analytics" className="text-base">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold">Pending Orders</h2>
              <Badge variant="pending">{pendingOrders.length} waiting</Badge>
            </div>

            {pendingOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="elevated" className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-semibold">
                          {order.customer.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{order.customer}</p>
                          <p className="text-sm text-muted-foreground">{order.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-lg font-bold">₵{order.total}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {order.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{order.items} items</Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button variant="market" size="sm">
                          Accept Order
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold">Your Products</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button variant="hero" size="sm">
                  <Plus className="w-4 h-4" />
                  Add Product
                </Button>
              </div>
            </div>

            <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-3"}>
              {products.filter(p => p.vendorId === "v1").map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {viewMode === "grid" ? (
                    <Card variant="elevated" className="overflow-hidden">
                      <div className="h-32 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-3">
                        <h4 className="font-semibold truncate">{product.name}</h4>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-primary">₵{product.price}/{product.unit}</span>
                          <Badge variant={product.available ? "success" : "destructive"} className="text-xs">
                            {product.available ? "In Stock" : "Out"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card variant="elevated">
                      <CardContent className="p-4 flex items-center gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-grow">
                          <h4 className="font-semibold">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">₵{product.price}/{product.unit}</p>
                          <Badge variant={product.available ? "success" : "destructive"} className="text-xs mt-1">
                            {product.available ? "In Stock" : "Out"}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="font-display text-xl font-bold mb-4">Performance Overview</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Weekly Sales</CardTitle>
                  <CardDescription>Your earnings this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-display font-bold text-primary mb-2">₵8,450</div>
                  <div className="flex items-center gap-2 text-success text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>+18% from last week</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                      <div key={day} className="flex items-center gap-3">
                        <span className="w-8 text-sm text-muted-foreground">{day}</span>
                        <Progress value={40 + Math.random() * 50} className="h-2 flex-1" />
                        <span className="text-sm font-medium w-16 text-right">
                          ₵{Math.floor(800 + Math.random() * 600)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Top Products</CardTitle>
                  <CardDescription>Best sellers this month</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {products.filter(p => p.vendorId === "v1").map((product, index) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {index + 1}
                      </span>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-grow">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">45 sold</p>
                      </div>
                      <p className="font-bold">₵{(product.price * 45).toLocaleString()}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default VendorDashboard;
