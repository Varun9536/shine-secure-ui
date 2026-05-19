import Link from 'next/link';
import styles from '../admin.module.css';
import { GalleryAdmin } from './GalleryAdmin';

export const metadata = {
  title: 'Manage Gallery',
};

export default function AdminGalleryPage() {
  return (
    <main className={styles.shell}>
      <div className={styles.header}>
        <div>
          <h1>Gallery</h1>
          <p>Manage event and showcase gallery images.</p>
        </div>
        <nav className={styles.nav}>
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/banners">Banners</Link>
        </nav>
      </div>
      <GalleryAdmin />
    </main>
  );
}
