import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, FolderTree, Settings } from 'lucide-react';
import { api } from '../../lib/api';
import { LoadingState } from '../../components/ui/LoadingState';

export function AdminDashboard() {
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    Promise.all([api.getProducts(), api.getCategories()])
      .then(([products, categories]) => {
        setCounts({
          products: products.length,
          categories: categories.length,
          outOfStock: products.filter((p) => p.stock === 0).length,
        });
      })
      .catch(() => setCounts({ products: 0, categories: 0, outOfStock: 0 }));
  }, []);

  if (!counts) return <LoadingState message="Loading dashboard..." />;

  const cards = [
    { label: 'Products', value: counts.products, icon: Package, link: '/admin/products' },
    { label: 'Categories', value: counts.categories, icon: FolderTree, link: '/admin/categories' },
    { label: 'Out of Stock', value: counts.outOfStock, icon: Settings, link: '/admin/products' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="border border-border rounded-lg p-6 hover:bg-muted transition-colors"
          >
            <card.icon className="w-5 h-5 text-muted-foreground mb-3" />
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm text-muted-foreground">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
