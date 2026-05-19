import Link from 'next/link';
import styles from '../admin.module.css';
import { BannerAdmin } from './BannerAdmin';

export const metadata = {
  title: 'Manage Banners',
};

export default function AdminBannersPage() {
  return (
    <main className={styles.shell}>
      <div className={styles.header}>
        <div>
          <h1>Banners</h1>
          <p>Manage homepage banner content.</p>
        </div>
        <nav className={styles.nav}>
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/settings">Settings</Link>
        </nav>
      </div>
      <BannerAdmin />
    </main>
  );
}
