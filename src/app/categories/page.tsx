import Link from 'next/link';
import { getCategories } from '@/lib/api';
import { pageMetadata } from '@/lib/seo';
import styles from '../page.module.css';

export const metadata = pageMetadata({
  title: 'Categories',
  description: 'Browse Shine Secure jewellery categories and find curated artificial jewellery by style.',
  path: '/categories',
});

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className={styles.section}>
      <div className={styles.sectionHeader}>
        <h1>Categories</h1>
      </div>
      <div className={styles.grid}>
        {categories.map((category) => (
          <Link key={category._id} href={`/categories/${category.slug}`}>
            <h2>{category.name}</h2>
            <p>{category.description ?? `Browse ${category.name.toLowerCase()}.`}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
