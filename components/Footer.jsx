import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

export function Footer() {
  const { settings } = useSettings();
  const storeName = settings?.storeName || 'STORE.';

  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="font-bold text-xl tracking-tight mb-4 inline-block">
              {storeName}
            </Link>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              Minimalist e-commerce foundation for modern storefronts. Focus on quality, clean design, and user experience.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/shop" className="hover:text-foreground transition-colors">All Products</Link></li>
              <li><Link to="/category/electronics" className="hover:text-foreground transition-colors">Electronics</Link></li>
              <li><Link to="/category/clothing" className="hover:text-foreground transition-colors">Clothing</Link></li>
              <li><Link to="/category/home-and-garden" className="hover:text-foreground transition-colors">Home & Garden</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Track Order</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              />
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {storeName} All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
