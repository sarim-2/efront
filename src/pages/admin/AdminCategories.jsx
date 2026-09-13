import React, { useEffect, useState } from 'react';
import { Trash2, Upload } from 'lucide-react';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/LoadingState';

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

export function AdminCategories() {
  const [categories, setCategories] = useState(null);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const load = () => api.getCategories().then(setCategories).catch((e) => setError(e.message));

  useEffect(load, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.uploadImage(file);
      setImage(url);
    } catch (e) {
      setError(`Upload failed: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!image) {
      setError('Upload a category image first.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await api.createCategory({ name, slug: slugify(name), image });
      setName('');
      setImage('');
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, catName) => {
    if (!window.confirm(`Delete "${catName}"? Products in it will keep their category reference.`))
      return;
    try {
      await api.deleteCategory(id);
      load();
    } catch (e) {
      alert(`Failed to delete: ${e.message}`);
    }
  };

  if (!categories) return <LoadingState message="Loading categories..." />;

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-6">Categories</h1>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <form onSubmit={handleAdd} className="border border-border rounded-lg p-4 mb-6 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[180px]">
          <label className="text-sm font-medium mb-1 block">New Category Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <label className="inline-flex items-center gap-2 text-sm font-medium border border-border rounded-md px-3 h-10 cursor-pointer hover:bg-muted">
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading...' : image ? 'Image selected' : 'Upload Image'}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
        <Button type="submit" disabled={saving || uploading}>
          {saving ? 'Adding...' : 'Add Category'}
        </Button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((c) => (
          <div key={c._id} className="relative border border-border rounded-md overflow-hidden group">
            <img src={c.image} alt={c.name} className="w-full aspect-square object-cover" />
            <div className="p-3 flex items-center justify-between">
              <span className="text-sm font-medium">{c.name}</span>
              <button onClick={() => handleDelete(c._id, c.name)} aria-label="Delete category">
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
