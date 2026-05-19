import { ProductCard } from '@/components/ProductCard';
import { getCategory, getProducts } from '@/lib/api';
import styles from '../../page.module.css';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  return {
    title: category?.metaTitle ?? category?.name ?? 'Category',
    description: category?.metaDescription ?? category?.description ?? 'Browse Shine Secure jewellery by category.',
  };
}

export default async function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  const products = category ? await getProducts(`?category=${category._id}`) : { items: [], total: 0 };

  return (
    <main className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.eyebrow}>Category</p>
          <h1>{category?.name ?? slug}</h1>
          {category?.description ? <p>{category.description}</p> : null}
        </div>
      </div>
      <div className={styles.grid}>
        {products.items.map((product) => <ProductCard key={product._id} product={product} />)}
      </div>
      {!products.items.length ? <p>No products found in this category yet.</p> : null}
    </main>
  );
}
