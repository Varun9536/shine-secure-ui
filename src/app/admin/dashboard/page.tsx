import Link from 'next/link';
import styles from '../admin.module.css';
import { DashboardStats } from './DashboardStats';

export const metadata = {
  title: 'Admin Dashboard'
};

export default function AdminDashboardPage() {
  return (
    <main className={styles.shell}>
      <div className={styles.header}>
        <div>
          <h1>Dashboard</h1>
          <p>Product, inquiry, category, and WhatsApp analytics.</p>
        </div>
      </div>
      <DashboardStats />
      <div className={styles.grid}>
        <Link className={styles.item} href="/admin/products"><strong>Products</strong><p>Manage products, stock, labels, and storefront flags.</p></Link>
        <Link className={styles.item} href="/admin/categories"><strong>Categories</strong><p>Create product categories before adding products.</p></Link>
        <Link className={styles.item} href="/admin/orders"><strong>Orders</strong><p>View WhatsApp inquiries and update statuses.</p></Link>
        <Link className={styles.item} href="/admin/analytics"><strong>Analytics</strong><p>Review charts and download order CSV files.</p></Link>
        <Link className={styles.item} href="/admin/banners"><strong>Banners</strong><p>Add and manage homepage banners.</p></Link>
        <Link className={styles.item} href="/admin/gallery"><strong>Gallery</strong><p>Manage event gallery images and captions.</p></Link>
        <Link className={styles.item} href="/admin/settings"><strong>Settings</strong><p>Update WhatsApp, Instagram, About, Help, and Contact content.</p></Link>
      </div>
    </main>
  );
}
