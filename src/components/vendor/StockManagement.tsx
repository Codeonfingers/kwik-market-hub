import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  Edit2, 
  Check, 
  X,
  Bell,
  Settings
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number | null;
  is_available: boolean | null;
  image_url: string | null;
}

interface StockManagementProps {
  products: Product[];
  onUpdateStock: (productId: string, quantity: number) => Promise<void>;
  onToggleAvailability: (productId: string, available: boolean) => Promise<void>;
  lowStockThreshold?: number;
}

const StockManagement = ({ 
  products, 
  onUpdateStock, 
  onToggleAvailability,
  lowStockThreshold = 10 
}: StockManagementProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [autoDisable, setAutoDisable] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [threshold, setThreshold] = useState(lowStockThreshold);

  const lowStockProducts = products.filter(
    (p) => p.stock_quantity !== null && p.stock_quantity <= threshold && p.stock_quantity > 0
  );
  
  const outOfStockProducts = products.filter(
    (p) => p.stock_quantity !== null && p.stock_quantity === 0
  );

  const handleSaveStock = async (productId: string) => {
    const newQuantity = parseInt(editValue);
    if (isNaN(newQuantity) || newQuantity < 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    await onUpdateStock(productId, newQuantity);
    
    // Auto-disable if out of stock
    if (autoDisable && newQuantity === 0) {
      await onToggleAvailability(productId, false);
      toast.info("Product auto-disabled due to zero stock");
    }
    
    setEditingId(null);
    setEditValue("");
  };

  const getStockStatus = (quantity: number | null) => {
    if (quantity === null) return { label: "Untracked", variant: "secondary" as const, color: "text-muted-foreground" };
    if (quantity === 0) return { label: "Out of Stock", variant: "destructive" as const, color: "text-destructive" };
    if (quantity <= threshold) return { label: "Low Stock", variant: "pending" as const, color: "text-gold" };
    return { label: "In Stock", variant: "success" as const, color: "text-market" };
  };

  return (
    <div className="space-y-6">
      {/* Alerts Section */}
      <AnimatePresence>
        {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="border-gold/50 bg-gold/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-gold" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gold">Stock Alerts</h4>
                    <div className="text-sm text-muted-foreground mt-1 space-y-1">
                      {outOfStockProducts.length > 0 && (
                        <p className="text-destructive">
                          {outOfStockProducts.length} product{outOfStockProducts.length > 1 ? "s" : ""} out of stock
                        </p>
                      )}
                      {lowStockProducts.length > 0 && (
                        <p>
                          {lowStockProducts.length} product{lowStockProducts.length > 1 ? "s" : ""} running low
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with Settings */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl font-bold">Stock Management</h3>
          <p className="text-sm text-muted-foreground">Track inventory and manage availability</p>
        </div>
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Stock Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-disable when out of stock</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically hide products when stock reaches 0
                  </p>
                </div>
                <Switch checked={autoDisable} onCheckedChange={setAutoDisable} />
              </div>
              <div className="space-y-2">
                <Label>Low stock threshold</Label>
                <Input
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(parseInt(e.target.value) || 10)}
                  min={1}
                />
                <p className="text-xs text-muted-foreground">
                  Alert when stock falls to or below this number
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products List */}
      <div className="space-y-3">
        {products.map((product, index) => {
          const status = getStockStatus(product.stock_quantity);
          const isEditing = editingId === product.id;
          const stockPercentage = product.stock_quantity !== null 
            ? Math.min((product.stock_quantity / 100) * 100, 100) 
            : 0;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`transition-colors ${
                product.stock_quantity === 0 ? "border-destructive/30 bg-destructive/5" :
                product.stock_quantity !== null && product.stock_quantity <= threshold 
                  ? "border-gold/30 bg-gold/5" : ""
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium truncate">{product.name}</span>
                        <Badge variant={status.variant} className="text-xs">
                          {status.label}
                        </Badge>
                      </div>
                      
                      {product.stock_quantity !== null && (
                        <Progress 
                          value={stockPercentage} 
                          className="h-1.5 mt-2"
                        />
                      )}
                    </div>

                    {/* Stock Control */}
                    <div className="flex items-center gap-3">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-20 h-9"
                            min={0}
                            autoFocus
                          />
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-9 w-9 text-market"
                            onClick={() => handleSaveStock(product.id)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-9 w-9"
                            onClick={() => setEditingId(null)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="text-right">
                            <p className={`font-display text-lg font-bold ${status.color}`}>
                              {product.stock_quantity ?? "—"}
                            </p>
                            <p className="text-xs text-muted-foreground">in stock</p>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9"
                            onClick={() => {
                              setEditingId(product.id);
                              setEditValue(String(product.stock_quantity ?? 0));
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}

                      {/* Availability Toggle */}
                      <Switch
                        checked={product.is_available ?? true}
                        onCheckedChange={(checked) => onToggleAvailability(product.id, checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default StockManagement;
