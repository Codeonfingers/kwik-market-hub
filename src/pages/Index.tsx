import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Store,
  Users,
  Shield,
  Clock,
  MessageCircle,
  Mic,
  Check,
  ArrowRight,
  Star,
  Zap,
  Crown,
  Package,
  Truck,
  Gift,
  Eye,
  CreditCard,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import heroImage from "@/assets/hero-market.jpg";

const features = [
  { icon: Clock, title: "Pre-Order Convenience", description: "Order ahead and have your items ready when you arrive" },
  { icon: Shield, title: "Verified Market Women", description: "All vendors are verified for trust and quality" },
  { icon: Users, title: "Commission Shoppers", description: "Reliable shoppers (Kayayo) handle your pickups" },
  { icon: Store, title: "Transparent Pricing", description: "No hidden fees - see exactly what you pay" },
  { icon: Eye, title: "No Pre-Payment", description: "Pay only after inspecting your items" },
  { icon: MessageCircle, title: "WhatsApp + Voice", description: "Order via WhatsApp or voice notes" },
];

const steps = [
  { step: 1, icon: MapPin, title: "Select Market", description: "Choose your preferred market location" },
  { step: 2, icon: ShoppingBag, title: "Add Items", description: "Build your order via text, voice, or WhatsApp" },
  { step: 3, icon: Check, title: "Vendor Prepares", description: "Vendor accepts and prepares your items" },
  { step: 4, icon: Package, title: "Shopper Picks Up", description: "A trusted shopper collects your order" },
  { step: 5, icon: Eye, title: "Inspect Items", description: "Review quality before you pay" },
  { step: 6, icon: CreditCard, title: "Pay & Enjoy", description: "Pay via Mobile Money after approval" },
];

const plans = [
  {
    name: "Basic",
    price: "200",
    description: "For individuals & small households",
    features: ["Up to 2 shopping orders/month", "Free delivery above GHS 100", "Standard customer support", "Access to verified vendors"],
    forList: ["Students", "Small households", "Young professionals"],
    popular: false,
    bestValue: false,
  },
  {
    name: "Premium",
    price: "300",
    description: "For medium families & busy professionals",
    features: ["Up to 4 shopping orders/month", "Free delivery above GHS 100", "Priority support", "Priority shopper assignment", "Premium vendor selection"],
    forList: ["Families", "Working professionals", "Frequent market users"],
    popular: true,
    bestValue: false,
  },
  {
    name: "Executive",
    price: "500",
    description: "For high-frequency shoppers & businesses",
    features: ["Up to 6 orders/month", "Free delivery on ALL orders", "Ultra-priority support", "Executive shopper assignment", "Elite vendors", "Free substitution"],
    forList: ["Big families", "Executives", "Businesses", "Heavy users"],
    popular: false,
    bestValue: true,
  },
];

