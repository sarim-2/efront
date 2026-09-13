import React from 'react';
import { ProductCard } from './ProductCard';

export function ProductGrid({ products, title }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-8 md:py-12">
      {title && (
        <h2 className="text-2xl font-bold tracking-tight mb-6">{title}</h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
