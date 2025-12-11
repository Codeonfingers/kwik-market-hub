import { motion } from "framer-motion";
import { Check, Star, Crown, Zap, Package, Truck, Gift, Clock, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

const Subscriptions = () => {
  const plans = [
    {
      name: "Basic",
      price: 200,
      description: "For individuals & small households",
      icon: Package,
      color: "border-border",
      badge: null,
      features: [
        "Up to 2 shopping orders/month",
        "Free delivery above GHS 100",
        "Standard customer support",
        "Access to verified vendors",
      ],
      forWho: ["Students", "Small households", "Young professionals"],
    },
    {
      name: "Premium",
      price: 300,
      description: "For medium families & busy professionals",
      icon: Star,
      color: "border-secondary",
      badge: "Most Popular",
      badgeColor: "bg-secondary text-secondary-foreground",
      features: [
        "Up to 4 shopping orders/month",
        "Free delivery above GHS 100",
        "Priority customer support",
        "Priority shopper assignment",
        "Premium vendor selection",
      ],
      forWho: ["Families", "Working professionals", "Frequent market users"],
    },
    {
      name: "Executive",
      price: 500,
      description: "For high-frequency shoppers & businesses",
      icon: Crown,
      color: "border-gold",
      badge: "Best Value",
      badgeColor: "bg-gold text-gold-foreground",
      features: [
        "Up to 6 orders/month",
        "Free delivery on ALL orders",
        "Ultra-priority support",
        "Executive shopper assignment",
        "Elite vendors access",
        "Free item substitution",
      ],
      forWho: ["Big families", "Executives", "Businesses", "Heavy users"],
    },
  ];

  const addons = [
    {
      icon: Star,
      title: "Extra Shopping Session",
      price: 60,
      description: "Add one more shopping order to your plan",
    },
    {
      icon: Zap,
      title: "Express Shopper Dispatch",
      price: 30,
      description: "Get your shopper assigned within 15 minutes",
    },
    {
      icon: Store,
      title: "Vendor Express Line",
      price: 25,
      description: "Skip the queue with priority vendor access",
    },
    {
      icon: Truck,
      title: "Quick Delivery Upgrade",
      price: 20,
      description: "Same-hour delivery for your order",
    },
    {
      icon: Gift,
      title: "Special Packaging",
      price: 15,
      description: "Premium packaging for gifts or special occasions",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Choose Your Plan
            </Badge>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
              KwikMarket Subscription Plans
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Save more with our flexible subscription packages. Choose the plan that fits your shopping needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={cn(
                  "h-full relative overflow-hidden border-2 transition-all hover:shadow-xl",
                  plan.color,
                  plan.badge && "ring-2 ring-offset-2",
                  plan.name === "Premium" && "ring-secondary",
                  plan.name === "Executive" && "ring-gold"
                )}>
                  {plan.badge && (
                    <div className={cn(
                      "absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold",
                      plan.badgeColor
                    )}>
                      {plan.badge}
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4",
                      plan.name === "Basic" && "bg-muted",
                      plan.name === "Premium" && "bg-secondary/20",
                      plan.name === "Executive" && "bg-gold/20"
                    )}>
                      <plan.icon className={cn(
                        "w-8 h-8",
                        plan.name === "Basic" && "text-muted-foreground",
                        plan.name === "Premium" && "text-secondary",
                        plan.name === "Executive" && "text-gold"
                      )} />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <span className="text-4xl font-display font-bold">GHS {plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>

                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-4 border-t">
                      <p className="text-xs text-muted-foreground font-medium mb-2">Perfect for:</p>
                      <div className="flex flex-wrap gap-1">
                        {plan.forWho.map((who, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {who}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button 
                      className="w-full btn-touch"
                      variant={plan.name === "Premium" ? "hero" : "default"}
                    >
                      Choose {plan.name}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-2xl md:text-4xl font-bold mb-4">
              Enhance Your Experience
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Add extra features to any plan to customize your KwikMarket experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {addons.map((addon, index) => (
              <motion.div
                key={addon.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <addon.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display font-bold mb-1">{addon.title}</h3>
                    <p className="text-2xl font-bold text-primary mb-2">GHS {addon.price}</p>
                    <p className="text-xs text-muted-foreground">{addon.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Subscriptions;
