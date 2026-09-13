import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, X, Upload } from 'lucide-react';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/LoadingState';

const emptyForm = {
  name: '',
  slug: '',
  price: '',
  salePrice: '',
  shortDescription: '',
  description: '',
  category: '',
  stock: '',
  isFeatured: false,
  isNewArrival: false,
  isBestSeller: false,
  images: [],
};

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

export function AdminProductForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEditing);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [slugTouched, setSlugTouched] = useState(isEditing);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => setCategories([]));

    if (isEditing) {
      api
        .getProduct(id)
        .then((p) =>
          setForm({
            name: p.name || '',
            slug: p.slug || '',
            price: p.price ?? '',
            salePrice: p.salePrice ?? '',
            shortDescription: p.shortDescription || '',
            description: p.description || '',
            category: p.category?._id || p.category || '',
            stock: p.stock ?? '',
            isFeatured: Boolean(p.isFeatured),
            isNewArrival: Boolean(p.isNewArrival),
            isBestSeller: Boolean(p.isBestSeller),
            images: p.images || [],
          })
        )
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'name' && !slugTouched) {
      setForm((prev) => ({ ...prev, name: value, slug: slugify(value) }));
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded = await Promise.all(files.map((file) => api.uploadImage(file)));
      setForm((prev) => ({ ...prev, images: [...prev.images, ...uploaded.map((u) => u.url)] }));
    } catch (e) {
      setError(`Image upload failed: ${e.message}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (url) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((img) => img !== url) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.images.length === 0) {
      setError('Add at least one product image.');
      return;
    }
    if (!form.category) {
      setError('Select a category.');
      return;
    }

    const payload = {
      name: form.name,
      slug: form.slug,
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : undefined,
      shortDescription: form.shortDescription,
      description: form.description,
      category: form.category,
      stock: Number(form.stock),
      isFeatured: form.isFeatured,
      isNewArrival: form.isNewArrival,
      isBestSeller: form.isBestSeller,
      images: form.images,
    };

    setSaving(true);
    try {
      if (isEditing) {
        await api.updateProduct(id, payload);
      } else {
        await api.createProduct(payload);
      }
      navigate('/admin/products');
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState message="Loading product..." />;

  return (
    <div className="max-w-2xl">
      <Link
        to="/admin/products"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Link>

      <h1 className="text-2xl font-bold tracking-tight mb-6">
        {isEditing ? 'Edit Product' : 'Add Product'}
      </h1>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm font-medium mb-1 block">Product Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Slug</label>
          <input
            required
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              handleChange('slug', slugify(e.target.value));
            }}
            className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Price ($)</label>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => handleChange('price', e.target.value)}
              className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Sale Price ($, optional)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.salePrice}
              onChange={(e) => handleChange('salePrice', e.target.value)}
              className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Category</label>
            <select
              required
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Stock</label>
            <input
              required
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => handleChange('stock', e.target.value)}
              className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Short Description</label>
          <input
            required
            value={form.shortDescription}
            onChange={(e) => handleChange('shortDescription', e.target.value)}
            className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Full Description</label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Images</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {form.images.map((url) => (
              <div key={url} className="relative w-20 h-20">
                <img src={url} alt="" className="w-full h-full object-cover rounded-md border border-border" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute -top-2 -right-2 bg-background border border-border rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <label className="inline-flex items-center gap-2 text-sm font-medium border border-border rounded-md px-3 py-2 cursor-pointer hover:bg-muted">
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload Images'}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isNewArrival}
              onChange={(e) => handleChange('isNewArrival', e.target.checked)}
              className="accent-primary"
            />
            New Arrival
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isBestSeller}
              onChange={(e) => handleChange('isBestSeller', e.target.checked)}
              className="accent-primary"
            />
            Best Seller
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => handleChange('isFeatured', e.target.checked)}
              className="accent-primary"
            />
            Featured
          </label>
        </div>

        <Button type="submit" disabled={saving || uploading}>
          {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish Product'}
        </Button>
      </form>
    </div>
  );
}
