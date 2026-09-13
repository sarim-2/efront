import React from 'react';
import { Link } from 'react-router-dom';

export function ProductCard({ product }) {
  const isSale = product.salePrice && product.salePrice < product.price;
  const inStock = product.stock > 0;
  const image = product.images?.[0];
  const categoryName = product.category?.name || '';

  return (
    <Link to={`/product/${product._id}`} className="group flex flex-col gap-3 transition-opacity hover:opacity-90 relative">
      <div className="aspect-[4/5] relative overflow-hidden bg-muted rounded-md">
        <img
          src={image}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {!inStock && (
            <span className="bg-background/90 px-2 py-1 text-xs font-medium rounded">
              Out of stock
            </span>
          )}
          {product.isNewArrival && inStock && (
            <span className="bg-primary text-primary-foreground px-2 py-1 text-xs font-medium rounded">
              New
            </span>
          )}
          {isSale && inStock && (
            <span className="bg-red-600 text-white px-2 py-1 text-xs font-medium rounded">
              Sale
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {categoryName && (
          <p className="text-xs text-muted-foreground capitalize">{categoryName}</p>
        )}
        <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-2">
          {isSale ? (
            <>
              <span className="font-medium text-sm">${product.salePrice.toFixed(2)}</span>
              <span className="text-xs text-muted-foreground line-through">${product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="font-medium text-sm">${product.price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
