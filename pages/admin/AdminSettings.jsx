import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/LoadingState';
import { useSettings } from '../../context/SettingsContext';

export function AdminSettings() {
  const { refresh } = useSettings();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getSettings().then((s) =>
      setForm({
        storeName: s.storeName || '',
        whatsappNumber: s.whatsappNumber || '',
        whatsappGroupLink: s.whatsappGroupLink || '',
        currency: s.currency || 'USD',
        socialLinks: {
          facebook: s.socialLinks?.facebook || '',
          instagram: s.socialLinks?.instagram || '',
          twitter: s.socialLinks?.twitter || '',
        },
      })
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await api.updateSettings(form);
      await refresh();
      setSaved(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <LoadingState message="Loading settings..." />;

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Store Settings</h1>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </div>
      )}
      {saved && (
        <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-100 rounded-md px-3 py-2">
          Settings saved — the storefront will use the new values immediately.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm font-medium mb-1 block">Store Name</label>
          <input
            value={form.storeName}
            onChange={(e) => setForm({ ...form, storeName: e.target.value })}
            className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">WhatsApp Number</label>
          <input
            placeholder="e.g. 15551234567 (country code, no + or spaces)"
            value={form.whatsappNumber}
            onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
            className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Used for the "Buy Now" and checkout WhatsApp links.
          </p>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">WhatsApp Group Link</label>
          <input
            placeholder="https://chat.whatsapp.com/..."
            value={form.whatsappGroupLink}
            onChange={(e) => setForm({ ...form, whatsappGroupLink: e.target.value })}
            className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Currency</label>
          <input
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
            className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Facebook URL</label>
            <input
              value={form.socialLinks.facebook}
              onChange={(e) =>
                setForm({ ...form, socialLinks: { ...form.socialLinks, facebook: e.target.value } })
              }
              className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Instagram URL</label>
            <input
              value={form.socialLinks.instagram}
              onChange={(e) =>
                setForm({ ...form, socialLinks: { ...form.socialLinks, instagram: e.target.value } })
              }
              className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>
    </div>
  );
}
