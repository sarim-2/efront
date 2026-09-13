import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductGrid } from '../components/ProductGrid';
import { CategoryCard } from '../components/CategoryCard';
import { LoadingState } from '../components/ui/LoadingState';
import { api } from '../lib/api';
import { useSettings } from '../context/SettingsContext';
import { MessageCircle } from 'lucide-react';

export function Home() {
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState(null);
  const { settings } = useSettings();

  useEffect(() => {
    Promise.all([api.getProducts(), api.getCategories()])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
      })
      .catch(() => {
        setProducts([]);
        setCategories([]);
      });
  }, []);

  if (!products || !categories) {
    return <LoadingState message="Loading store..." />;
  }

  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const whatsappGroupLink = settings?.whatsappGroupLink;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-muted py-20 md:py-32 flex items-center justify-center text-center px-4">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <span className="text-sm font-medium tracking-wider uppercase mb-4 text-muted-foreground">Spring Collection 2026</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground">
            Essentials for Everyday Life
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
            Discover our curated collection of high-quality, minimalist products designed to elevate your daily routine.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8"
            >
              Shop Now
            </Link>
            {categories[0] && (
              <Link
                to={`/category/${categories[0].slug}`}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary border border-border bg-background hover:bg-muted hover:text-foreground h-10 px-8"
              >
                View Collections
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 flex-1">
        {/* Categories Section */}
        {categories.length > 0 && (
          <section className="py-12 md:py-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Shop by Category</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <CategoryCard key={category._id} category={category} />
              ))}
            </div>
          </section>
        )}

        {/* New Arrivals */}
        {newArrivals.length > 0 && (
          <section className="py-12 md:py-16 border-t border-border">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight">New Arrivals</h2>
              <Link to="/shop" className="text-sm font-medium hover:underline underline-offset-4">
                View All
              </Link>
            </div>
            <ProductGrid products={newArrivals} />
          </section>
        )}

        {/* Promotional Section */}
        <section className="py-12 md:py-16">
          <div className="bg-muted rounded-xl overflow-hidden flex flex-col md:flex-row items-center">
            <div className="p-8 md:p-12 md:w-1/2 flex flex-col items-start text-left">
              <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded mb-4 uppercase tracking-wider">Limited Time Offer</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Summer Sale is Here</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Get up to 30% off on selected items. Upgrade your everyday essentials without breaking the bank.
              </p>
              <Link
                to="/shop?sale=true"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8"
              >
                Shop Sale
              </Link>
            </div>
            <div className="md:w-1/2 h-64 md:h-full min-h-[300px] relative w-full">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
                alt="Store promotion"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Best Sellers */}
        {bestSellers.length > 0 && (
          <section className="py-12 md:py-16 border-t border-border">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Best Sellers</h2>
              <Link to="/shop" className="text-sm font-medium hover:underline underline-offset-4">
                View All
              </Link>
            </div>
            <ProductGrid products={bestSellers} />
          </section>
        )}

        {/* WhatsApp Group CTA — only shown once a group link is configured in Store Settings */}
        {whatsappGroupLink && (
          <section className="py-12 md:py-16 border-t border-border">
            <div className="bg-green-50 rounded-xl p-8 md:p-12 text-center max-w-3xl mx-auto border border-green-100">
              <div className="flex justify-center mb-6">
                <div className="bg-green-500 p-4 rounded-full text-white">
                  <MessageCircle className="w-8 h-8" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-green-950">Join Our WhatsApp Community</h2>
              <p className="text-green-800 mb-8 max-w-lg mx-auto">
                Get exclusive early access to drops, special community-only discounts, and direct support from our team.
              </p>
              <a
                href={whatsappGroupLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-700 bg-green-600 text-white hover:bg-green-700 h-11 px-8 gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Join WhatsApp Group
              </a>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
