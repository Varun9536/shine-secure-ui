import Link from 'next/link';
import { ProductAdmin } from './ProductAdmin';
import styles from '../admin.module.css';

export const metadata = {
  title: 'Manage Products',
};

export default function AdminProductsPage() {
  return (
    <main className={styles.shell}>
      <div className={styles.header}>
        <div>
          <h1>Products</h1>
          <p>Add jewellery products, stock, labels, and storefront flags.</p>
        </div>
        <nav className={styles.nav}>
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/categories">Categories</Link>
        </nav>
      </div>
      <ProductAdmin />
    </main>
  );
}
