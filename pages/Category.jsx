import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductGrid } from '../components/ProductGrid';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingState } from '../components/ui/LoadingState';
import { ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';

export function Category() {
  const { slug } = useParams();
  const [categories, setCategories] = useState(null);
  const [products, setProducts] = useState(null);

  useEffect(() => {
    Promise.all([api.getCategories(), api.getProducts()])
      .then(([c, p]) => {
        setCategories(c);
        setProducts(p);
      })
      .catch(() => {
        setCategories([]);
        setProducts([]);
      });
  }, []);

  if (!categories || !products) {
    return <LoadingState message="Loading category..." />;
  }

  const category = categories.find((c) => c.slug === slug);
  const categoryProducts = products.filter((p) => p.category?.slug === slug);

  if (!category) {
    return <EmptyState title="Category not found" description="The category you are looking for does not exist." actionText="Back to Shop" actionLink="/shop" />;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Link to="/shop" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Shop
      </Link>

      <div className="mb-12 relative rounded-xl overflow-hidden h-64 md:h-80 flex items-center justify-center">
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{category.name}</h1>
          <p className="text-lg opacity-90 max-w-lg mx-auto px-4">
            Explore our collection of {category.name.toLowerCase()} products.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Products</h2>
        <p className="text-muted-foreground">{categoryProducts.length} items</p>
      </div>

      {categoryProducts.length > 0 ? (
        <ProductGrid products={categoryProducts} />
      ) : (
        <EmptyState
          title="No products yet"
          description="We're currently restocking this category. Check back later!"
        />
      )}
    </div>
  );
}
