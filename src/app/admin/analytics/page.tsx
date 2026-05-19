import styles from '../admin.module.css';
import { AnalyticsAdmin } from './AnalyticsAdmin';

export const metadata = {
  title: 'Admin Analytics'
};

export default function AdminAnalyticsPage() {
  return (
    <main className={styles.shell}>
      <div className={styles.header}>
        <div>
          <h1>Analytics</h1>
          <p>Order inquiry status, product interest, daily trends, yearly trends, and CSV exports.</p>
        </div>
      </div>
      <AnalyticsAdmin />
    </main>
  );
}
