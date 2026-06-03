import type { MetadataRoute } from 'next';
import { getCategories, getGalleryItems, getProducts } from '@/lib/api';
import { absoluteUrl } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ['', '/products', '/categories', '/about', '/help', '/contact', '/gallery'];
  const [products, categories, galleryItems] = await Promise.all([
    getProducts('?limit=500'),
    getCategories(),
    getGalleryItems(),
  ]);

  const dynamicPaths = [
    ...products.items.map((product) => `/products/${product.slug}`),
    ...categories.map((category) => `/categories/${category.slug}`),
    ...galleryItems.flatMap((item) => (item.slug ? [`/gallery/${item.slug}`] : [])),
  ];

  return [...staticPaths, ...dynamicPaths].map((path) => ({
    url: absoluteUrl(path || '/'),
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7
  }));
}
