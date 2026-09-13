import React from 'react';
import { Link } from 'react-router-dom';

export function CategoryCard({ category }) {
  if (!category) return null;

  return (
    <Link
      to={`/category/${category.slug}`}
      className="group relative rounded-lg overflow-hidden aspect-[4/3] bg-muted block"
    >
      {category.image ? (
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground font-medium">
          {category.name}
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
        <h3 className="text-white font-semibold text-lg tracking-tight group-hover:underline">
          {category.name}
        </h3>
      </div>
    </Link>
  );
}
