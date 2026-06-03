'use client';

import { useRouter } from 'next/navigation';
import { adminApiBase, clearCsrfToken, getCsrfToken } from '@/lib/admin-api';
import styles from './admin.module.css';

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch(`${adminApiBase}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'x-csrf-token': getCsrfToken() },
    }).catch(() => null);
    clearCsrfToken();
    router.push('/admin/login');
    router.refresh();
  }

  return <button className={styles.secondaryButton} onClick={() => void logout()}>Logout</button>;
}
