import { getSettings } from '@/lib/api';
import { pageMetadata } from '@/lib/seo';
import styles from '../page.module.css';

export const metadata = pageMetadata({
  title: 'Help',
  description: 'Help and ordering information for Shine Secure artificial jewellery and WhatsApp inquiries.',
  path: '/help',
});

export default async function HelpPage() {
  const settings = await getSettings();

  return (
    <main className={styles.section}>
      <div className={styles.sectionHeader}>
        <h1>Help</h1>
      </div>
      <p>{settings.helpContent}</p>
    </main>
  );
}
