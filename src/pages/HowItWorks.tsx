import { motion } from "framer-motion";
import { 
  ShoppingCart, 
  Search, 
  Package, 
  CheckCircle2, 
  CreditCard, 
  Star,
  ArrowRight,
  ShoppingBasket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Browse & Select",
      description: "Choose your market and browse through verified vendors. Build your shopping list with fresh produce, spices, and more.",
      color: "primary",
    },
    {
      number: "02",
      icon: ShoppingCart,
      title: "Place Your Order",
      description: "Add items to your cart, include special instructions, and submit your order. Our system matches you with available shoppers.",
      color: "market",
    },
    {
      number: "03",
      icon: Package,
      title: "Shopper Collects",
      description: "A verified kayayo shopper visits the market, carefully selects your items from vendors, and prepares your order.",
      color: "gold",
    },
    {
      number: "04",
      icon: CheckCircle2,
      title: "Inspect & Approve",
      description: "Review photos of your items before payment. Approve what you like, request changes for anything that doesn't meet standards.",
      color: "success",
    },
    {
      number: "05",
      icon: CreditCard,
      title: "Pay & Receive",
      description: "Pay only for approved items via Mobile Money. Receive your fresh market goods or arrange delivery.",
      color: "primary",
    },
    {
      number: "06",
      icon: Star,
      title: "Rate & Review",
      description: "Share your experience. Rate vendors and shoppers to help maintain quality across the platform.",
      color: "gold",
    },
  ];

  const benefits = [
    {
      title: "For Consumers",
      items: [
        "No more long market queues",
        "Transparent pricing",
        "Quality inspection before payment",
        "Access to multiple markets",
        "Real-time order tracking",
      ],
    },
    {
      title: "For Vendors",
      items: [
        "Reach more customers",
        "No delivery hassle",
        "Digital payment records",
        "Build your reputation",
        "Grow your business",
      ],
    },
    {
      title: "For Shoppers",
      items: [
        "Flexible earning hours",
        "Fair compensation",
        "Work in your local market",
        "Build regular customers",
        "Daily settlements",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-24 md:pt-32 pb-16 bg-secondary/30 kente-pattern relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/30 to-background" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              How <span className="text-gradient">KwikMarket</span> Works
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              A simple, transparent process that connects you with Ghana's vibrant markets 
              while ensuring quality and trust at every step.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {index < steps.length - 1 && (
                  <div className="absolute left-8 top-24 bottom-0 w-0.5 bg-border hidden md:block" />
                )}
                <div className="flex gap-6 mb-12">
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 rounded-2xl gradient-${step.color} flex items-center justify-center shadow-lg`}>
                      <step.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl font-display font-bold text-muted-foreground/30">
                        {step.number}
                      </span>
                      <h3 className="font-display text-2xl font-bold">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
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
              Benefits for Everyone
            </h2>
            <p className="text-primary-foreground/70 text-lg">
              KwikMarket creates value for all participants in the marketplace ecosystem.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="bg-primary-foreground/10 border-primary-foreground/20 h-full">
                  <CardContent className="p-6">
                    <h3 className="font-display text-xl font-bold mb-4">{benefit.title}</h3>
                    <ul className="space-y-3">
                      {benefit.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-market flex-shrink-0" />
                          <span className="text-primary-foreground/80">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Join the KwikMarket community today and experience a better way to shop.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/consumer">
                <Button variant="hero" size="lg">
                  <ShoppingBasket className="w-5 h-5" />
                  Start Shopping
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/markets">
                <Button variant="outline" size="lg">
                  Browse Markets
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;
