import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';

export function AdminProducts() {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState(null);

  const load = () => {
    api.getProducts().then(setProducts).catch((e) => setError(e.message));
  };

  useEffect(load, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.deleteProduct(id);
      load();
    } catch (e) {
      alert(`Failed to delete: ${e.message}`);
    }
  };

  if (error) return <p className="text-red-600 text-sm">{error}</p>;
  if (!products) return <LoadingState message="Loading products..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <Link to="/admin/products/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <EmptyState
          title="No products yet"
          description="Add your first product to see it appear on the storefront."
          actionText="Add Product"
          actionLink="/admin/products/new"
        />
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={p.images?.[0]}
                      alt={p.name}
                      className="w-10 h-10 rounded object-cover bg-muted flex-shrink-0"
                    />
                    <span className="font-medium line-clamp-1">{p.name}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category?.name || '—'}</td>
                  <td className="px-4 py-3">
                    ${p.price.toFixed(2)}
                    {p.salePrice ? (
                      <span className="text-muted-foreground line-through ml-1">
                        ${p.salePrice.toFixed(2)}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    {p.stock === 0 ? (
                      <span className="text-red-600 font-medium">Out of stock</span>
                    ) : (
                      p.stock
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/products/${p._id}/edit`}>
                        <Button variant="ghost" size="icon" aria-label="Edit">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete"
                        onClick={() => handleDelete(p._id, p.name)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
