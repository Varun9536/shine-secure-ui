import { ProductCard } from '@/components/ProductCard';
import { getCategories, getProducts } from '@/lib/api';
import { pageMetadata } from '@/lib/seo';
import styles from '../page.module.css';
import { ProductFilters } from './ProductFilters';
import productStyles from './products.module.css';
import { Pagination } from './Pagination';

export const metadata = pageMetadata({
  title: 'Products',
  description: 'Browse Shine Secure artificial jewellery products, including necklaces, earrings, rings, bangles, and event-ready styles.',
  path: '/products',
});

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  if (!query.has('limit')) query.set('limit', '12');
  const [products, categories] = await Promise.all([
    getProducts(`?${query.toString()}`),
    getCategories(),
  ]);
  const cleanParams = Object.fromEntries(query.entries());

  return (
    <main className={styles.section}>
      <div className={styles.sectionHeader}>
        <h1>Products</h1>
        <p>{products.total} jewellery styles</p>
      </div>
      <ProductFilters categories={categories} />
      <div className={productStyles.count}>{products.total} matching products</div>
      {products.unavailable ? <p className={productStyles.error}>Products are temporarily unavailable. Please try again shortly or contact us on WhatsApp.</p> : null}
      <div className={productStyles.grid}>{products.items.map((product) => <ProductCard key={product._id} product={product} />)}</div>
      {!products.unavailable && !products.items.length ? <p className={productStyles.empty}>No products match these filters.</p> : null}
      <Pagination page={products.page} pages={products.pages} params={cleanParams} />
    </main>
  );
}
