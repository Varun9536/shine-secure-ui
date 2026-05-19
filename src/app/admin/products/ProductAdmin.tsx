'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { adminFetch } from '@/lib/admin-api';
import styles from '../admin.module.css';

type Category = {
  _id: string;
  name: string;
  slug: string;
};

type Product = {
  _id: string;
  title: string;
  slug: string;
  sku: string;
  price: number;
  stock: number;
  description: string;
  category?: Category | string;
  tags?: string[];
  variants?: Array<{ name: string; options: string[] }>;
  images?: Array<{ url: string; publicId?: string; alt?: string }>;
  isWaterproof?: boolean;
  isAntiTarnish?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isActive?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  deletedAt?: string;
};

type FormState = {
  title: string;
  slug: string;
  sku: string;
  price: string;
  description: string;
  category: string;
  stock: string;
  imageUrl: string;
  tags: string;
  variants: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  canonicalUrl: string;
  isWaterproof: boolean;
  isAntiTarnish: boolean;
  isFeatured: boolean;
  isTrending: boolean;
};

const emptyForm: FormState = {
  title: '',
  slug: '',
  sku: '',
  price: '',
  description: '',
  category: '',
  stock: '1',
  imageUrl: '',
  tags: '',
  variants: '',
  metaTitle: '',
  metaDescription: '',
  ogImage: '',
  canonicalUrl: '',
  isWaterproof: false,
  isAntiTarnish: true,
  isFeatured: false,
  isTrending: false,
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function parseVariants(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, options = ''] = line.split(':');
      return {
        name: name.trim(),
        options: options.split(',').map((option) => option.trim()).filter(Boolean),
      };
    })
    .filter((variant) => variant.name && variant.options.length);
}

function productCategoryId(product: Product) {
  if (!product.category) return '';
  return typeof product.category === 'string' ? product.category : product.category._id;
}

