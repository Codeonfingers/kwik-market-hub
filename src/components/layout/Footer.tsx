import { Link } from "react-router-dom";
import { ShoppingBasket, Facebook, Twitter, Instagram, MapPin, Phone, Mail, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <ShoppingBasket className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">
                <span className="text-primary">Kwik</span>
                <span className="text-secondary">Market</span>
              </span>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed">
              Digitizing Ghana's vibrant markets. Fresh produce, trusted vendors, delivered to you with care.
            </p>
            <div className="flex gap-2">
              <a href="#" className="w-9 h-9 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-background/10 flex items-center justify-center hover:bg-success transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-base mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/markets" className="text-background/70 hover:text-primary transition-colors">Browse Markets</Link></li>
              <li><Link to="/how-it-works" className="text-background/70 hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link to="/vendor" className="text-background/70 hover:text-primary transition-colors">Become a Vendor</Link></li>
              <li><Link to="/shopper" className="text-background/70 hover:text-primary transition-colors">Become a Shopper</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-bold text-base mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Safety Guidelines</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-base mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-background/70">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Accra, Ghana</span>
              </li>
              <li className="flex items-center gap-2 text-background/70">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>+233 XX XXX XXXX</span>
              </li>
              <li className="flex items-center gap-2 text-background/70">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span>hello@kwikmarket.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-background/10 text-center text-background/50 text-sm">
          <p>© {new Date().getFullYear()} KwikMarket. All rights reserved. Made with ❤️ in Ghana.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;