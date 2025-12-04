import { motion } from "framer-motion";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  index?: number;
  onAddToCart?: (product: Product, quantity: number) => void;
}

const ProductCard = ({ product, index = 0, onAddToCart }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart?.(product, quantity);
    setQuantity(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card variant="elevated" className="overflow-hidden group">
        <div className="relative h-40 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {!product.available && (
            <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary">{product.category}</Badge>
          </div>
        </div>
        <CardContent className="pt-4 space-y-3">
          <div>
            <h4 className="font-display font-bold text-lg leading-tight">{product.name}</h4>
            <p className="text-muted-foreground text-sm line-clamp-1">{product.description}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-primary">₵{product.price}</span>
              <span className="text-muted-foreground text-sm">/{product.unit}</span>
            </div>
          </div>

          {product.available && (
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg border border-border overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <Button 
                variant="hero" 
                className="flex-1"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-4 h-4" />
                Add
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
