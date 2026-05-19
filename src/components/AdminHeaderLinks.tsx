'use client';

import Link from 'next/link';
import { LayoutDashboard, LockKeyhole } from 'lucide-react';
import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/admin-api';
import styles from '@/app/layout.module.css';

export function AdminHeaderLinks() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let active = true;

    adminFetch('/auth/me')
      .then((response) => {
        if (active) setLoggedIn(response.ok);
      })
      .catch(() => {
        if (active) setLoggedIn(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className={styles.adminLinks}>
      {loggedIn ? (
        <Link href="/admin/dashboard">
          <LayoutDashboard size={13} /> Admin dashboard
        </Link>
      ) : null}
      <Link href="/admin/login">
        <LockKeyhole size={13} /> Admin login
      </Link>
    </div>
  );
}
