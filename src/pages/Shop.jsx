import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, SlidersHorizontal } from 'lucide-react';
import { ProductGrid } from '../components/ProductGrid';
import { SearchBar } from '../components/SearchBar';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingState } from '../components/ui/LoadingState';
import { Button } from '../components/ui/Button';
import { api } from '../lib/api';

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState(null);

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

  const query = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || '';
  const sortBy = searchParams.get('sort') || 'featured';
  const priceRange = searchParams.get('price') || '';
  const isSale = searchParams.get('sale') === 'true';

  if (!products || !categories) {
    return <LoadingState message="Loading products..." />;
  }

  let filteredProducts = [...products];

  // Search Filter
  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
    );
  }

  // Category Filter (category is a populated object: { _id, name, slug })
  if (categoryFilter) {
    filteredProducts = filteredProducts.filter((p) => p.category?.slug === categoryFilter);
  }

  // Sale Filter
  if (isSale) {
    filteredProducts = filteredProducts.filter((p) => p.salePrice && p.salePrice < p.price);
  }

  // Price Filter
  if (priceRange) {
    const [min, max] = priceRange.split('-').map(Number);
    filteredProducts = filteredProducts.filter((p) => {
      const price = p.salePrice || p.price;
      if (max) return price >= min && price <= max;
      return price >= min;
    });
  }

  // Sorting
  switch (sortBy) {
    case 'price-low':
      filteredProducts.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
      break;
    case 'newest':
      filteredProducts.sort((a, b) => (b.isNewArrival === a.isNewArrival) ? 0 : b.isNewArrival ? 1 : -1);
      break;
    default: // featured
      filteredProducts.sort((a, b) => (b.isBestSeller === a.isBestSeller) ? 0 : b.isBestSeller ? 1 : -1);
  }

  const updateParam = (key, value) => {
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setIsMobileFiltersOpen(false);
  };

  const filterContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Category</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={!categoryFilter}
              onChange={() => updateParam('category', '')}
              className="accent-primary"
            />
            <span className="text-sm">All Categories</span>
          </label>
          {categories.map((c) => (
            <label key={c._id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={categoryFilter === c.slug}
                onChange={() => updateParam('category', c.slug)}
                className="accent-primary"
              />
              <span className="text-sm">{c.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Price Range</h3>
        <div className="space-y-2">
          {[
            { label: 'All Prices', value: '' },
            { label: 'Under $25', value: '0-25' },
            { label: '$25 to $50', value: '25-50' },
            { label: '$50 to $100', value: '50-100' },
            { label: 'Over $100', value: '100-99999' }
          ].map((range) => (
            <label key={range.label} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={priceRange === range.value}
                onChange={() => updateParam('price', range.value)}
                className="accent-primary"
              />
              <span className="text-sm">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Offers</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isSale}
            onChange={(e) => updateParam('sale', e.target.checked ? 'true' : '')}
            className="accent-primary rounded"
          />
          <span className="text-sm">On Sale</span>
        </label>
      </div>

      <Button variant="outline" className="w-full" onClick={clearFilters}>
        Clear Filters
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Shop</h1>
          <p className="text-muted-foreground">Showing {filteredProducts.length} results</p>
        </div>

        <div className="flex flex-col sm:flex-row w-full md:w-auto items-center gap-4">
          <SearchBar className="w-full sm:w-64" placeholder="Search products..." />

          <div className="flex w-full sm:w-auto gap-2">
            <select
              className="flex-1 sm:w-48 h-9 rounded-md border border-border bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              value={sortBy}
              onChange={(e) => updateParam('sort', e.target.value)}
            >
              <option value="featured">Sort by Featured</option>
              <option value="newest">Sort by Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            <Button
              variant="outline"
              className="md:hidden flex-shrink-0"
              onClick={() => setIsMobileFiltersOpen(true)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center gap-2 font-semibold mb-6">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </div>
            {filterContent}
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <EmptyState
              title="No products found"
              description="Try adjusting your filters or search query to find what you're looking for."
              actionText="Clear All Filters"
              actionLink="/shop"
              icon={Filter}
            />
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileFiltersOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-[80%] max-w-sm bg-background p-6 shadow-xl flex flex-col h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 font-semibold">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileFiltersOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            {filterContent}
          </div>
        </div>
      )}
    </div>
  );
}
