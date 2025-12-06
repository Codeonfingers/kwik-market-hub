import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  ShoppingCart, 
  MapPin, 
  ChevronRight,
  Plus,
  Clock,
  Package,
  LogOut,
  Loader2,
  CreditCard
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/shared/ProductCard";
import CategoryPill from "@/components/shared/CategoryPill";
import OrderStatusBadge from "@/components/shared/OrderStatusBadge";
import MomoPaymentModal from "@/components/shared/MomoPaymentModal";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/hooks/useOrders";
import { useProducts } from "@/hooks/useProducts";
import { useMarkets } from "@/hooks/useMarkets";
import { useRealtimeConsumerNotifications } from "@/hooks/useRealtimeNotifications";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { OrderStatus } from "@/types";

interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  unit: string;
}

const ConsumerApp = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { orders, loading: ordersLoading, createOrder } = useOrders();
  const { products, categories, loading: productsLoading } = useProducts();
  const { markets, loading: marketsLoading } = useMarkets();
  
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentModal, setPaymentModal] = useState<{ open: boolean; orderId: string; amount: number }>({
    open: false,
    orderId: "",
    amount: 0,
  });

  // Real-time order status notifications
  useRealtimeConsumerNotifications(user?.id);

  // Auth is handled by ProtectedRoute wrapper


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
    toast.success(`Added ${quantity} ${unit} of ${productName} to cart`);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const handleCheckout = async () => {
    if (!selectedMarketId || cart.length === 0) return;

    // For now, use the first vendor (in real app, would group by vendor)
    const vendorId = products[0]?.vendor_id;
    if (!vendorId) {
      toast.error("No vendor available");
      return;
    }

    const { data, error } = await createOrder(vendorId, selectedMarketId, cart);
    
    if (!error && data) {
      setCart([]);
      setPaymentModal({
        open: true,
        orderId: data.id,
        amount: Number(data.total),
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const loading = ordersLoading || productsLoading || marketsLoading;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Package className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold hidden sm:block">
                KwikMarket
              </span>
            </Link>

            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Market Selector */}
          {selectedMarket && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Shopping at</span>
              <Button variant="link" className="p-0 h-auto font-semibold">
                {selectedMarket.name}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="shop" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="shop" className="text-base">Shop</TabsTrigger>
            <TabsTrigger value="orders" className="text-base">My Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="shop" className="space-y-6">
            {/* Categories */}
            <section>
              <h2 className="font-display text-xl font-bold mb-4">Categories</h2>
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
            </section>

            {/* Products Grid */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold">
                  {selectedCategory 
                    ? categories.find((c) => c.id === selectedCategory)?.name 
                    : "All Products"}
                </h2>
                <Badge variant="secondary">{filteredProducts.length} items</Badge>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="font-display text-xl font-bold mb-2">No products yet</h3>
                  <p className="text-muted-foreground">Check back soon for fresh products!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
            </section>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <h2 className="font-display text-xl font-bold mb-4">Your Orders</h2>
            
            {ordersLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6">Start shopping to see your orders here.</p>
              </div>
            ) : (
              orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card variant="elevated">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Order {order.order_number}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {order.items?.length || 0} items
                          </p>
                        </div>
                        <OrderStatusBadge status={order.status as OrderStatus} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {order.items?.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.product_name}</span>
                            <span className="font-medium">₵{Number(item.total_price).toFixed(2)}</span>
                          </div>
                        ))}
                        {(order.items?.length || 0) > 2 && (
                          <p className="text-sm text-muted-foreground">
                            +{(order.items?.length || 0) - 2} more items
                          </p>
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="font-display text-xl font-bold">₵{Number(order.total).toFixed(2)}</p>
                        </div>
                        {order.status === "inspecting" && (
                          <Button
                            variant="hero"
                            size="sm"
                            onClick={() => setPaymentModal({
                              open: true,
                              orderId: order.id,
                              amount: Number(order.total),
                            })}
                          >
                            <CreditCard className="w-4 h-4" />
                            Pay Now
                          </Button>
                        )}
                        {order.status !== "inspecting" && (
                          <Button variant="outline" size="sm">
                            Track Order
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 left-4 right-4 z-50"
        >
          <Button variant="hero" className="w-full h-16 text-lg shadow-glow" onClick={handleCheckout}>
            <ShoppingCart className="w-6 h-6" />
            Checkout ({cart.length} items)
            <span className="ml-auto">₵{cartTotal.toFixed(2)}</span>
          </Button>
        </motion.div>
      )}

      {/* Payment Modal */}
      <MomoPaymentModal
        open={paymentModal.open}
        onClose={() => setPaymentModal({ open: false, orderId: "", amount: 0 })}
        orderId={paymentModal.orderId}
        amount={paymentModal.amount}
        onSuccess={() => {}}
      />
    </div>
  );
};

export default ConsumerApp;
