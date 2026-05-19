import Link from 'next/link';
import styles from '../admin.module.css';
import { SettingsAdmin } from './SettingsAdmin';

export const metadata = {
  title: 'Site Settings',
};

export default function AdminSettingsPage() {
  return (
    <main className={styles.shell}>
      <div className={styles.header}>
        <div>
          <h1>Settings</h1>
          <p>Manage business contact details and editable page content.</p>
        </div>
        <nav className={styles.nav}>
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/banners">Banners</Link>
        </nav>
      </div>
      <SettingsAdmin />
    </main>
  );
}
