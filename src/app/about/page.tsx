import { getSettings } from '@/lib/api';
import styles from '../page.module.css';

export const metadata = {
  title: 'About',
  description: 'About Shine Secure, our founders, team, mission, and jewellery quality.'
};

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <main>
      <section className={`${styles.section} ${styles.aboutHero}`}>
        <div>
          <p className={styles.eyebrow}>About the brand</p>
          <h1>Shine Secure</h1>
          <p>{settings.aboutContent}</p>
        </div>
        <div className={styles.aboutPanel}>
          <span>Built around</span>
          <strong>Everyday elegance, event-ready styling, and easy WhatsApp ordering.</strong>
          <p>Our catalogue is shaped for customers who want jewellery that looks polished, photographs beautifully, and is simple to inquire about.</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.eyebrow}>Leadership</p>
            <h2>Founder & Co-Founder</h2>
          </div>
        </div>
        <div className={styles.teamGrid}>
          <article className={styles.teamCard}>
            <div className={styles.avatar}>SS</div>
            <span>Founder</span>
            <h2>Founder Name</h2>
            <p>Leads the brand vision, product direction, and customer-first approach for Shine Secure. This name can be replaced with the original founder name later.</p>
          </article>
          <article className={styles.teamCard}>
            <div className={styles.avatar}>PD</div>
            <span>Co-Founder</span>
            <h2>Priyanka Dhobal</h2>
            <p>Supports collection planning, customer experience, presentation, and the detail-focused work that helps each product feel ready for real occasions.</p>
          </article>
        </div>
      </section>

      <section className={`${styles.section} ${styles.band}`}>
        <div>
          <p className={styles.eyebrow}>What we focus on</p>
          <h2>Jewellery that feels premium without making ordering complicated.</h2>
          <p>Shine Secure is designed around curated artificial jewellery, clean product presentation, quick inquiry handling, and a gallery-led experience for events and fairs.</p>
        </div>
        <div className={styles.bandPanel}>
          <span>Quality</span>
          <strong>Selected styles</strong>
          <p>Anti-tarnish, waterproof, and occasion-ready labels can be managed from admin.</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.eyebrow}>Website</p>
            <h2>Digital Experience</h2>
          </div>
        </div>
        <div className={styles.developerCredit}>
          <span>Developed by</span>
          <h2>Website Developer</h2>
          <p>You can add your name here as the developer. It is completely fine to include a tasteful credit, especially if you built and maintain the website.</p>
        </div>
      </section>
    </main>
  );
}
