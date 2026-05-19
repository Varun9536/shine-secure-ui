import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { getBanners, getProducts, getSettings } from '@/lib/api';
import styles from './page.module.css';

export default async function HomePage() {
  const featured = await getProducts('?featured=true&limit=4');
  const trending = await getProducts('?trending=true&limit=4');
  const settings = await getSettings();
  const banners = await getBanners();
  const hero = banners[0];

  return (
    <main>
      <section className={styles.hero} style={hero?.imageUrl ? { backgroundImage: `linear-gradient(90deg, rgba(8, 7, 5, 0.9), rgba(8, 7, 5, 0.52) 46%, rgba(8, 7, 5, 0.18)), url(${hero.imageUrl})` } : undefined}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Anti-tarnish artificial jewellery</p>
          <h1>{hero?.title ?? settings.businessName ?? 'Shine Secure'}</h1>
          <p>{hero?.subtitle ?? settings.tagline ?? 'Curated necklaces, earrings, rings, and occasion sets with fast WhatsApp ordering and boutique-style presentation.'}</p>
          <div className={styles.heroActions}>
            <Link className={styles.button} href="/products">Shop Collection</Link>
            <Link className={styles.ghostButton} href="/gallery">View Gallery</Link>
          </div>
          <div className={styles.stats}>
            <span><strong>Waterproof</strong> selected styles</span>
            <span><strong>Anti-tarnish</strong> finish</span>
            <span><strong>WhatsApp</strong> ordering</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.eyebrow}>Editor picks</p>
            <h2>Featured Products</h2>
          </div>
          <Link className={styles.textLink} href="/products">View all products</Link>
        </div>
        <div className={styles.grid}>{featured.items.map((product) => <ProductCard key={product._id} product={product} />)}</div>
      </section>

      <section className={`${styles.section} ${styles.band}`}>
        <div>
          <p className={styles.eyebrow}>Event showcase</p>
          <h2>Jewellery for weddings, parties, and gifting.</h2>
          <p>Showcase bridal styling, festive looks, and curated gift sets with real photos once your original images are ready.</p>
        </div>
        <div className={styles.bandPanel}>
          <span>New season</span>
          <strong>Luxury look, easy ordering</strong>
          <p>Customers select products and send one WhatsApp inquiry.</p>
        </div>
        <Link className={styles.button} href="/gallery">Open Gallery</Link>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.eyebrow}>Popular now</p>
            <h2>Trending Jewellery</h2>
          </div>
          <Link className={styles.textLink} href="/products">Shop trending</Link>
        </div>
        <div className={styles.grid}>{trending.items.map((product) => <ProductCard key={product._id} product={product} />)}</div>
      </section>

      <section className={`${styles.section} ${styles.instagram}`}>
        <div>
          <p className={styles.eyebrow}>Instagram</p>
          <h2>Follow latest arrivals and styling updates.</h2>
          <p>Connect your original Instagram page here and feature real reels, drops, and event looks.</p>
        </div>
        <Link className={styles.button} href={settings.instagramUrl ?? 'https://www.instagram.com/shine_secure?igsh=MTVidHV3ZTJmbHFuMQ%3D%3D'} target="_blank" rel="noopener noreferrer">Open Instagram</Link>
      </section>
    </main>
  );
}
