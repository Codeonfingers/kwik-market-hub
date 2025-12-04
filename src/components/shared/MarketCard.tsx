import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Star, Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Market } from "@/types";

interface MarketCardProps {
  market: Market;
  index?: number;
}

const MarketCard = ({ market, index = 0 }: MarketCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/markets/${market.id}`}>
        <Card variant="market" className="overflow-hidden group cursor-pointer">
          <div className="relative h-48 overflow-hidden">
            <img
              src={market.image}
              alt={market.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="font-display text-xl font-bold text-primary-foreground mb-1">
                {market.name}
              </h3>
              <div className="flex items-center gap-2 text-primary-foreground/90 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{market.location}</span>
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <Badge variant="gold" className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                {market.rating}
              </Badge>
            </div>
          </div>
          <CardContent className="pt-4">
            <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
              {market.description}
            </p>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{market.operatingHours}</span>
              </div>
              <div className="flex items-center gap-2 text-market font-medium">
                <Users className="w-4 h-4" />
                <span>{market.vendorCount} vendors</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default MarketCard;
