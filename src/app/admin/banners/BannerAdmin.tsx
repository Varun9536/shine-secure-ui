'use client';

import { FormEvent, useEffect, useState } from 'react';
import { adminFetch } from '@/lib/admin-api';
import styles from '../admin.module.css';

type Banner = {
  _id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  imageAlt?: string;
  linkUrl?: string;
  placement?: string;
  isActive?: boolean;
  sortOrder?: number;
  deletedAt?: string;
};

export function BannerAdmin() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', subtitle: '', imageUrl: '', imageAlt: '', linkUrl: '', placement: 'home', sortOrder: '0', isActive: true });
  const [showDeleted, setShowDeleted] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  function update(key: keyof typeof form, value: string | boolean) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function loadBanners() {
    const response = await adminFetch('/banners/admin/all');
    if (response.ok) setBanners(await response.json());
  }

  useEffect(() => {
    void loadBanners();
  }, []);

  async function uploadImage(file: File) {
    setUploading(true);
    setError('');
    try {
      const data = new FormData();
      data.append('file', file);
      const response = await adminFetch('/uploads/image', { method: 'POST', body: data });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(Array.isArray(body?.message) ? body.message.join(', ') : body?.message ?? 'Upload failed.');
      }
      const uploaded = await response.json();
      update('imageUrl', uploaded.url);
      setMessage('Image uploaded.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed. Login again or check Cloudinary settings.');
    } finally {
      setUploading(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setError('');

    const response = await adminFetch(editingId ? `/banners/${editingId}` : '/banners', {
      method: editingId ? 'PATCH' : 'POST',
      body: JSON.stringify({ ...form, sortOrder: Number(form.sortOrder), imageAlt: form.imageAlt || form.title }),
    });

    if (!response.ok) {
      setError('Could not save banner. Login again if your session expired.');
      return;
    }

    setForm({ title: '', subtitle: '', imageUrl: '', imageAlt: '', linkUrl: '', placement: 'home', sortOrder: '0', isActive: true });
    setEditingId(null);
    setMessage(editingId ? 'Banner updated.' : 'Banner created.');
    await loadBanners();
  }

  function edit(banner: Banner) {
    setEditingId(banner._id);
    setForm({
      title: banner.title,
      subtitle: banner.subtitle ?? '',
      imageUrl: banner.imageUrl,
      imageAlt: banner.imageAlt ?? '',
      linkUrl: banner.linkUrl ?? '',
      placement: banner.placement ?? 'home',
      sortOrder: String(banner.sortOrder ?? 0),
      isActive: banner.isActive ?? true,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function remove(id: string) {
    if (!window.confirm('Delete this banner?')) return;
    const response = await adminFetch(`/banners/${id}`, { method: 'DELETE' });
    if (response.ok) await loadBanners();
  }

  async function restore(id: string) {
    if (!window.confirm('Restore this banner?')) return;
    const response = await adminFetch(`/banners/${id}/restore`, { method: 'PATCH' });
    if (response.ok) await loadBanners();
  }

  const visible = banners.filter((banner) => showDeleted || !banner.deletedAt);

  return (
    <div className={styles.grid}>
      <form className={styles.panel} onSubmit={submit}>
        <h2>{editingId ? 'Edit Banner' : 'Add Banner'}</h2>
        <div className={styles.field}><label htmlFor="title">Title</label><input id="title" value={form.title} onChange={(event) => update('title', event.target.value)} required /></div>
        <div className={styles.field}><label htmlFor="subtitle">Subtitle</label><input id="subtitle" value={form.subtitle} onChange={(event) => update('subtitle', event.target.value)} /></div>
        <div className={styles.field}>
          <label htmlFor="imageUpload">Upload image</label>
          <input id="imageUpload" type="file" accept="image/*" onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void uploadImage(file);
          }} />
          {uploading ? <span className={styles.message}>Uploading...</span> : null}
        </div>
        <div className={styles.field}><label htmlFor="imageUrl">Image URL</label><input id="imageUrl" value={form.imageUrl} onChange={(event) => update('imageUrl', event.target.value)} required /></div>
        <div className={styles.field}><label htmlFor="imageAlt">Image alt</label><input id="imageAlt" value={form.imageAlt} onChange={(event) => update('imageAlt', event.target.value)} /></div>
        <div className={styles.row}>
          <div className={styles.field}><label htmlFor="linkUrl">Link URL</label><input id="linkUrl" value={form.linkUrl} onChange={(event) => update('linkUrl', event.target.value)} placeholder="/products" /></div>
          <div className={styles.field}><label htmlFor="sortOrder">Sort order</label><input id="sortOrder" type="number" value={form.sortOrder} onChange={(event) => update('sortOrder', event.target.value)} /></div>
        </div>
        <label className={styles.check}><input type="checkbox" checked={form.isActive} onChange={(event) => update('isActive', event.target.checked)} /> Active</label>
        {message ? <span className={styles.message}>{message}</span> : null}
        {error ? <span className={styles.error}>{error}</span> : null}
        <div className={styles.actionRow}>
          <button className={styles.button}>{editingId ? 'Update Banner' : 'Save Banner'}</button>
          {editingId ? <button className={styles.secondaryButton} type="button" onClick={() => setEditingId(null)}>Cancel</button> : null}
        </div>
      </form>

      <section className={styles.panel}>
        <div className={styles.splitHeader}>
          <h2>Banners</h2>
          <label className={styles.check}><input type="checkbox" checked={showDeleted} onChange={(event) => setShowDeleted(event.target.checked)} /> Show deleted</label>
        </div>
        <div className={styles.list}>
          {visible.map((banner) => (
            <article className={styles.item} key={banner._id}>
              {banner.imageUrl ? <img className={styles.preview} src={banner.imageUrl} alt={banner.imageAlt || banner.title} /> : null}
              <strong>{banner.title}</strong>
              {banner.subtitle ? <p>{banner.subtitle}</p> : null}
              <span>{banner.linkUrl || 'No link'} - {banner.isActive ? 'Active' : 'Inactive'}</span>
              <div className={styles.actionRow}>
                <button className={styles.buttonLink} onClick={() => edit(banner)}>Edit</button>
                {banner.deletedAt
                  ? <button className={styles.buttonLink} onClick={() => void restore(banner._id)}>Restore</button>
                  : <button className={styles.dangerButton} onClick={() => void remove(banner._id)}>Delete</button>}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