export function ProductAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productFilter, setProductFilter] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);

  const imageUrls = useMemo(() => form.imageUrl.split('\n').map((url) => url.trim()).filter(Boolean), [form.imageUrl]);
  const activeProducts = useMemo(() => products.filter((product) => showDeleted || !product.deletedAt), [products, showDeleted]);
  const visibleProducts = useMemo(() => activeProducts.filter((product) => {
    const query = productSearch.trim().toLowerCase();
    const matchesSearch = !query || [product.title, product.sku, product.description, product.tags?.join(' ')].filter(Boolean).join(' ').toLowerCase().includes(query);
    const matchesFilter =
      productFilter === 'all'
      || (productFilter === 'featured' && product.isFeatured)
      || (productFilter === 'trending' && product.isTrending)
      || (productFilter === 'low-stock' && product.stock > 0 && product.stock <= 3)
      || (productFilter === 'out-of-stock' && product.stock < 1)
      || (productFilter === 'deleted' && product.deletedAt);
    return matchesSearch && matchesFilter;
  }), [activeProducts, productFilter, productSearch]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function load() {
    setListLoading(true);
    const [categoryResponse, productResponse] = await Promise.all([
      adminFetch('/categories'),
      adminFetch('/products/admin/all'),
    ]);
    if (categoryResponse.ok) {
      const nextCategories = await categoryResponse.json();
      setCategories(nextCategories);
      setForm((current) => ({ ...current, category: current.category || nextCategories[0]?._id || '' }));
    }
    if (productResponse.ok) {
      const body = await productResponse.json();
      setProducts(body.items ?? []);
    }
    setListLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!form.category) {
      setError('Create a category first, then add products.');
      return;
    }

    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      sku: form.sku,
      price: Number(form.price),
      description: form.description,
      category: form.category,
      stock: Number(form.stock),
      isWaterproof: form.isWaterproof,
      isAntiTarnish: form.isAntiTarnish,
      isFeatured: form.isFeatured,
      isTrending: form.isTrending,
      metaTitle: form.metaTitle,
      metaDescription: form.metaDescription,
      ogImage: form.ogImage,
      canonicalUrl: form.canonicalUrl,
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      variants: parseVariants(form.variants),
      images: form.imageUrl
        ? form.imageUrl.split('\n').map((url, index) => ({ url: url.trim(), publicId: `manual-${form.sku}-${index + 1}`, alt: form.title })).filter((image) => image.url)
        : [],
    };

    setLoading(true);
    try {
      const response = await adminFetch(editingId ? `/products/${editingId}` : '/products', {
        method: editingId ? 'PATCH' : 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(Array.isArray(body?.message) ? body.message.join(', ') : body?.message ?? 'Could not save product.');
      }

      setForm({ ...emptyForm, category: categories[0]?._id || '' });
      setEditingId(null);
      setMessage(editingId ? 'Product updated.' : 'Product created.');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Product save failed.');
    } finally {
      setLoading(false);
    }
  }

  function edit(product: Product) {
    setEditingId(product._id);
    setForm({
      title: product.title,
      slug: product.slug,
      sku: product.sku,
      price: String(product.price),
      description: product.description,
      category: productCategoryId(product),
      stock: String(product.stock),
      imageUrl: product.images?.map((image) => image.url).join('\n') ?? '',
      tags: product.tags?.join(', ') ?? '',
      variants: product.variants?.map((variant) => `${variant.name}: ${variant.options.join(', ')}`).join('\n') ?? '',
      metaTitle: product.metaTitle ?? '',
      metaDescription: product.metaDescription ?? '',
      ogImage: product.ogImage ?? '',
      canonicalUrl: product.canonicalUrl ?? '',
      isWaterproof: Boolean(product.isWaterproof),
      isAntiTarnish: Boolean(product.isAntiTarnish),
      isFeatured: Boolean(product.isFeatured),
      isTrending: Boolean(product.isTrending),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function softDelete(id: string) {
    if (!window.confirm('Soft delete this product? You can restore it later.')) return;
    const response = await adminFetch(`/products/${id}`, { method: 'DELETE' });
    if (response.ok) await load();
  }

  async function restore(id: string) {
    if (!window.confirm('Restore this product?')) return;
    const response = await adminFetch(`/products/${id}/restore`, { method: 'PATCH' });
    if (response.ok) await load();
  }

  function setImageUrls(urls: string[]) {
    update('imageUrl', urls.join('\n'));
  }

  function moveImage(index: number, direction: -1 | 1) {
    const next = [...imageUrls];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setImageUrls(next);
  }

  function removeImage(index: number) {
    setImageUrls(imageUrls.filter((_, currentIndex) => currentIndex !== index));
  }

  async function uploadImages(files: FileList) {
    setUploading(true);
    setError('');
    try {
      const uploadedUrls = await Promise.all(Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await adminFetch('/uploads/image', { method: 'POST', body: formData });
        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(Array.isArray(body?.message) ? body.message.join(', ') : body?.message ?? 'Image upload failed. Check Cloudinary settings and login.');
        }
        const uploaded = await response.json();
        return uploaded.url as string;
      }));
      update('imageUrl', [form.imageUrl, ...uploadedUrls].filter(Boolean).join('\n'));
      setMessage(`${uploadedUrls.length} image${uploadedUrls.length > 1 ? 's' : ''} uploaded to Cloudinary.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={styles.grid}>
      <form className={styles.panel} onSubmit={submit}>
        <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>
        <div className={styles.field}>
          <label htmlFor="title">Product name</label>
          <input id="title" value={form.title} onChange={(event) => {
            update('title', event.target.value);
            update('slug', slugify(event.target.value));
          }} required />
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="slug">Slug</label>
            <input id="slug" value={form.slug} onChange={(event) => update('slug', event.target.value)} required />
          </div>
          <div className={styles.field}>
            <label htmlFor="sku">SKU</label>
            <input id="sku" value={form.sku} onChange={(event) => update('sku', event.target.value.toUpperCase())} placeholder="SS-NK-1001" required />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="price">Price</label>
            <input id="price" type="number" min="0" value={form.price} onChange={(event) => update('price', event.target.value)} required />
          </div>
          <div className={styles.field}>
            <label htmlFor="stock">Stock</label>
            <input id="stock" type="number" min="0" value={form.stock} onChange={(event) => update('stock', event.target.value)} required />
          </div>
        </div>
        <div className={styles.field}>
          <label htmlFor="category">Category</label>
          <select id="category" value={form.category} onChange={(event) => update('category', event.target.value)} required>
            <option value="">Select category</option>
            {categories.map((item) => <option value={item._id} key={item._id}>{item.name}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="imageUpload">Upload product images</label>
          <input id="imageUpload" type="file" accept="image/*" multiple onChange={(event) => {
            const files = event.target.files;
            if (files?.length) void uploadImages(files);
          }} />
          {uploading ? <span className={styles.message}>Uploading images...</span> : null}
        </div>
        <div className={styles.field}>
          <label htmlFor="imageUrl">Image URLs</label>
          <textarea id="imageUrl" value={form.imageUrl} onChange={(event) => update('imageUrl', event.target.value)} placeholder="Cloudinary image URLs, one per line" />
        </div>
        {imageUrls.length ? (
          <div className={styles.imagePreviewGrid}>
            {imageUrls.map((url, index) => (
              <figure key={`${url}-${index}`}>
                <img src={url} alt={`${form.title || 'Product'} preview ${index + 1}`} />
                <figcaption>{index === 0 ? 'Main image' : `Image ${index + 1}`}</figcaption>
                <div className={styles.actionRow}>
                  <button className={styles.secondaryButton} type="button" onClick={() => moveImage(index, -1)} disabled={index === 0}>Up</button>
                  <button className={styles.secondaryButton} type="button" onClick={() => moveImage(index, 1)} disabled={index === imageUrls.length - 1}>Down</button>
                  <button className={styles.dangerButton} type="button" onClick={() => removeImage(index)}>Remove</button>
                </div>
              </figure>
            ))}
          </div>
        ) : null}
        <div className={styles.field}>
          <label htmlFor="description">Description</label>
          <textarea id="description" value={form.description} onChange={(event) => update('description', event.target.value)} required />
        </div>
        <div className={styles.field}>
          <label htmlFor="tags">Tags</label>
          <input id="tags" value={form.tags} onChange={(event) => update('tags', event.target.value)} placeholder="necklace, pearl, gift" />
        </div>
        <div className={styles.field}>
          <label htmlFor="variants">Variants</label>
          <textarea id="variants" value={form.variants} onChange={(event) => update('variants', event.target.value)} placeholder={'Color: Gold, Rose Gold\nLength: 16 inch, 18 inch'} />
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="metaTitle">SEO title</label>
            <input id="metaTitle" value={form.metaTitle} onChange={(event) => update('metaTitle', event.target.value)} />
          </div>
          <div className={styles.field}>
            <label htmlFor="canonicalUrl">Canonical URL</label>
            <input id="canonicalUrl" value={form.canonicalUrl} onChange={(event) => update('canonicalUrl', event.target.value)} />
          </div>
        </div>
        <div className={styles.field}>
          <label htmlFor="metaDescription">SEO description</label>
          <textarea id="metaDescription" value={form.metaDescription} onChange={(event) => update('metaDescription', event.target.value)} />
        </div>
        <div className={styles.field}>
          <label htmlFor="ogImage">Open Graph image</label>
          <input id="ogImage" value={form.ogImage} onChange={(event) => update('ogImage', event.target.value)} />
        </div>
        <div className={styles.checkRow}>
          <label className={styles.check}><input type="checkbox" checked={form.isWaterproof} onChange={(event) => update('isWaterproof', event.target.checked)} /> Waterproof</label>
          <label className={styles.check}><input type="checkbox" checked={form.isAntiTarnish} onChange={(event) => update('isAntiTarnish', event.target.checked)} /> Anti-tarnish</label>
          <label className={styles.check}><input type="checkbox" checked={form.isFeatured} onChange={(event) => update('isFeatured', event.target.checked)} /> Featured</label>
          <label className={styles.check}><input type="checkbox" checked={form.isTrending} onChange={(event) => update('isTrending', event.target.checked)} /> Trending</label>
        </div>
        {message ? <span className={styles.message}>{message}</span> : null}
        {error ? <span className={styles.error}>{error}</span> : null}
        <div className={styles.actionRow}>
          <button className={styles.button} disabled={loading}>{loading ? 'Saving...' : editingId ? 'Update Product' : 'Save Product'}</button>
          {editingId ? <button className={styles.secondaryButton} type="button" onClick={() => { setEditingId(null); setForm({ ...emptyForm, category: categories[0]?._id || '' }); }}>Cancel</button> : null}
        </div>
      </form>

      <section className={styles.panel}>
        <div className={styles.splitHeader}>
          <h2>Products</h2>
          <label className={styles.check}><input type="checkbox" checked={showDeleted} onChange={(event) => setShowDeleted(event.target.checked)} /> Show deleted</label>
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="productSearch">Search products</label>
            <input id="productSearch" value={productSearch} onChange={(event) => setProductSearch(event.target.value)} placeholder="Name, SKU, tag" />
          </div>
          <div className={styles.field}>
            <label htmlFor="productFilter">Filter</label>
            <select id="productFilter" value={productFilter} onChange={(event) => setProductFilter(event.target.value)}>
              <option value="all">All products</option>
              <option value="featured">Featured</option>
              <option value="trending">Trending</option>
              <option value="low-stock">Low stock</option>
              <option value="out-of-stock">Out of stock</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>
        </div>
        <div className={styles.list}>
          {listLoading ? <p className={styles.empty}>Loading products...</p> : null}
          {visibleProducts.map((product) => (
            <article className={styles.item} key={product._id}>
              {product.images?.[0]?.url ? <img className={styles.preview} src={product.images[0].url} alt={product.images[0].alt || product.title} /> : null}
              <strong>{product.title}</strong>
              <span>{product.sku} - Rs. {product.price.toLocaleString('en-IN')} - Stock {product.stock}</span>
              <div className={styles.badgeRow}>
                <span className={product.stock < 1 ? styles.badgeDanger : product.stock <= 3 ? styles.badgeWarn : styles.badge}>Stock {product.stock}</span>
                {product.isFeatured ? <span className={styles.badge}>Featured</span> : null}
                {product.isTrending ? <span className={styles.badge}>Trending</span> : null}
                {product.deletedAt ? <span className={styles.badgeDanger}>Deleted</span> : null}
              </div>
              <p>{product.description}</p>
              <div className={styles.actionRow}>
                <button className={styles.buttonLink} onClick={() => edit(product)}>Edit</button>
                {product.deletedAt
                  ? <button className={styles.buttonLink} onClick={() => void restore(product._id)}>Restore</button>
                  : <button className={styles.dangerButton} onClick={() => void softDelete(product._id)}>Soft Delete</button>}
              </div>
            </article>
          ))}
          {!listLoading && !visibleProducts.length ? <p className={styles.empty}>No products match these admin filters.</p> : null}
        </div>
      </section>
    </div>
  );
}
