import type { Metadata } from 'next';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { getSettings } from '@/lib/api';
import { AdminHeaderLinks } from '@/components/AdminHeaderLinks';
import { CartButton } from '@/components/CartButton';
import { InquiryCart } from '@/components/InquiryCart';
import { MobileNav } from '@/components/MobileNav';
import { absoluteUrl, siteUrl } from '@/lib/seo';
import './globals.css';
import styles from './layout.module.css';

export const metadata: Metadata = {
  title: {
    default: 'Shine Secure | Artificial Jewellery',
    template: '%s | Shine Secure'
  },
  description: 'Premium artificial jewellery with WhatsApp ordering.',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: absoluteUrl('/'),
  },
  openGraph: {
    title: 'Shine Secure | Artificial Jewellery',
    description: 'Premium artificial jewellery with WhatsApp ordering.',
    url: absoluteUrl('/'),
    siteName: 'Shine Secure',
    type: 'website',
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSettings();
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: settings.businessName ?? 'Shine Secure',
    url: absoluteUrl('/'),
    description: settings.tagline ?? 'Premium artificial jewellery with WhatsApp ordering.',
    email: settings.email,
    telephone: settings.phone,
    address: settings.address,
    sameAs: settings.instagramUrl ? [settings.instagramUrl] : undefined,
  };

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <header className={styles.header}>
          <div className={styles.topLine}>
            <span>{settings.tagline ?? 'Premium artificial jewellery'}</span>
            <AdminHeaderLinks />
          </div>
          <div className={styles.bar}>
            <Link className={styles.brand} href="/">
              <span>{(settings.businessName ?? 'Shine Secure').split(' ')[0]}</span> {(settings.businessName ?? 'Shine Secure').split(' ').slice(1).join(' ') || 'Secure'}
            </Link>
            <nav className={styles.nav} aria-label="Main navigation">
              <Link href="/">Home</Link>
              <Link href="/products">Products</Link>
              <Link href="/categories">Categories</Link>
              <Link href="/gallery">Gallery</Link>
              <Link href="/about">About</Link>
              <Link href="/help">Help</Link>
              <Link href="/contact">Contact</Link>
            </nav>
            <div className={styles.tools} aria-label="Store tools">
              <Link href="/products" aria-label="Search products"><Search size={18} /></Link>
              <CartButton />
            </div>
            <MobileNav />
          </div>
        </header>
        {children}
        <InquiryCart />
        <footer className={styles.footer}>
          <div className={styles.footerBrand}>
            <strong>Shine Secure</strong>
            <p>{settings.footerText ?? 'Premium artificial jewellery with quick WhatsApp ordering.'}</p>
          </div>
          <div className={styles.footerLinks}>
            <Link href="/products">Products</Link>
            <Link href="/help">Help</Link>
            <Link href="/contact">Contact</Link>
            {settings.instagramUrl ? <Link href={settings.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</Link> : null}
            <Link href="/admin/login">Admin Login</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
