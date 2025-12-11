import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ShoppingCart, 
  Package, 
  MapPin, 
  Plus, 
  Clock, 
  Star, 
  ArrowRight,
  CreditCard,
  Navigation,
  Truck,
  Search,
  ChevronRight,
  Loader2,
  Eye,
  CheckCircle2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardCard from "@/components/shared/DashboardCard";
import StatusBadge from "@/components/shared/StatusBadge";
import ProductCard from "@/components/shared/ProductCard";
import CategoryPill from "@/components/shared/CategoryPill";
import MomoPaymentModal from "@/components/shared/MomoPaymentModal";
import OrderTrackingMap from "@/components/tracking/OrderTrackingMap";
import RatingModal from "@/components/shared/RatingModal";
import OrderExportMenu from "@/components/shared/OrderExportMenu";
import WhatsAppOrderButton from "@/components/ordering/WhatsAppOrderButton";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/hooks/useOrders";
import { useProducts } from "@/hooks/useProducts";
import { useMarkets } from "@/hooks/useMarkets";
import { useRatings } from "@/hooks/useRatings";
import { useRealtimeConsumerNotifications } from "@/hooks/useRealtimeNotifications";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { OrderStatus } from "@/types";

interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  unit: string;
}

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { orders, loading: ordersLoading, createOrder } = useOrders();
  const { products, categories, loading: productsLoading } = useProducts();
  const { markets, loading: marketsLoading } = useMarkets();
  const { hasRatedOrder } = useRatings();

  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  
  const [paymentModal, setPaymentModal] = useState<{ open: boolean; orderId: string; amount: number }>({
    open: false, orderId: "", amount: 0,
  });
  const [trackingOrder, setTrackingOrder] = useState<{ open: boolean; order: any | null }>({
    open: false, order: null,
  });
  const [ratingModal, setRatingModal] = useState<{
    open: boolean; orderId: string; targetUserId: string; targetName: string; targetType: "vendor" | "shopper";
  }>({ open: false, orderId: "", targetUserId: "", targetName: "", targetType: "vendor" });

  useRealtimeConsumerNotifications(user?.id);

  useEffect(() => {
    if (markets.length > 0 && !selectedMarketId) {
      setSelectedMarketId(markets[0].id);
    }
  }, [markets, selectedMarketId]);

  const selectedMarket = markets.find((m) => m.id === selectedMarketId);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (productId: string, productName: string, unitPrice: number, unit: string, quantity: number) => {
    const existingIndex = cart.findIndex((item) => item.productId === productId);
    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += quantity;
      setCart(newCart);
    } else {
      setCart([...cart, { productId, productName, quantity, unitPrice, unit }]);
    }
    toast.success(`Added ${quantity} ${unit} of ${productName}`);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const handleCheckout = async () => {
    if (!selectedMarketId || cart.length === 0) return;
    const vendorId = products[0]?.vendor_id;
    if (!vendorId) {
      toast.error("No vendor available");
      return;
    }

    const { data, error } = await createOrder(vendorId, selectedMarketId, cart);
    if (!error && data) {
      setCart([]);
      setPaymentModal({ open: true, orderId: data.id, amount: Number(data.total) });
    }
  };

  const pendingOrders = orders.filter(o => ["pending", "accepted", "preparing"].includes(o.status));
  const activeOrders = orders.filter(o => ["ready", "picked_up", "inspecting"].includes(o.status));
  const completedOrders = orders.filter(o => o.status === "completed");

  const loading = ordersLoading || productsLoading || marketsLoading;

  return (
    <DashboardLayout role="consumer" title="Customer Dashboard">
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Active Orders"
            value={pendingOrders.length + activeOrders.length}
            icon={ShoppingCart}
            variant="primary"
          />
          <DashboardCard
            title="Completed"
            value={completedOrders.length}
            icon={CheckCircle2}
            variant="success"
          />
          <DashboardCard
            title="In Cart"
            value={cart.length}
            icon={Package}
            description={cart.length > 0 ? `₵${cartTotal.toFixed(2)}` : "Empty"}
          />
          <DashboardCard
            title="Saved"
            value="₵245.00"
            icon={Star}
            variant="gold"
            description="This month"
          />
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="shop">Shop</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Active Orders Alert */}
            {activeOrders.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-secondary/10 border-secondary/30">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                        <Truck className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-bold">Order In Progress</p>
                        <p className="text-sm text-muted-foreground">
                          {activeOrders[0].order_number} - {activeOrders[0].status}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => setTrackingOrder({ open: true, order: activeOrders[0] })}
                    >
                      Track Order
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Market Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Your Market
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedMarket ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-lg">{selectedMarket.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedMarket.location}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                ) : (
                  <Button className="w-full" onClick={() => setActiveTab("shop")}>
                    Select a Market
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setActiveTab("shop")}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Plus className="w-7 h-7 text-primary" />
                  </div>
                  <p className="font-bold">New Order</p>
                  <p className="text-sm text-muted-foreground">Start shopping</p>
                </CardContent>
              </Card>
              <Link to="/subscriptions">
                <Card className="cursor-pointer hover:shadow-lg transition-all h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-3">
                      <Star className="w-7 h-7 text-gold" />
                    </div>
                    <p className="font-bold">Subscriptions</p>
                    <p className="text-sm text-muted-foreground">Save more</p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-lg">Recent Orders</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab("orders")}>
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="font-medium">No orders yet</p>
                    <p className="text-sm text-muted-foreground">Start shopping to see your orders here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                        <div>
                          <p className="font-medium">{order.order_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.items?.length || 0} items · ₵{Number(order.total).toFixed(2)}
                          </p>
                        </div>
                        <StatusBadge status={order.status as any} />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shop Tab */}
          <TabsContent value="shop" className="space-y-6 mt-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <CategoryPill
                icon="🛒"
                name="All"
                count={products.length}
                isActive={!selectedCategory}
                onClick={() => setSelectedCategory(null)}
              />
              {categories.map((category) => (
                <CategoryPill
                  key={category.id}
                  icon={category.icon || "📦"}
                  name={category.name}
                  count={products.filter((p) => p.category_id === category.id).length}
                  isActive={selectedCategory === category.id}
                  onClick={() => setSelectedCategory(category.id)}
                />
              ))}
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold mb-2">No products yet</h3>
                <p className="text-muted-foreground">Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      name: product.name,
                      price: Number(product.price),
                      unit: product.unit || "piece",
                      image: product.image_url || "/placeholder.svg",
                      category: categories.find((c) => c.id === product.category_id)?.name || "",
                      vendorId: product.vendor_id,
                      available: product.is_available ?? true,
                      description: product.description || "",
                      priceHistory: [],
                    }}
                    index={index}
                    onAddToCart={(p, qty) => handleAddToCart(p.id, p.name, p.price, p.unit, qty)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Your Orders</h2>
              <OrderExportMenu orders={orders} />
            </div>

            {ordersLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6">Start shopping to see your orders here.</p>
                <Button onClick={() => setActiveTab("shop")}>Start Shopping</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-bold">{order.order_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.items?.length || 0} items
                          </p>
                        </div>
                        <StatusBadge status={order.status as any} />
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        {order.items?.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.product_name}</span>
                            <span className="font-medium">₵{Number(item.total_price).toFixed(2)}</span>
                          </div>
                        ))}
                        {(order.items?.length || 0) > 2 && (
                          <p className="text-sm text-muted-foreground">
                            +{(order.items?.length || 0) - 2} more
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <p className="font-display text-lg font-bold">₵{Number(order.total).toFixed(2)}</p>
                        <div className="flex gap-2">
                          {order.status === "inspecting" && (
                            <Button size="sm" onClick={() => setPaymentModal({
                              open: true, orderId: order.id, amount: Number(order.total)
                            })}>
                              <CreditCard className="w-4 h-4 mr-1" /> Pay
                            </Button>
                          )}
                          {["picked_up", "preparing", "ready"].includes(order.status) && (
                            <Button variant="outline" size="sm" onClick={() => setTrackingOrder({ open: true, order })}>
                              <Navigation className="w-4 h-4 mr-1" /> Track
                            </Button>
                          )}
                          {order.status === "completed" && order.vendor_id && !hasRatedOrder(order.id, order.vendor_id) && (
                            <Button variant="outline" size="sm" onClick={() => setRatingModal({
                              open: true, orderId: order.id, targetUserId: order.vendor_id!,
                              targetName: "Vendor", targetType: "vendor"
                            })}>
                              <Star className="w-4 h-4 mr-1" /> Rate
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Floating Cart */}
        {cart.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-20 lg:bottom-8 left-4 right-4 lg:left-auto lg:right-8 lg:w-96 z-40"
          >
            <Card className="shadow-xl border-2 border-primary">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold">{cart.length} items</p>
                    <p className="text-2xl font-display font-bold">₵{cartTotal.toFixed(2)}</p>
                  </div>
                  <Button onClick={handleCheckout} className="btn-touch">
                    Checkout <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* WhatsApp Button */}
        <WhatsAppOrderButton items={cart.map(c => ({ name: c.productName, quantity: c.quantity, unit: c.unit }))} />

        {/* Modals */}
        <MomoPaymentModal
          open={paymentModal.open}
          onClose={() => setPaymentModal({ open: false, orderId: "", amount: 0 })}
          orderId={paymentModal.orderId}
          amount={paymentModal.amount}
        />

        <Dialog open={trackingOrder.open} onOpenChange={(open) => setTrackingOrder({ open, order: open ? trackingOrder.order : null })}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Track Your Order</DialogTitle>
            </DialogHeader>
            {trackingOrder.order && (
              <div className="h-80">
                <OrderTrackingMap
                  shopperLocation={{ lat: 5.6037, lng: -0.1870 }}
                  marketLocation={{ lat: 5.5500, lng: -0.2000 }}
                  customerLocation={{ lat: 5.6200, lng: -0.1750 }}
                  orderStatus={trackingOrder.order.status}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>

        <RatingModal
          open={ratingModal.open}
          onClose={() => setRatingModal({ ...ratingModal, open: false })}
          orderId={ratingModal.orderId}
          targetUserId={ratingModal.targetUserId}
          targetName={ratingModal.targetName}
          targetType={ratingModal.targetType}
        />
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
