import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { MapPin, Navigation, Package, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import "leaflet/dist/leaflet.css";

// Fix for default markers not showing
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icons
const createCustomIcon = (color: string, emoji: string) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${color}; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3); font-size: 18px;">${emoji}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

const shopperIcon = createCustomIcon("#10b981", "🛒");
const marketIcon = createCustomIcon("#f59e0b", "🏪");
const customerIcon = createCustomIcon("#3b82f6", "📍");

interface Location {
  lat: number;
  lng: number;
  label: string;
}

interface OrderTrackingMapProps {
  shopperLocation?: Location;
  marketLocation?: Location;
  customerLocation?: Location;
  orderStatus?: string;
  shopperName?: string;
  estimatedTime?: string;
}

// Component to update map view when locations change
const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);
  return null;
};

// Component to simulate shopper movement
const useShopperSimulation = (
  initialLocation: Location | undefined,
  targetLocation: Location | undefined,
  isActive: boolean
) => {
  const [currentLocation, setCurrentLocation] = useState(initialLocation);

  useEffect(() => {
    if (!isActive || !initialLocation || !targetLocation) {
      setCurrentLocation(initialLocation);
      return;
    }

    const steps = 20;
    let step = 0;
    const latDiff = (targetLocation.lat - initialLocation.lat) / steps;
    const lngDiff = (targetLocation.lng - initialLocation.lng) / steps;

    const interval = setInterval(() => {
      step++;
      if (step <= steps) {
        setCurrentLocation({
          lat: initialLocation.lat + latDiff * step,
          lng: initialLocation.lng + lngDiff * step,
          label: "Shopper",
        });
      } else {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [initialLocation, targetLocation, isActive]);

  return currentLocation;
};

const OrderTrackingMap = ({
  shopperLocation,
  marketLocation,
  customerLocation,
  orderStatus = "picked_up",
  shopperName = "Kwame A.",
  estimatedTime = "15 mins",
}: OrderTrackingMapProps) => {
  // Default locations (Accra, Ghana)
  const defaultMarket: Location = marketLocation || {
    lat: 5.5560,
    lng: -0.2057,
    label: "Makola Market",
  };

  const defaultCustomer: Location = customerLocation || {
    lat: 5.5620,
    lng: -0.1985,
    label: "Delivery Location",
  };

  const defaultShopper: Location = shopperLocation || {
    lat: 5.5590,
    lng: -0.2020,
    label: "Shopper",
  };

  // Simulate shopper movement
  const isMoving = orderStatus === "picked_up" || orderStatus === "inspecting";
  const currentShopperLocation = useShopperSimulation(
    defaultShopper,
    isMoving ? defaultCustomer : undefined,
    isMoving
  );

  const center: [number, number] = [
    currentShopperLocation?.lat || defaultMarket.lat,
    currentShopperLocation?.lng || defaultMarket.lng,
  ];

  // Path from market to customer via shopper
  const routePath: [number, number][] = [
    [defaultMarket.lat, defaultMarket.lng],
    [currentShopperLocation?.lat || defaultShopper.lat, currentShopperLocation?.lng || defaultShopper.lng],
    [defaultCustomer.lat, defaultCustomer.lng],
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Navigation className="w-5 h-5 text-primary" />
            Live Tracking
          </CardTitle>
          <Badge variant="active" className="animate-pulse">
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Map Container */}
        <div className="h-64 md:h-80 relative">
          <MapContainer
            center={center}
            zoom={14}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={center} />

            {/* Route line */}
            <Polyline
              positions={routePath}
              pathOptions={{ color: "#10b981", weight: 4, dashArray: "10, 10" }}
            />

            {/* Market marker */}
            <Marker position={[defaultMarket.lat, defaultMarket.lng]} icon={marketIcon}>
              <Popup>
                <div className="text-center">
                  <strong>{defaultMarket.label}</strong>
                  <p className="text-sm text-muted-foreground">Pickup Location</p>
                </div>
              </Popup>
            </Marker>

            {/* Shopper marker */}
            {currentShopperLocation && (
              <Marker
                position={[currentShopperLocation.lat, currentShopperLocation.lng]}
                icon={shopperIcon}
              >
                <Popup>
                  <div className="text-center">
                    <strong>{shopperName}</strong>
                    <p className="text-sm text-muted-foreground">On the way</p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Customer marker */}
            <Marker position={[defaultCustomer.lat, defaultCustomer.lng]} icon={customerIcon}>
              <Popup>
                <div className="text-center">
                  <strong>Delivery Location</strong>
                  <p className="text-sm text-muted-foreground">Your address</p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* Shopper Info Bar */}
        <div className="p-4 bg-muted/50 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-market/20 flex items-center justify-center">
                <User className="w-5 h-5 text-market" />
              </div>
              <div>
                <p className="font-semibold">{shopperName}</p>
                <p className="text-sm text-muted-foreground">Your Shopper</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-primary">{estimatedTime}</p>
              <p className="text-sm text-muted-foreground">ETA</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTrackingMap;
