import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background/80 pb-24 lg:pb-0">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-heading font-bold text-background tracking-wider mb-3">RATNAMAYURI</h3>
            <p className="text-sm leading-relaxed text-background/60">
              Curating India's finest handcrafted jewellery and heritage silk sarees since 2024.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-background tracking-wide mb-4">SHOP</h4>
            <ul className="space-y-2">
              <li><Link to="/products?category=jewellery" className="text-sm text-background/60 hover:text-primary transition-colors">Jewellery</Link></li>
              <li><Link to="/products?category=saree" className="text-sm text-background/60 hover:text-primary transition-colors">Sarees</Link></li>
              <li><Link to="/products" className="text-sm text-background/60 hover:text-primary transition-colors">New Arrivals</Link></li>
              <li><Link to="/products" className="text-sm text-background/60 hover:text-primary transition-colors">Bridal Collection</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-background tracking-wide mb-4">HELP</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-background/60">Shipping & Returns</span></li>
              <li><span className="text-sm text-background/60">Size Guide</span></li>
              <li><span className="text-sm text-background/60">FAQs</span></li>
              <li><span className="text-sm text-background/60">Contact Us</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-background tracking-wide mb-4">CONTACT</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-background/60">hello@ratnamayuri.in</span></li>
              <li><span className="text-sm text-background/60">+91 98765 43210</span></li>
              <li><span className="text-sm text-background/60 leading-relaxed">Mumbai, Maharashtra, India</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-10 pt-6 text-center">
          <p className="text-xs text-background/40">© 2024 RATNAMAYURI. All rights reserved. Handcrafted with love in India.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;