import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  ChevronRight,
  LogOut,
  Loader2,
  Upload,
  Image as ImageIcon,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import StatsCard from "@/components/shared/StatsCard";
import OrderStatusBadge from "@/components/shared/OrderStatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useVendor } from "@/hooks/useVendor";
import { useProducts } from "@/hooks/useProducts";
import { useOrders } from "@/hooks/useOrders";
import { useMarkets } from "@/hooks/useMarkets";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Link } from "react-router-dom";
import { OrderStatus } from "@/types";
import { toast } from "sonner";

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { vendor, loading: vendorLoading, createVendor } = useVendor();
  const { products, loading: productsLoading, createProduct } = useProducts(vendor?.id);
  const { orders, updateOrderStatus } = useOrders();
  const { markets } = useMarkets();
  
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingForm, setOnboardingForm] = useState({
    businessName: "",
    marketId: "",
    stallNumber: "",
    description: "",
  });
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    unit: "kg",
    description: "",
    imageUrl: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploading } = useImageUpload();

  // Vendor onboarding check (role is already verified by ProtectedRoute)


  useEffect(() => {
    if (!vendorLoading && !vendor && user) {
      setShowOnboarding(true);
    }
  }, [vendorLoading, vendor, user]);

  const handleCreateVendor = async () => {
    if (!onboardingForm.businessName || !onboardingForm.marketId) {
      toast.error("Please fill in all required fields");
      return;
    }

    const { error } = await createVendor(
      onboardingForm.businessName,
      onboardingForm.marketId,
      onboardingForm.description,
      onboardingForm.stallNumber
    );

    if (!error) {
      setShowOnboarding(false);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    const url = await uploadImage(file);
    if (url) {
      setProductForm({ ...productForm, imageUrl: url });
      toast.success("Image uploaded successfully");
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setProductForm({ ...productForm, imageUrl: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddProduct = async () => {
    if (!vendor || !productForm.name || !productForm.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    await createProduct({
      vendor_id: vendor.id,
      name: productForm.name,
      price: parseFloat(productForm.price),
      unit: productForm.unit,
      description: productForm.description,
      is_available: true,
      category_id: null,
      image_url: productForm.imageUrl || null,
      stock_quantity: null,
    });

    setShowAddProduct(false);
    setProductForm({ name: "", price: "", unit: "kg", description: "", imageUrl: "" });
    setImagePreview(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleAcceptOrder = async (orderId: string) => {
    await updateOrderStatus(orderId, "accepted");
  };

  const handleMarkReady = async (orderId: string) => {
    await updateOrderStatus(orderId, "ready");
  };

  const vendorOrders = orders.filter((o) => o.vendor_id === vendor?.id);
  const pendingOrders = vendorOrders.filter((o) => o.status === "pending");

  const stats = [
    { title: "Today's Sales", value: `₵${vendorOrders.filter(o => o.status === "completed").reduce((sum, o) => sum + Number(o.subtotal), 0).toFixed(0)}`, icon: DollarSign, variant: "primary" as const },
    { title: "Active Orders", value: String(vendorOrders.filter(o => !["completed", "cancelled"].includes(o.status)).length), icon: Package, variant: "market" as const },
    { title: "Total Products", value: String(products.length), icon: Store, variant: "default" as const },
    { title: "Rating", value: vendor?.rating?.toString() || "0", icon: Star, variant: "gold" as const },
  ];

  if (authLoading || vendorLoading) {
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
              <div className="w-16 h-16 rounded-2xl gradient-market flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-market-foreground" />
              </div>
              <CardTitle className="font-display text-2xl">Become a Vendor</CardTitle>
              <CardDescription>Set up your vendor profile to start selling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Business Name *</Label>
                <Input
                  placeholder="e.g., Auntie Akua's Fresh Produce"
                  value={onboardingForm.businessName}
                  onChange={(e) => setOnboardingForm({ ...onboardingForm, businessName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Market *</Label>
                <select
                  className="w-full h-10 px-3 rounded-md border bg-background"
                  value={onboardingForm.marketId}
                  onChange={(e) => setOnboardingForm({ ...onboardingForm, marketId: e.target.value })}
                >
                  <option value="">Select a market</option>
                  {markets.map((market) => (
                    <option key={market.id} value={market.id}>{market.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Stall Number</Label>
                <Input
                  placeholder="e.g., A-15"
                  value={onboardingForm.stallNumber}
                  onChange={(e) => setOnboardingForm({ ...onboardingForm, stallNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  placeholder="Tell customers about your products"
                  value={onboardingForm.description}
                  onChange={(e) => setOnboardingForm({ ...onboardingForm, description: e.target.value })}
                />
              </div>
              <Button variant="hero" className="w-full" onClick={handleCreateVendor}>
                Create Vendor Profile
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
                <div className="w-10 h-10 rounded-xl gradient-market flex items-center justify-center">
                  <Store className="w-5 h-5 text-market-foreground" />
                </div>
              </Link>
              <div>
                <h1 className="font-display text-xl font-bold">Vendor Portal</h1>
                <p className="text-sm text-muted-foreground">{vendor?.business_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {pendingOrders.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                    {pendingOrders.length}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="w-5 h-5" />
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
                    Welcome back! ☀️
                  </h2>
                  <p className="text-muted-foreground">
                    You have <span className="font-semibold text-primary">{pendingOrders.length} pending orders</span> to process.
                  </p>
                </div>
                <Badge variant={vendor?.is_active ? "success" : "secondary"} className="text-lg px-4 py-2">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  {vendor?.is_active ? "Store Open" : "Store Closed"}
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

            {pendingOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold mb-2">No pending orders</h3>
                <p className="text-muted-foreground">New orders will appear here.</p>
              </div>
            ) : (
              pendingOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="elevated" className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold">{order.order_number}</p>
                          <p className="text-sm text-muted-foreground">{order.items?.length || 0} items</p>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-lg font-bold">₵{Number(order.subtotal).toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(order.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <OrderStatusBadge status={order.status as OrderStatus} />
                        <div className="flex gap-2">
                          {order.status === "pending" && (
                            <Button variant="market" size="sm" onClick={() => handleAcceptOrder(order.id)}>
                              Accept Order
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          )}
                          {order.status === "accepted" && (
                            <Button variant="market" size="sm" onClick={() => handleMarkReady(order.id)}>
                              Mark Ready
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
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
                <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
                  <DialogTrigger asChild>
                    <Button variant="hero" size="sm">
                      <Plus className="w-4 h-4" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      {/* Image Upload */}
                      <div className="space-y-2">
                        <Label>Product Image</Label>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="hidden"
                          onChange={handleImageSelect}
                        />
                        {imagePreview ? (
                          <div className="relative">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="w-full h-40 object-cover rounded-xl border"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-8 w-8"
                              onClick={handleRemoveImage}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
                          >
                            {uploading ? (
                              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                            ) : (
                              <>
                                <Upload className="w-8 h-8 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Click to upload image</span>
                                <span className="text-xs text-muted-foreground">JPG, PNG, WebP (max 5MB)</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Product Name *</Label>
                        <Input
                          placeholder="e.g., Fresh Tomatoes"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Price (₵) *</Label>
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Unit</Label>
                          <select
                            className="w-full h-10 px-3 rounded-xl border bg-background"
                            value={productForm.unit}
                            onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                          >
                            <option value="kg">per kg</option>
                            <option value="piece">per piece</option>
                            <option value="bunch">per bunch</option>
                            <option value="bowl">per bowl</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                          placeholder="Describe your product"
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        />
                      </div>
                      <Button 
                        variant="hero" 
                        className="w-full" 
                        onClick={handleAddProduct}
                        disabled={uploading}
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          "Add Product"
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {productsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold mb-2">No products yet</h3>
                <p className="text-muted-foreground mb-4">Add your first product to start selling.</p>
                <Button variant="hero" onClick={() => setShowAddProduct(true)}>
                  <Plus className="w-4 h-4" />
                  Add Product
                </Button>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-3"}>
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {viewMode === "grid" ? (
                      <Card variant="elevated" className="overflow-hidden">
                        <div className="h-32 overflow-hidden bg-muted flex items-center justify-center">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-12 h-12 text-muted-foreground" />
                          )}
                        </div>
                        <CardContent className="p-3">
                          <h4 className="font-semibold truncate">{product.name}</h4>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-bold text-primary">₵{Number(product.price)}/{product.unit}</span>
                            <Badge variant={product.is_available ? "success" : "destructive"} className="text-xs">
                              {product.is_available ? "In Stock" : "Out"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card variant="elevated">
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-8 h-8 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-semibold">{product.name}</h4>
                            <p className="text-sm text-muted-foreground">{product.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">₵{Number(product.price)}/{product.unit}</p>
                            <Badge variant={product.is_available ? "success" : "destructive"} className="text-xs mt-1">
                              {product.is_available ? "In Stock" : "Out"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
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
                  <div className="text-4xl font-display font-bold text-primary mb-2">
                    ₵{vendorOrders.filter(o => o.status === "completed").reduce((sum, o) => sum + Number(o.subtotal), 0).toFixed(0)}
                  </div>
                  <div className="flex items-center gap-2 text-success text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>Keep it up!</span>
                  </div>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Order Stats</CardTitle>
                  <CardDescription>Your order breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Orders</span>
                    <span className="font-bold">{vendorOrders.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed</span>
                    <span className="font-bold text-success">{vendorOrders.filter(o => o.status === "completed").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending</span>
                    <span className="font-bold text-gold">{pendingOrders.length}</span>
                  </div>
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
