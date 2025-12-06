import { useState } from "react";
import { motion } from "framer-motion";
import { Truck, MapPin, Clock, DollarSign, ChevronRight, Package, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface CourierProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  estimatedTime: string;
  estimatedPrice: string;
  available: boolean;
  rating: number;
}

interface CourierIntegrationProps {
  orderId?: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  packageWeight?: number;
  onCourierSelected?: (courier: CourierProvider) => void;
}

const courierProviders: CourierProvider[] = [
  {
    id: "local",
    name: "KwikMarket Shopper",
    logo: "🛒",
    description: "Our trusted shoppers deliver your order",
    estimatedTime: "30-45 mins",
    estimatedPrice: "₵5-15",
    available: true,
    rating: 4.8,
  },
  {
    id: "bolt",
    name: "Bolt Delivery",
    logo: "⚡",
    description: "Fast city-wide delivery via Bolt",
    estimatedTime: "20-30 mins",
    estimatedPrice: "₵10-25",
    available: true,
    rating: 4.5,
  },
  {
    id: "dhl",
    name: "DHL Express",
    logo: "📦",
    description: "Premium delivery for larger packages",
    estimatedTime: "1-2 hours",
    estimatedPrice: "₵30-50",
    available: true,
    rating: 4.7,
  },
  {
    id: "uber",
    name: "Uber Connect",
    logo: "🚗",
    description: "On-demand delivery via Uber",
    estimatedTime: "25-40 mins",
    estimatedPrice: "₵15-30",
    available: false,
    rating: 4.4,
  },
  {
    id: "glovo",
    name: "Glovo",
    logo: "📱",
    description: "Multi-category delivery service",
    estimatedTime: "30-45 mins",
    estimatedPrice: "₵12-28",
    available: false,
    rating: 4.3,
  },
];

const CourierIntegration = ({
  orderId,
  pickupAddress = "Makola Market, Accra",
  deliveryAddress = "",
  packageWeight = 2,
  onCourierSelected,
}: CourierIntegrationProps) => {
  const [selectedCourier, setSelectedCourier] = useState<string>("local");
  const [step, setStep] = useState<"select" | "details" | "confirm">("select");
  const [deliveryDetails, setDeliveryDetails] = useState({
    address: deliveryAddress,
    phone: "",
    instructions: "",
  });

  const selectedProvider = courierProviders.find((c) => c.id === selectedCourier);

  const handleSelectCourier = (courierId: string) => {
    const provider = courierProviders.find((c) => c.id === courierId);
    if (provider && !provider.available) {
      toast.error(`${provider.name} is not available in your area yet`);
      return;
    }
    setSelectedCourier(courierId);
  };

  const handleProceed = () => {
    if (step === "select") {
      setStep("details");
    } else if (step === "details") {
      if (!deliveryDetails.address || !deliveryDetails.phone) {
        toast.error("Please fill in all required fields");
        return;
      }
      setStep("confirm");
    } else {
      // Handle courier booking
      if (selectedProvider) {
        onCourierSelected?.(selectedProvider);
        toast.success(`Booking ${selectedProvider.name} delivery...`);
        
        // Simulate API call for external courier
        if (selectedProvider.id !== "local") {
          toast.info(`Redirecting to ${selectedProvider.name}...`, {
            description: "You'll complete the booking on their platform",
          });
        }
      }
    }
  };

  const handleBack = () => {
    if (step === "details") {
      setStep("select");
    } else if (step === "confirm") {
      setStep("details");
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-primary" />
          {step === "select" && "Choose Delivery Method"}
          {step === "details" && "Delivery Details"}
          {step === "confirm" && "Confirm Booking"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Step 1: Select Courier */}
        {step === "select" && (
          <RadioGroup value={selectedCourier} onValueChange={handleSelectCourier}>
            <div className="space-y-3">
              {courierProviders.map((courier) => (
                <motion.div
                  key={courier.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Label
                    htmlFor={courier.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedCourier === courier.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    } ${!courier.available ? "opacity-50" : ""}`}
                  >
                    <RadioGroupItem value={courier.id} id={courier.id} disabled={!courier.available} />
                    <div className="text-2xl">{courier.logo}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{courier.name}</span>
                        {!courier.available && (
                          <Badge variant="secondary">Coming Soon</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{courier.description}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {courier.estimatedTime}
                        </span>
                        <span className="flex items-center gap-1 text-market font-medium">
                          <DollarSign className="w-3 h-3" />
                          {courier.estimatedPrice}
                        </span>
                        <span className="text-gold">★ {courier.rating}</span>
                      </div>
                    </div>
                    {courier.available && (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </Label>
                </motion.div>
              ))}
            </div>
          </RadioGroup>
        )}

        {/* Step 2: Delivery Details */}
        {step === "details" && (
          <div className="space-y-4">
            <div>
              <Label>Pickup Location</Label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg mt-1">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{pickupAddress}</span>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Delivery Address *</Label>
              <Input
                id="address"
                placeholder="Enter your delivery address"
                value={deliveryDetails.address}
                onChange={(e) => setDeliveryDetails({ ...deliveryDetails, address: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g., 024 123 4567"
                value={deliveryDetails.phone}
                onChange={(e) => setDeliveryDetails({ ...deliveryDetails, phone: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
              <Textarea
                id="instructions"
                placeholder="Any special instructions for the delivery..."
                value={deliveryDetails.instructions}
                onChange={(e) => setDeliveryDetails({ ...deliveryDetails, instructions: e.target.value })}
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === "confirm" && selectedProvider && (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{selectedProvider.logo}</div>
                <div>
                  <h3 className="font-semibold">{selectedProvider.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedProvider.estimatedTime}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Package className="w-4 h-4 mt-0.5 text-primary" />
                  <div>
                    <span className="font-medium">Pickup:</span>
                    <p className="text-muted-foreground">{pickupAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-market" />
                  <div>
                    <span className="font-medium">Delivery:</span>
                    <p className="text-muted-foreground">{deliveryDetails.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl">
              <span className="font-medium">Estimated Delivery Fee</span>
              <span className="text-xl font-bold text-market">{selectedProvider.estimatedPrice}</span>
            </div>

            {selectedProvider.id !== "local" && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ExternalLink className="w-4 h-4" />
                <span>You'll be redirected to {selectedProvider.name} to complete booking</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          {step !== "select" && (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              Back
            </Button>
          )}
          <Button variant="hero" onClick={handleProceed} className="flex-1">
            {step === "confirm" ? "Book Delivery" : "Continue"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourierIntegration;
