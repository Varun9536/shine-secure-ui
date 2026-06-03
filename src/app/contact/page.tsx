import { getSettings } from '@/lib/api';
import { pageMetadata } from '@/lib/seo';
import styles from '../page.module.css';

export const metadata = pageMetadata({
  title: 'Contact',
  description: 'Contact Shine Secure for artificial jewellery orders, WhatsApp inquiries, and support.',
  path: '/contact',
});

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <main className={styles.section}>
      <div className={styles.sectionHeader}>
        <h1>Contact</h1>
      </div>
      <p>{settings.contactContent}</p>
      <p>Email: {settings.email ?? 'hello@shinesecure.example'}</p>
      <p>Phone: {settings.phone ?? '+91 95368 55214'}</p>
      <p>Instagram: {settings.instagramUrl ?? 'https://www.instagram.com/shine_secure?igsh=MTVidHV3ZTJmbHFuMQ%3D%3D'}</p>
      <p>Address: {settings.address ?? 'Address will be updated from admin settings.'}</p>
    </main>
  );
}