const addons = [
  { icon: Star, title: "Extra Shopping Session", price: "60", description: "Add one more order to your plan" },
  { icon: Zap, title: "Express Shopper Dispatch", price: "30", description: "Get a shopper within 15 minutes" },
  { icon: Store, title: "Vendor Express Line", price: "25", description: "Skip the queue at vendor stalls" },
  { icon: Truck, title: "Quick Delivery Upgrade", price: "20", description: "Faster delivery to your location" },
  { icon: Gift, title: "Special Packaging", price: "15", description: "Gift-ready packaging for your items" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-2">
                Ghana&apos;s #1 Market Platform
              </Badge>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Shop Smarter at the Market —{" "}
                <span className="text-gradient">Your Items Ready Before You Arrive</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                Pre-order groceries from trusted market women & verified shoppers. 
                Pay only after inspection.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" variant="hero" className="btn-touch">
                  <Link to="/auth">
                    Start Your Order
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="btn-touch">
                  <Link to="/how-it-works">How KwikMarket Works</Link>
                </Button>
              </div>
              
              <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-market" />
                  <span>No pre-payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-market" />
                  <span>Verified vendors</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-market" />
                  <span>Inspect first</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={heroImage}
                  alt="African market scene"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -left-8 top-20 bg-card p-4 rounded-2xl shadow-xl border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-market flex items-center justify-center">
                    <Package className="w-6 h-6 text-market-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">Order Ready!</p>
                    <p className="text-sm text-muted-foreground">2 min ago</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="absolute -right-4 bottom-32 bg-card p-4 rounded-2xl shadow-xl border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center">
                    <Star className="w-6 h-6 text-gold-foreground fill-current" />
                  </div>
                  <div>
                    <p className="font-semibold">5.0 Rating</p>
                    <p className="text-sm text-muted-foreground">Trusted vendor</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Why Choose KwikMarket?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We make traditional market shopping convenient, safe, and modern
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-none bg-card">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-4">
                      <feature.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h3 className="font-display text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              How KwikMarket Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Six simple steps from order to delivery
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full relative overflow-hidden border-none bg-muted/50">
                  <div className="absolute top-4 right-4 text-6xl font-display font-bold text-primary/10">
                    {step.step}
                  </div>
                  <CardContent className="p-6 relative z-10">
                    <div className="w-10 h-10 rounded-full gradient-secondary flex items-center justify-center mb-4 text-secondary-foreground font-bold">
                      {step.step}
                    </div>
                    <h3 className="font-display text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans Section */}
      <section className="py-20 bg-muted/30" id="pricing">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Subscription Plans
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the plan that fits your shopping needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-secondary text-secondary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                {plan.bestValue && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-gold text-gold-foreground px-4 py-1">
                      <Crown className="w-3 h-3 mr-1" />
                      Best Value
                    </Badge>
                  </div>
                )}
                
                <Card className={`h-full ${plan.popular ? "border-secondary shadow-lg ring-2 ring-secondary/20" : plan.bestValue ? "border-gold shadow-lg ring-2 ring-gold/20" : ""}`}>
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="font-display text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <span className="text-4xl font-display font-bold">GHS {plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-market flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-2">Perfect for:</p>
                      <div className="flex flex-wrap gap-2">
                        {plan.forList.map((item) => (
                          <Badge key={item} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button asChild className="w-full" variant={plan.popular ? "hero" : plan.bestValue ? "gold" : "outline"}>
                      <Link to="/subscriptions">Choose {plan.name}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Add-Ons
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Enhance your experience with these extras
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {addons.map((addon, index) => (
              <motion.div
                key={addon.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full text-center hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
                      <addon.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{addon.title}</h3>
                    <p className="text-xl font-display font-bold text-market mb-2">GHS {addon.price}</p>
                    <p className="text-xs text-muted-foreground">{addon.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Voice & WhatsApp Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-market/10 text-market border-market/20">Coming Soon</Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Order Your Way
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Send a WhatsApp message or voice note with your shopping list. 
                Our AI will parse your order and connect you with the best vendors.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-card rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">WhatsApp Ordering</h3>
                    <p className="text-sm text-muted-foreground">Text your shopping list directly</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-card rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Mic className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Voice Ordering</h3>
                    <p className="text-sm text-muted-foreground">Speak naturally in any language</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="p-6 bg-card">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                      👤
                    </div>
                    <div className="bg-muted rounded-2xl rounded-tl-none p-4 max-w-xs">
                      <p className="text-sm">I need 2kg tomatoes, 1 bunch plantain, and some fresh tilapia from Makola market</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none p-4 max-w-xs">
                      <p className="text-sm">Got it! I found 3 verified vendors with your items. Your order total is GHS 45. Ready to confirm?</p>
                    </div>
                    <div className="w-10 h-10 rounded-full gradient-market flex items-center justify-center text-lg">
                      🛒
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Ready to Shop Smarter?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
              Join thousands of Ghanaians who trust KwikMarket for their daily shopping needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="btn-touch">
                <Link to="/auth">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="btn-touch border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/markets">Browse Markets</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
