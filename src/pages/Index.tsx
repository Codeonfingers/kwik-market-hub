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
  MapPin,
  MessageCircle,
  Mic,
  Eye,
  CreditCard,
  Package,
  Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MarketCard from "@/components/shared/MarketCard";
import { markets } from "@/lib/mock-data";

const Index = () => {
  const features = [
    {
      icon: ShoppingBasket,
      title: "Pre-Order Convenience",
      description: "Tell us what you need before you reach the market",
      color: "bg-primary",
    },
    {
      icon: Shield,
      title: "Verified Market Women",
      description: "Trusted local sellers you can rely on",
      color: "bg-secondary",
    },
    {
      icon: Users,
      title: "Commission-Based Shoppers",
      description: "Assistants who prepare items for you",
      color: "bg-primary",
    },
    {
      icon: Eye,
      title: "Pay Only After Inspection",
      description: "You approve before paying - no surprises",
      color: "bg-secondary",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Ordering",
      description: "Voice and text ordering coming soon",
      color: "bg-primary",
    },
    {
      icon: CreditCard,
      title: "No Price Surprises",
      description: "Transparent pricing you can trust",
      color: "bg-secondary",
    },
  ];

  const steps = [
    {
      number: "1",
      icon: MapPin,
      title: "Choose a Market",
      description: "Select from Makola, Kaneshie, Kejetia and more",
    },
    {
      number: "2",
      icon: ShoppingBasket,
      title: "Add Items",
      description: "Build your list or send via WhatsApp",
    },
    {
      number: "3",
      icon: CheckCircle2,
      title: "Vendor Accepts",
      description: "Market women confirm your order",
    },
    {
      number: "4",
      icon: Package,
      title: "Items Prepared",
      description: "Fresh items carefully selected",
    },
    {
      number: "5",
      icon: Eye,
      title: "You Inspect",
      description: "Check everything before paying",
    },
    {
      number: "6",
      icon: CreditCard,
      title: "Pay & Receive",
      description: "Pay via MoMo after approval",
    },
  ];

  const roles = [
    {
      icon: ShoppingBasket,
      title: "Shop Fresh",
      description: "Order from your favorite market vendors without the hassle.",
      link: "/consumer",
      cta: "Start Shopping",
      color: "from-primary to-primary/80",
    },
    {
      icon: Store,
      title: "Sell More",
      description: "Reach more customers and grow your market business.",
      link: "/vendor",
      cta: "Vendor Portal",
      color: "from-secondary to-secondary/80",
    },
    {
      icon: Users,
      title: "Earn Daily",
      description: "Become a shopper and earn by helping customers.",
      link: "/shopper",
      cta: "Join as Shopper",
      color: "from-earth to-earth/80",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-20 md:pt-24 pb-12 md:pb-20 overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Star className="w-4 h-4 fill-current" />
                Ghana's #1 Market Platform
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight"
            >
              Shop Smarter at the Market —{" "}
              <span className="text-primary">Order Before You Arrive</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto px-4"
            >
              Pre-order groceries & market items. Verified market women and shoppers 
              prepare them before you arrive. Pay only after inspection.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4"
            >
              <Link to="/consumer" className="w-full sm:w-auto">
                <Button variant="hero" size="touch" className="w-full sm:w-auto">
                  <ShoppingBasket className="w-5 h-5" />
                  Start Your Order
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/how-it-works" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  How KwikMarket Works
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Hero Illustration Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 md:mt-16 max-w-4xl mx-auto"
          >
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/10 to-gold/20 p-6 md:p-10">
              <div className="grid grid-cols-3 gap-3 md:gap-6">
                <div className="bg-card rounded-xl md:rounded-2xl p-3 md:p-6 shadow-lg">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-2 md:mb-4">
                    <Store className="w-5 h-5 md:w-7 md:h-7 text-primary" />
                  </div>
                  <p className="font-display font-bold text-sm md:text-lg">1,200+</p>
                  <p className="text-2xs md:text-sm text-muted-foreground">Vendors</p>
                </div>
                <div className="bg-card rounded-xl md:rounded-2xl p-3 md:p-6 shadow-lg">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-secondary/20 flex items-center justify-center mb-2 md:mb-4">
                    <Users className="w-5 h-5 md:w-7 md:h-7 text-secondary" />
                  </div>
                  <p className="font-display font-bold text-sm md:text-lg">500+</p>
                  <p className="text-2xs md:text-sm text-muted-foreground">Shoppers</p>
                </div>
                <div className="bg-card rounded-xl md:rounded-2xl p-3 md:p-6 shadow-lg">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-gold/20 flex items-center justify-center mb-2 md:mb-4">
                    <Star className="w-5 h-5 md:w-7 md:h-7 text-gold fill-gold" />
                  </div>
                  <p className="font-display font-bold text-sm md:text-lg">4.8</p>
                  <p className="text-2xs md:text-sm text-muted-foreground">Rating</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
              Why Choose KwikMarket?
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Simple, transparent, and designed for the way you shop.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-5 md:p-6">
                    <div className={cn(
                      "w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-3 md:mb-4",
                      feature.color
                    )}>
                      <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-primary-foreground" />
                    </div>
                    <h3 className="font-display text-lg md:text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm md:text-base">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
              How KwikMarket Works
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              6 simple steps to fresh market goods
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative mb-3 md:mb-4">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                    <step.icon className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                  </div>
                  <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-6 h-6 md:w-7 md:h-7 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs md:text-sm font-bold">
                    {step.number}
                  </div>
                </div>
                <h3 className="font-display font-bold text-sm md:text-base mb-1">{step.title}</h3>
                <p className="text-muted-foreground text-xs md:text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Markets */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-12">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                Featured Markets
              </h2>
              <p className="text-muted-foreground text-base md:text-lg">
                Explore Ghana's most popular markets
              </p>
            </div>
            <Link to="/markets">
              <Button variant="outline" className="gap-2">
                View All Markets
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {markets.slice(0, 4).map((market, index) => (
              <MarketCard key={market.id} market={market} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection / Join Community */}
      <section className="py-12 md:py-20 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
              Join the KwikMarket Community
            </h2>
            <p className="text-background/70 text-base md:text-lg max-w-2xl mx-auto">
              Whether you're shopping, selling, or earning – there's a place for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {roles.map((role, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="bg-background/10 border-background/20 h-full hover:bg-background/15 transition-colors">
                  <CardContent className="p-5 md:p-6 flex flex-col h-full">
                    <div className={cn(
                      "w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 md:mb-4",
                      role.color
                    )}>
                      <role.icon className="w-6 h-6 md:w-7 md:h-7 text-primary-foreground" />
                    </div>
                    <h3 className="font-display text-xl md:text-2xl font-bold mb-2 text-background">{role.title}</h3>
                    <p className="text-background/70 text-sm md:text-base mb-4 md:mb-6 flex-grow">{role.description}</p>
                    <Link to={role.link}>
                      <Button variant="secondary" className="w-full gap-2">
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

      {/* WhatsApp & Voice Ordering Preview */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 md:mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
              Coming Soon
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
              Order Your Way
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Soon you'll be able to order via WhatsApp or voice in your language
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full border-2 border-dashed border-primary/30 bg-primary/5">
                <CardContent className="p-5 md:p-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-3 md:mb-4">
                    <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                  </div>
                  <h3 className="font-display text-lg md:text-xl font-bold mb-2">WhatsApp Ordering</h3>
                  <p className="text-muted-foreground text-sm md:text-base mb-4">
                    Send a text or voice note with your shopping list. Our system extracts items 
                    and creates your order automatically.
                  </p>
                  <div className="bg-background rounded-lg p-3 md:p-4 text-sm text-muted-foreground">
                    <p className="italic">"I need 3 tubers of yam, 1 bunch of kontomire, 
                    and 500g of palm nut for fufu..."</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full border-2 border-dashed border-secondary/30 bg-secondary/5">
                <CardContent className="p-5 md:p-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-secondary/20 flex items-center justify-center mb-3 md:mb-4">
                    <Mic className="w-6 h-6 md:w-7 md:h-7 text-secondary" />
                  </div>
                  <h3 className="font-display text-lg md:text-xl font-bold mb-2">Voice Ordering</h3>
                  <p className="text-muted-foreground text-sm md:text-base mb-4">
                    Speak your list in Twi, Ga, Ewe, Hausa, or English. 
                    We'll transcribe and process it for you.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Twi", "Ga", "Ewe", "Hausa", "English"].map((lang) => (
                      <span 
                        key={lang}
                        className="px-3 py-1 rounded-full bg-secondary/20 text-sm font-medium"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-primary-foreground">
              Ready to Shop Smarter?
            </h2>
            <p className="text-primary-foreground/80 text-base md:text-lg max-w-xl mx-auto mb-6 md:mb-8">
              Join thousands of Ghanaians who are already enjoying fresh market goods 
              delivered with care.
            </p>
            <Link to="/consumer">
              <Button variant="secondary" size="touch" className="gap-2">
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
