import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Filter, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MarketCard from "@/components/shared/MarketCard";
import { markets } from "@/lib/mock-data";

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
      <section className="pt-24 md:pt-32 pb-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Explore Ghana's Markets
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find vendors, discover products, and shop from the markets you love.
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search markets or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg rounded-2xl border-2 focus:border-primary"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Region Filter */}
      <section className="py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {regions.map((region) => (
              <Button
                key={region.id}
                variant={selectedRegion === region.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRegion(region.id)}
                className="whitespace-nowrap"
              >
                {region.id !== "all" && <MapPin className="w-4 h-4 mr-1" />}
                {region.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Markets Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredMarkets.length}</span> markets
            </p>
            <Button variant="ghost" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Sort by Rating
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMarkets.map((market, index) => (
              <MarketCard key={market.id} market={market} index={index} />
            ))}
          </div>

          {filteredMarkets.length === 0 && (
            <div className="text-center py-16">
              <MapPin className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold mb-2">No markets found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Markets;
