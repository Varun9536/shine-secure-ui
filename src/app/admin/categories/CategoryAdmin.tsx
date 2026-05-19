'use client';

import { FormEvent, useEffect, useState } from 'react';
import { adminFetch } from '@/lib/admin-api';
import styles from '../admin.module.css';

type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  isActive?: boolean;
  sortOrder?: number;
  deletedAt?: string;
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function CategoryAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    metaTitle: '',
    metaDescription: '',
    sortOrder: '0',
    isActive: true,
  });
  const [showDeleted, setShowDeleted] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  function update(key: keyof typeof form, value: string | boolean) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function loadCategories() {
    const response = await adminFetch('/categories/admin/all');
    if (response.ok) setCategories(await response.json());
  }

  useEffect(() => {
    void loadCategories();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await adminFetch(editingId ? `/categories/${editingId}` : '/categories', {
        method: editingId ? 'PATCH' : 'POST',
        body: JSON.stringify({ ...form, sortOrder: Number(form.sortOrder), slug: form.slug || slugify(form.name) }),
      });

      if (!response.ok) throw new Error('Could not save category.');
      setForm({ name: '', slug: '', description: '', imageUrl: '', metaTitle: '', metaDescription: '', sortOrder: '0', isActive: true });
      setEditingId(null);
      setMessage(editingId ? 'Category updated.' : 'Category created.');
      await loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Category save failed.');
    } finally {
      setLoading(false);
    }
  }

  async function uploadImage(file: File) {
    setUploading(true);
    setError('');
    const data = new FormData();
    data.append('file', file);
    const response = await adminFetch('/uploads/image', { method: 'POST', body: data });
    if (response.ok) {
      const uploaded = await response.json();
      update('imageUrl', uploaded.url);
      setMessage('Image uploaded.');
    } else {
      const body = await response.json().catch(() => null);
      setError(Array.isArray(body?.message) ? body.message.join(', ') : body?.message ?? 'Image upload failed. Check Cloudinary settings and login.');
    }
    setUploading(false);
  }

  function edit(category: Category) {
    setEditingId(category._id);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? '',
      imageUrl: category.imageUrl ?? '',
      metaTitle: category.metaTitle ?? '',
      metaDescription: category.metaDescription ?? '',
      sortOrder: String(category.sortOrder ?? 0),
      isActive: category.isActive ?? true,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function remove(id: string) {
    if (!window.confirm('Delete this category?')) return;
    const response = await adminFetch(`/categories/${id}`, { method: 'DELETE' });
    if (response.ok) await loadCategories();
  }

  async function restore(id: string) {
    if (!window.confirm('Restore this category?')) return;
    const response = await adminFetch(`/categories/${id}/restore`, { method: 'PATCH' });
    if (response.ok) await loadCategories();
  }

  const visible = categories.filter((category) => showDeleted || !category.deletedAt);

  return (
    <div className={styles.grid}>
      <form className={styles.panel} onSubmit={submit}>
        <h2>{editingId ? 'Edit Category' : 'Add Category'}</h2>
        <div className={styles.field}>
          <label htmlFor="name">Category name</label>
          <input id="name" value={form.name} onChange={(event) => {
            update('name', event.target.value);
            update('slug', slugify(event.target.value));
          }} required />
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="slug">Slug</label>
            <input id="slug" value={form.slug} onChange={(event) => update('slug', event.target.value)} required />
          </div>
          <div className={styles.field}>
            <label htmlFor="sortOrder">Sort order</label>
            <input id="sortOrder" type="number" value={form.sortOrder} onChange={(event) => update('sortOrder', event.target.value)} />
          </div>
        </div>
        <div className={styles.field}>
          <label htmlFor="description">Description</label>
          <textarea id="description" value={form.description} onChange={(event) => update('description', event.target.value)} />
        </div>
        <div className={styles.field}>
          <label htmlFor="imageUpload">Upload image</label>
          <input id="imageUpload" type="file" accept="image/*" onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void uploadImage(file);
          }} />
          {uploading ? <span className={styles.message}>Uploading...</span> : null}
        </div>
        <div className={styles.field}>
          <label htmlFor="imageUrl">Image URL</label>
          <input id="imageUrl" value={form.imageUrl} onChange={(event) => update('imageUrl', event.target.value)} />
        </div>
        <div className={styles.field}>
          <label htmlFor="metaTitle">SEO title</label>
          <input id="metaTitle" value={form.metaTitle} onChange={(event) => update('metaTitle', event.target.value)} />
        </div>
        <div className={styles.field}>
          <label htmlFor="metaDescription">SEO description</label>
          <textarea id="metaDescription" value={form.metaDescription} onChange={(event) => update('metaDescription', event.target.value)} />
        </div>
        <label className={styles.check}><input type="checkbox" checked={form.isActive} onChange={(event) => update('isActive', event.target.checked)} /> Active</label>
        {message ? <span className={styles.message}>{message}</span> : null}
        {error ? <span className={styles.error}>{error}</span> : null}
        <div className={styles.actionRow}>
          <button className={styles.button} disabled={loading}>{loading ? 'Saving...' : editingId ? 'Update Category' : 'Save Category'}</button>
          {editingId ? <button className={styles.secondaryButton} type="button" onClick={() => setEditingId(null)}>Cancel</button> : null}
        </div>
      </form>

      <section className={styles.panel}>
        <div className={styles.splitHeader}>
          <h2>Categories</h2>
          <label className={styles.check}><input type="checkbox" checked={showDeleted} onChange={(event) => setShowDeleted(event.target.checked)} /> Show deleted</label>
        </div>
        <div className={styles.list}>
          {visible.map((category) => (
            <article className={styles.item} key={category._id}>
              {category.imageUrl ? <img className={styles.preview} src={category.imageUrl} alt={category.name} /> : null}
              <strong>{category.name}</strong>
              <span>/{category.slug} - {category.isActive ? 'Active' : 'Inactive'}</span>
              {category.description ? <p>{category.description}</p> : null}
              <div className={styles.actionRow}>
                <button className={styles.buttonLink} onClick={() => edit(category)}>Edit</button>
                {category.deletedAt
                  ? <button className={styles.buttonLink} onClick={() => void restore(category._id)}>Restore</button>
                  : <button className={styles.dangerButton} onClick={() => void remove(category._id)}>Delete</button>}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
