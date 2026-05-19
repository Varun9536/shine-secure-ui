import Link from 'next/link';
import { CategoryAdmin } from './CategoryAdmin';
import styles from '../admin.module.css';

export const metadata = {
  title: 'Manage Categories',
};

export default function AdminCategoriesPage() {
  return (
    <main className={styles.shell}>
      <div className={styles.header}>
        <div>
          <h1>Categories</h1>
          <p>Create product categories before adding products.</p>
        </div>
        <nav className={styles.nav}>
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/products">Products</Link>
        </nav>
      </div>
      <CategoryAdmin />
    </main>
  );
}
