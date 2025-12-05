import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Filter, SlidersHorizontal, Star, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MarketCard from "@/components/shared/MarketCard";
import { markets } from "@/lib/mock-data";
import { Link } from "react-router-dom";

const Markets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const regions = [
    { id: "all", name: "All Regions" },
    { id: "greater-accra", name: "Greater Accra" },
    { id: "ashanti", name: "Ashanti" },
    { id: "western", name: "Western" },
    { id: "central", name: "Central" },
  ];

  const filteredMarkets = markets.filter(
    (market) =>
      market.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-20 md:pt-24 pb-8 md:pb-12 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6 md:mb-8"
          >
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
              Explore Ghana's Markets
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Find vendors, discover products, and shop from the markets you love.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search markets or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 md:h-14 text-base md:text-lg rounded-xl border-2 focus:border-primary"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Region Filter */}
      <section className="py-4 md:py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
            {regions.map((region) => (
              <Button
                key={region.id}
                variant={selectedRegion === region.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRegion(region.id)}
                className="whitespace-nowrap flex-shrink-0"
              >
                {region.id !== "all" && <MapPin className="w-4 h-4 mr-1" />}
                {region.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Markets Grid */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <p className="text-muted-foreground text-sm md:text-base">
              Showing <span className="font-semibold text-foreground">{filteredMarkets.length}</span> markets
            </p>
            <Button variant="ghost" size="sm" className="text-sm">
              <Filter className="w-4 h-4 mr-1" />
              Sort
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredMarkets.map((market, index) => (
              <motion.div
                key={market.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link to={`/consumer?market=${market.id}`}>
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
                    <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                      <img
                        src={market.image || "/placeholder.svg"}
                        alt={market.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-display text-lg md:text-xl font-bold text-background mb-1">
                          {market.name}
                        </h3>
                        <div className="flex items-center gap-1 text-background/80 text-sm">
                          <MapPin className="w-3 h-3" />
                          <span>{market.location}</span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-3 md:p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-secondary fill-secondary" />
                          <span className="font-medium text-sm">{market.rating || "4.5"}</span>
                          <span className="text-muted-foreground text-xs">({market.vendorCount || 120}+ vendors)</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredMarkets.length === 0 && (
            <div className="text-center py-12 md:py-16">
              <MapPin className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-display text-lg md:text-xl font-bold mb-2">No markets found</h3>
              <p className="text-muted-foreground text-sm md:text-base">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Markets;