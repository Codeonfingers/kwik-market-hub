import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  ShoppingCart, 
  MapPin, 
  ChevronRight,
  Plus,
  Clock,
  Package
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/shared/ProductCard";
import CategoryPill from "@/components/shared/CategoryPill";
import OrderStatusBadge from "@/components/shared/OrderStatusBadge";
import { markets, products, categories, sampleOrders } from "@/lib/mock-data";
import { Product } from "@/types";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const ConsumerApp = () => {
  const [selectedMarket, setSelectedMarket] = useState(markets[0]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: Product, quantity: number) => {
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += quantity;
      setCart(newCart);
    } else {
      setCart([...cart, { product, quantity }]);
    }
    toast.success(`Added ${quantity} ${product.unit} of ${product.name} to cart`);
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

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

            <Link to="/consumer/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* Market Selector */}
          <div className="mt-3 flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Shopping at</span>
            <Button variant="link" className="p-0 h-auto font-semibold">
              {selectedMarket.name}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
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
                {categories.slice(0, 6).map((category) => (
                  <CategoryPill
                    key={category.id}
                    icon={category.icon}
                    name={category.name}
                    count={category.count}
                    isActive={selectedCategory === category.name}
                    onClick={() => setSelectedCategory(category.name)}
                  />
                ))}
              </div>
            </section>

            {/* Products Grid */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold">
                  {selectedCategory || "All Products"}
                </h2>
                <Badge variant="secondary">{filteredProducts.length} items</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <h2 className="font-display text-xl font-bold mb-4">Your Orders</h2>
            
            {sampleOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card variant="elevated">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} items • {selectedMarket.name}
                        </p>
                      </div>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.quantity} {item.unit} {item.productName}</span>
                          <span className="font-medium">₵{item.estimatedPrice}</span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-sm text-muted-foreground">
                          +{order.items.length - 2} more items
                        </p>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Estimated Total</p>
                        <p className="font-display text-xl font-bold">₵{order.totalEstimate}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Track Order
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {sampleOrders.length === 0 && (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6">Start shopping to see your orders here.</p>
                <Button variant="hero">
                  <Plus className="w-4 h-4" />
                  Create Order
                </Button>
              </div>
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
          <Link to="/consumer/cart">
            <Button variant="hero" className="w-full h-16 text-lg shadow-glow">
              <ShoppingCart className="w-6 h-6" />
              View Cart ({cart.length} items)
              <span className="ml-auto">₵{cartTotal.toFixed(2)}</span>
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default ConsumerApp;
