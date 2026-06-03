import Image from 'next/image';
import Link from 'next/link';
import { getGalleryItems } from '@/lib/api';
import { pageMetadata } from '@/lib/seo';
import styles from '../page.module.css';

export const metadata = pageMetadata({
  title: 'Event Gallery',
  description: 'Browse Shine Secure event jewellery gallery images, styling highlights, and collection showcases.',
  path: '/gallery',
});

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <main className={styles.section}>
      <div className={styles.sectionHeader}>
        <h1>Event Gallery</h1>
        <p>Browse event styling, showcase images, and collection highlights.</p>
      </div>
      <div className={styles.galleryGrid}>
        {(items.length ? items : [
          { _id: 'wedding', slug: 'wedding', title: 'Wedding collection', description: 'Upload real gallery images from the admin panel later.', imageUrl: '' },
          { _id: 'festive', slug: 'festive', title: 'Festive styling', description: 'Upload real gallery images from the admin panel later.', imageUrl: '' },
          { _id: 'party', slug: 'party', title: 'Party wear', description: 'Upload real gallery images from the admin panel later.', imageUrl: '' },
          { _id: 'gifts', slug: 'gifts', title: 'Gift sets', description: 'Upload real gallery images from the admin panel later.', imageUrl: '' },
        ]).map((item) => (
          <Link className={styles.galleryAlbum} href={`/gallery/${item.slug ?? item._id}`} key={item._id}>
            <div className={styles.albumMosaic}>
              {(item.images?.length ? item.images : item.imageUrl ? [{ url: item.imageUrl, alt: item.imageAlt ?? item.title }] : []).slice(0, 4).map((image, index) => (
                <Image
                  src={image.url}
                  alt={image.alt ?? item.title}
                  width={720}
                  height={520}
                  key={`${item._id}-${image.url}`}
                  priority={index === 0}
                />
              ))}
            </div>
            <div className={styles.albumMeta}>
              <span>{item.images?.length || (item.imageUrl ? 1 : 0)} images</span>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
