import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ShoppingBasket, 
  Store, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Smartphone,
  Shield,
  Clock,
  Star,
  MapPin
} from "lucide-react";
import heroImage from "@/assets/hero-market.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MarketCard from "@/components/shared/MarketCard";
import { markets } from "@/lib/mock-data";

const Index = () => {
  const features = [
    {
      icon: ShoppingBasket,
      title: "Shop Your Market",
      description: "Browse vendors, build your shopping list, and let us handle the rest.",
    },
    {
      icon: Shield,
      title: "Inspect Before Payment",
      description: "Review your items before paying. Only pay for what you approve.",
    },
    {
      icon: Users,
      title: "Trusted Shoppers",
      description: "Verified kayayo shoppers carefully select your items.",
    },
    {
      icon: Clock,
      title: "Real-Time Updates",
      description: "Track your order from vendor to your doorstep.",
    },
  ];

  const roles = [
    {
      icon: ShoppingBasket,
      title: "Shop Fresh",
      description: "Order from your favorite market vendors without the hassle.",
      link: "/consumer",
      cta: "Start Shopping",
      variant: "hero" as const,
    },
    {
      icon: Store,
      title: "Sell More",
      description: "Reach more customers and grow your market business.",
      link: "/vendor",
      cta: "Vendor Portal",
      variant: "market" as const,
    },
    {
      icon: Users,
      title: "Earn Daily",
      description: "Become a shopper and earn by helping customers.",
      link: "/shopper",
      cta: "Join as Shopper",
      variant: "gold" as const,
    },
  ];

  const stats = [
    { value: "50K+", label: "Happy Customers" },
    { value: "1,200+", label: "Verified Vendors" },
    { value: "500+", label: "Active Shoppers" },
    { value: "4.8", label: "Average Rating" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Vibrant Ghanaian market with fresh produce" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="gold" className="mb-6 text-base px-4 py-2">
                <Star className="w-4 h-4 mr-2 fill-current" />
                Ghana's #1 Market Platform
              </Badge>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              Your Favorite Market,{" "}
              <span className="text-gradient">Delivered Fresh</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Connect with trusted vendors at Makola, Kaneshie, Kejetia and more. 
              Shop fresh produce, inspect before paying, and get it delivered by verified shoppers.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/consumer">
                <Button variant="hero" size="xl">
                  <ShoppingBasket className="w-6 h-6" />
                  Start Shopping
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="outline" size="lg">
                  How It Works
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="font-display text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                <p className="text-muted-foreground text-sm md:text-base">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              How KwikMarket Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Simple, transparent, and designed for the way you shop.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card variant="glass" className="h-full text-center p-6">
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Markets */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
                Featured Markets
              </h2>
              <p className="text-muted-foreground text-lg">
                Explore Ghana's most popular markets
              </p>
            </div>
            <Link to="/markets">
              <Button variant="ghost" className="hidden md:flex">
                View All Markets
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {markets.map((market, index) => (
              <MarketCard key={market.id} market={market} index={index} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link to="/markets">
              <Button variant="outline">
                View All Markets
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Role Selection */}
      <section className="py-16 md:py-24 bg-foreground text-primary-foreground">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Join the KwikMarket Community
            </h2>
            <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
              Whether you're shopping, selling, or earning – there's a place for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {roles.map((role, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="bg-primary-foreground/10 border-primary-foreground/20 h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="w-14 h-14 rounded-xl bg-primary-foreground/20 flex items-center justify-center mb-4">
                      <role.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-2">{role.title}</h3>
                    <p className="text-primary-foreground/70 mb-6 flex-grow">{role.description}</p>
                    <Link to={role.link}>
                      <Button variant={role.variant} className="w-full">
                        {role.cta}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card variant="gradient" className="overflow-hidden">
            <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  Ready to Shop Smarter?
                </h2>
                <p className="text-muted-foreground text-lg max-w-xl">
                  Join thousands of Ghanaians who are already enjoying fresh market goods 
                  delivered with care.
                </p>
              </div>
              <Link to="/consumer">
                <Button variant="hero" size="xl">
                  Get Started Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
