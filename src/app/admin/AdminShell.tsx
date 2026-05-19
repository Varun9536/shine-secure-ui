'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoutButton } from './LogoutButton';
import styles from './admin.module.css';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const links = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/analytics', label: 'Analytics' },
    { href: '/admin/products', label: 'Products' },
    { href: '/admin/categories', label: 'Categories' },
    { href: '/admin/orders', label: 'Orders' },
    { href: '/admin/banners', label: 'Banners' },
    { href: '/admin/gallery', label: 'Gallery' },
    { href: '/admin/settings', label: 'Settings' },
  ];

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <>
      <div className={styles.adminBar}>
        <Link className={styles.adminBrand} href="/admin/dashboard">Shine Secure Admin</Link>
        <nav className={styles.adminNav} aria-label="Admin navigation">
          {links.map((link) => (
            <Link className={pathname.startsWith(link.href) ? styles.activeAdminLink : undefined} href={link.href} key={link.href}>{link.label}</Link>
          ))}
          <LogoutButton />
        </nav>
      </div>
      {children}
    </>
  );
}
