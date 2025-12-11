import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Star, 
  Plus, 
  Camera,
  Check,
  X,
  Clock,
  TrendingUp,
  AlertTriangle,
  Loader2,
  Edit,
  Trash2,
  ImagePlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardCard from "@/components/shared/DashboardCard";
import StatusBadge from "@/components/shared/StatusBadge";
import StockManagement from "@/components/vendor/StockManagement";
import { useAuth } from "@/contexts/AuthContext";
import { useVendor } from "@/hooks/useVendor";
import { useProducts } from "@/hooks/useProducts";
import { useOrders } from "@/hooks/useOrders";
import { useMarkets } from "@/hooks/useMarkets";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useRealtimeVendorNotifications } from "@/hooks/useRealtimeNotifications";
import { toast } from "sonner";
import { OrderStatus } from "@/types";

const VendorDashboardNew = () => {
  const { user } = useAuth();
  const { vendor, loading: vendorLoading, createVendor } = useVendor();
  const { products, categories, createProduct, updateProduct, deleteProduct, loading: productsLoading, refetch: refetchProducts } = useProducts(vendor?.id);
  const { orders, loading: ordersLoading, updateOrderStatus } = useOrders();
  const { markets } = useMarkets();
  const { uploadImage, uploading } = useImageUpload();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [productModal, setProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "", price: "", unit: "piece", description: "", category_id: "", image_url: ""
  });
  const [onboardingModal, setOnboardingModal] = useState(false);
  const [onboardingData, setOnboardingData] = useState({
    businessName: "", marketId: "", stallNumber: "", description: ""
  });

  useRealtimeVendorNotifications(vendor?.id);

  useEffect(() => {
    if (!vendorLoading && !vendor && user) {
      setOnboardingModal(true);
    }
  }, [vendor, vendorLoading, user]);

  const handleCreateVendor = async () => {
    if (!onboardingData.businessName || !onboardingData.marketId) {
      toast.error("Please fill required fields");
      return;
    }
    await createVendor(
      onboardingData.businessName,
      onboardingData.marketId,
      onboardingData.description,
      onboardingData.stallNumber
    );
    setOnboardingModal(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { url, error } = await uploadImage(file, "product-images");
    if (url) {
      setNewProduct({ ...newProduct, image_url: url });
    }
  };

  const handleCreateProduct = async () => {
    if (!vendor || !newProduct.name || !newProduct.price) {
      toast.error("Please fill required fields");
      return;
    }
    await createProduct({
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      unit: newProduct.unit,
      description: newProduct.description,
      category_id: newProduct.category_id || undefined,
      image_url: newProduct.image_url || undefined,
      vendor_id: vendor.id,
    });
    setProductModal(false);
    setNewProduct({ name: "", price: "", unit: "piece", description: "", category_id: "", image_url: "" });
    refetchProducts();
  };

  const handleOrderAction = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status);
    toast.success(`Order ${status}`);
  };

  if (vendorLoading) {
    return (
      <DashboardLayout role="vendor" title="Vendor Dashboard">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  // Filter orders for this vendor
  const vendorOrders = orders.filter(o => o.vendor_id === vendor?.id);
  const pendingOrders = vendorOrders.filter(o => o.status === "pending");
  const preparingOrders = vendorOrders.filter(o => ["accepted", "preparing"].includes(o.status));
  const completedOrders = vendorOrders.filter(o => o.status === "completed");
  
  const totalEarnings = completedOrders.reduce((sum, o) => sum + Number(o.subtotal || 0), 0);
  const todayOrders = vendorOrders.filter(o => {
    const today = new Date().toDateString();
    return new Date(o.created_at).toDateString() === today;
  });

  return (
    <DashboardLayout role="vendor" title="Vendor Dashboard">
      {/* Onboarding Modal */}
      <Dialog open={onboardingModal} onOpenChange={setOnboardingModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Up Your Vendor Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Business Name *</Label>
              <Input
                placeholder="e.g., Mama Ama's Fresh Produce"
                value={onboardingData.businessName}
                onChange={(e) => setOnboardingData({ ...onboardingData, businessName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Select Market *</Label>
              <Select
                value={onboardingData.marketId}
                onValueChange={(value) => setOnboardingData({ ...onboardingData, marketId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose your market" />
                </SelectTrigger>
                <SelectContent>
                  {markets.map((market) => (
                    <SelectItem key={market.id} value={market.id}>
                      {market.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Stall Number</Label>
              <Input
                placeholder="e.g., A-15"
                value={onboardingData.stallNumber}
                onChange={(e) => setOnboardingData({ ...onboardingData, stallNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Tell customers about your business..."
                value={onboardingData.description}
                onChange={(e) => setOnboardingData({ ...onboardingData, description: e.target.value })}
              />
            </div>
            <Button className="w-full" onClick={handleCreateVendor}>
              Create Vendor Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Pending Orders"
            value={pendingOrders.length}
            icon={Clock}
            variant={pendingOrders.length > 0 ? "secondary" : "default"}
          />
          <DashboardCard
            title="Today's Orders"
            value={todayOrders.length}
            icon={ShoppingCart}
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
            value={vendor?.rating?.toFixed(1) || "0.0"}
            icon={Star}
            variant="gold"
          />
        </div>

        {/* Pending Orders Alert */}
        {pendingOrders.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-secondary/10 border-secondary/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">New Orders Waiting!</p>
                    <p className="text-sm text-muted-foreground">
                      You have {pendingOrders.length} order(s) waiting for your response
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => setActiveTab("orders")}>
                    View Orders
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="catalog">Catalog</TabsTrigger>
            <TabsTrigger value="stock">Stock</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    Recent Orders
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("orders")}>
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {vendorOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                      <p className="text-muted-foreground">No orders yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {vendorOrders.slice(0, 5).map((order) => (
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

              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    Your Products
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("catalog")}>
                      Manage
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {products.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                      <p className="text-muted-foreground mb-4">No products yet</p>
                      <Button size="sm" onClick={() => { setActiveTab("catalog"); setProductModal(true); }}>
                        <Plus className="w-4 h-4 mr-1" /> Add Product
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {products.slice(0, 5).map((product) => (
                        <div key={product.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                          <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
                            {product.image_url ? (
                              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">₵{Number(product.price).toFixed(2)} / {product.unit}</p>
                          </div>
                          <Badge variant={product.is_available ? "default" : "secondary"}>
                            {product.is_available ? "In Stock" : "Out"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4 mt-6">
            {ordersLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : vendorOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold mb-2">No orders yet</h3>
                <p className="text-muted-foreground">Orders from customers will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {vendorOrders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-bold">{order.order_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleString()}
                          </p>
                        </div>
                        <StatusBadge status={order.status as any} />
                      </div>

                      <div className="space-y-2 mb-4 p-3 bg-muted/50 rounded-lg">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.product_name}</span>
                            <span className="font-medium">₵{Number(item.total_price).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <p className="font-display text-lg font-bold">₵{Number(order.total).toFixed(2)}</p>
                        <div className="flex gap-2">
                          {order.status === "pending" && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleOrderAction(order.id, "cancelled")}
                              >
                                <X className="w-4 h-4 mr-1" /> Decline
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => handleOrderAction(order.id, "accepted")}
                              >
                                <Check className="w-4 h-4 mr-1" /> Accept
                              </Button>
                            </>
                          )}
                          {order.status === "accepted" && (
                            <Button 
                              size="sm"
                              onClick={() => handleOrderAction(order.id, "preparing")}
                            >
                              Start Preparing
                            </Button>
                          )}
                          {order.status === "preparing" && (
                            <Button 
                              size="sm" 
                              variant="hero"
                              onClick={() => handleOrderAction(order.id, "ready")}
                            >
                              <Check className="w-4 h-4 mr-1" /> Mark Ready
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

          {/* Catalog Tab */}
          <TabsContent value="catalog" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Your Products</h2>
              <Dialog open={productModal} onOpenChange={setProductModal}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" /> Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Product Image</Label>
                      <div className="flex items-center gap-4">
                        {newProduct.image_url ? (
                          <img src={newProduct.image_url} alt="Preview" className="w-20 h-20 rounded-lg object-cover" />
                        ) : (
                          <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                            <ImagePlus className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Product Name *</Label>
                      <Input
                        placeholder="e.g., Fresh Tomatoes"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Price (₵) *</Label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit</Label>
                        <Select
                          value={newProduct.unit}
                          onValueChange={(value) => setNewProduct({ ...newProduct, unit: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="piece">Piece</SelectItem>
                            <SelectItem value="kg">Kilogram</SelectItem>
                            <SelectItem value="bundle">Bundle</SelectItem>
                            <SelectItem value="bag">Bag</SelectItem>
                            <SelectItem value="bowl">Bowl</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={newProduct.category_id}
                        onValueChange={(value) => setNewProduct({ ...newProduct, category_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Describe your product..."
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      />
                    </div>
                    <Button className="w-full" onClick={handleCreateProduct} disabled={uploading}>
                      {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                      Add Product
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {productsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold mb-2">No products yet</h3>
                <p className="text-muted-foreground mb-6">Add your first product to start selling</p>
                <Button onClick={() => setProductModal(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Add Product
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden shrink-0">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate">{product.name}</p>
                          <p className="text-lg font-display font-bold text-primary">
                            ₵{Number(product.price).toFixed(2)}
                            <span className="text-sm text-muted-foreground font-normal"> / {product.unit}</span>
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={product.is_available ? "default" : "secondary"}>
                              {product.is_available ? "Available" : "Out of Stock"}
                            </Badge>
                            {product.stock_quantity !== null && (
                              <span className="text-xs text-muted-foreground">
                                Stock: {product.stock_quantity}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Stock Tab */}
          <TabsContent value="stock" className="mt-6">
            <StockManagement />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default VendorDashboardNew;
