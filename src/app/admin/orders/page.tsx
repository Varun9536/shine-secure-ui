import Link from 'next/link';
import styles from '../admin.module.css';
import { OrderAdmin } from './OrderAdmin';

export const metadata = {
  title: 'Order Requests',
};

export default function AdminOrdersPage() {
  return (
    <main className={styles.shell}>
      <div className={styles.header}>
        <div>
          <h1>Order Requests</h1>
          <p>View and manage WhatsApp inquiries.</p>
        </div>
        <nav className={styles.nav}>
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/products">Products</Link>
        </nav>
      </div>
      <OrderAdmin />
    </main>
  );
}
