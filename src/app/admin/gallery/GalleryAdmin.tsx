'use client';

import { FormEvent, useEffect, useState } from 'react';
import { adminFetch } from '@/lib/admin-api';
import styles from '../admin.module.css';

type GalleryItem = {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  images?: Array<{ url: string; alt?: string; publicId?: string }>;
  type?: string;
  isActive?: boolean;
  sortOrder?: number;
  deletedAt?: string;
};

export function GalleryAdmin() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', slug: '', description: '', imageUrl: '', imageAlt: '', type: 'event', sortOrder: '0', isActive: true });
  const [showDeleted, setShowDeleted] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  function update(key: keyof typeof form, value: string | boolean) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function slugify(value: string) {
    return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  async function load() {
    const response = await adminFetch('/gallery/admin/all');
    if (response.ok) setItems(await response.json());
  }

  useEffect(() => {
    void load();
  }, []);

  async function uploadImage(files: FileList) {
    setUploading(true);
    setError('');
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const data = new FormData();
      data.append('file', file);
      const response = await adminFetch('/uploads/image', { method: 'POST', body: data });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(Array.isArray(body?.message) ? body.message.join(', ') : body?.message ?? 'Image upload failed. Check Cloudinary settings and login.');
        setUploading(false);
        return;
      }
      const uploaded = await response.json();
      uploadedUrls.push(uploaded.url);
    }
    update('imageUrl', [form.imageUrl, ...uploadedUrls].filter(Boolean).join('\n'));
    setMessage(`${uploadedUrls.length} image${uploadedUrls.length > 1 ? 's' : ''} uploaded.`);
    setUploading(false);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    const response = await adminFetch(editingId ? `/gallery/${editingId}` : '/gallery', {
      method: editingId ? 'PATCH' : 'POST',
      body: JSON.stringify({
        ...form,
        imageUrl: form.imageUrl.split('\n').map((url) => url.trim()).filter(Boolean)[0],
        images: form.imageUrl.split('\n').map((url) => url.trim()).filter(Boolean).map((url) => ({ url, alt: form.imageAlt || form.title })),
        sortOrder: Number(form.sortOrder),
        imageAlt: form.imageAlt || form.title,
      }),
    });
    if (!response.ok) {
      setError('Could not save gallery item. Login again if your session expired.');
      return;
    }
    setForm({ title: '', slug: '', description: '', imageUrl: '', imageAlt: '', type: 'event', sortOrder: '0', isActive: true });
    setEditingId(null);
    setMessage(editingId ? 'Gallery item updated.' : 'Gallery item saved.');
    await load();
  }

  function edit(item: GalleryItem) {
    setEditingId(item._id);
    setForm({
      title: item.title,
      slug: item.slug ?? slugify(item.title),
      description: item.description ?? '',
      imageUrl: item.images?.length ? item.images.map((image) => image.url).join('\n') : item.imageUrl ?? '',
      imageAlt: item.imageAlt ?? '',
      type: item.type ?? 'event',
      sortOrder: String(item.sortOrder ?? 0),
      isActive: item.isActive ?? true,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function remove(id: string) {
    if (!window.confirm('Delete this gallery item?')) return;
    const response = await adminFetch(`/gallery/${id}`, { method: 'DELETE' });
    if (response.ok) await load();
  }

  async function restore(id: string) {
    if (!window.confirm('Restore this gallery item?')) return;
    const response = await adminFetch(`/gallery/${id}/restore`, { method: 'PATCH' });
    if (response.ok) await load();
  }

  const visible = items.filter((item) => showDeleted || !item.deletedAt);

  return (
    <div className={styles.grid}>
      <form className={styles.panel} onSubmit={submit}>
        <h2>{editingId ? 'Edit Gallery Item' : 'Add Gallery Item'}</h2>
        <div className={styles.field}><label htmlFor="title">Title</label><input id="title" value={form.title} onChange={(event) => {
          update('title', event.target.value);
          update('slug', slugify(event.target.value));
        }} required /></div>
        <div className={styles.field}><label htmlFor="slug">Album URL slug</label><input id="slug" value={form.slug} onChange={(event) => update('slug', slugify(event.target.value))} placeholder="summer-jewellery-fair" /></div>
        <div className={styles.field}><label htmlFor="description">Description</label><textarea id="description" value={form.description} onChange={(event) => update('description', event.target.value)} /></div>
        <div className={styles.field}>
          <label htmlFor="imageUpload">Upload images</label>
          <input id="imageUpload" type="file" accept="image/*" multiple onChange={(event) => {
            const files = event.target.files;
            if (files?.length) void uploadImage(files);
          }} />
          {uploading ? <span className={styles.message}>Uploading...</span> : null}
        </div>
        <div className={styles.field}><label htmlFor="imageUrl">Image URLs</label><textarea id="imageUrl" value={form.imageUrl} onChange={(event) => update('imageUrl', event.target.value)} placeholder="One Cloudinary URL per line" required /></div>
        <div className={styles.row}>
          <div className={styles.field}><label htmlFor="imageAlt">Image alt</label><input id="imageAlt" value={form.imageAlt} onChange={(event) => update('imageAlt', event.target.value)} /></div>
          <div className={styles.field}><label htmlFor="sortOrder">Sort order</label><input id="sortOrder" type="number" value={form.sortOrder} onChange={(event) => update('sortOrder', event.target.value)} /></div>
        </div>
        <label className={styles.check}><input type="checkbox" checked={form.isActive} onChange={(event) => update('isActive', event.target.checked)} /> Active</label>
        {message ? <span className={styles.message}>{message}</span> : null}
        {error ? <span className={styles.error}>{error}</span> : null}
        <div className={styles.actionRow}>
          <button className={styles.button}>{editingId ? 'Update Gallery Item' : 'Save Gallery Item'}</button>
          {editingId ? <button className={styles.secondaryButton} type="button" onClick={() => setEditingId(null)}>Cancel</button> : null}
        </div>
      </form>
      <section className={styles.panel}>
        <div className={styles.splitHeader}>
          <h2>Gallery</h2>
          <label className={styles.check}><input type="checkbox" checked={showDeleted} onChange={(event) => setShowDeleted(event.target.checked)} /> Show deleted</label>
        </div>
        <div className={styles.list}>
          {visible.map((item) => (
            <article className={styles.item} key={item._id}>
              {(item.images?.[0]?.url || item.imageUrl) ? <img className={styles.preview} src={item.images?.[0]?.url ?? item.imageUrl} alt={item.imageAlt || item.title} /> : null}
              <strong>{item.title}</strong>
              <p>{item.description}</p>
              <span>{item.images?.length || (item.imageUrl ? 1 : 0)} image{(item.images?.length || (item.imageUrl ? 1 : 0)) > 1 ? 's' : ''} - {item.isActive ? 'Active' : 'Inactive'}</span>
              <div className={styles.actionRow}>
                <button className={styles.buttonLink} onClick={() => edit(item)}>Edit</button>
                {item.deletedAt
                  ? <button className={styles.buttonLink} onClick={() => void restore(item._id)}>Restore</button>
                  : <button className={styles.dangerButton} onClick={() => void remove(item._id)}>Delete</button>}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
