import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { Button } from './ui/Button';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { settings } = useSettings();

  const cartCount = getCartCount();
  const storeName = settings?.storeName || 'STORE.';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/shop?q=${e.target.value}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-bold text-xl tracking-tight">
            {storeName}
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.path) ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Cart" onClick={() => navigate('/cart')}>
            <div className="relative">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary p-2 rounded-md ${
                isActive(link.path) ? 'bg-muted text-foreground' : 'text-muted-foreground'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-9 pr-4 py-2 border border-border rounded-md text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              onKeyDown={handleSearch}
            />
          </div>
        </div>
      )}
    </header>
  );
}
