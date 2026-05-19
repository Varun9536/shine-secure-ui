'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import styles from './page.module.css';
import { adminApiBase } from '@/lib/admin-api';

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@shinesecure.local');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${adminApiBase}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message ?? 'Login failed. Check email and password.');
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.panel} onSubmit={handleSubmit}>
      <h2>Admin Login</h2>
      <p>Sign in to update catalogue, stock, gallery, and WhatsApp order requests.</p>
      <div className={styles.field}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          aria-label="Email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@shinesecure.local"
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          aria-label="Password"
          autoComplete="current-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          required
        />
      </div>
      {error ? <span className={styles.error}>{error}</span> : null}
      <button type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Login'}
      </button>
      <span className={styles.note}>Admin login route: /admin/login</span>
    </form>
  );
}
