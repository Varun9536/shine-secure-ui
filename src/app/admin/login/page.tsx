import { AdminLoginForm } from './AdminLoginForm';
import styles from './page.module.css';

export const metadata = {
  title: 'Admin Login'
};

export default function AdminLoginPage() {
  return (
    <main className={styles.shell}>
      <div className={styles.copy}>
        <p>Admin area</p>
        <h1>Manage Shine Secure products, banners, and inquiries.</h1>
        <p>Use this page for staff access. The public website does not require customer login.</p>
      </div>
      <AdminLoginForm />
    </main>
  );
}
