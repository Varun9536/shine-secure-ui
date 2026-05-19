import { getSettings } from '@/lib/api';
import styles from '../page.module.css';

export const metadata = {
  title: 'Help',
  description: 'Help and FAQs for ordering Shine Secure jewellery.'
};

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
