import { Link } from "react-router-dom";
import { ShoppingBasket, Facebook, Twitter, Instagram, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <ShoppingBasket className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display text-2xl font-bold">
                Kwik<span className="text-primary">Market</span>
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Digitizing Ghana's vibrant markets. Fresh produce, trusted vendors, delivered to you with care.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/markets" className="text-primary-foreground/70 hover:text-primary transition-colors">Browse Markets</Link></li>
              <li><Link to="/how-it-works" className="text-primary-foreground/70 hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link to="/vendor" className="text-primary-foreground/70 hover:text-primary transition-colors">Become a Vendor</Link></li>
              <li><Link to="/shopper" className="text-primary-foreground/70 hover:text-primary transition-colors">Become a Shopper</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors">Safety Guidelines</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-primary-foreground/70">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Accra, Ghana</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70">
                <Phone className="w-5 h-5 text-primary" />
                <span>+233 XX XXX XXXX</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70">
                <Mail className="w-5 h-5 text-primary" />
                <span>hello@kwikmarket.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center text-primary-foreground/50 text-sm">
          <p>© {new Date().getFullYear()} KwikMarket. All rights reserved. Made with ❤️ in Ghana.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
