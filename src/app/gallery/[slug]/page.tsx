import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGalleryItem } from '@/lib/api';
import styles from '../../page.module.css';

export const metadata = {
  title: 'Gallery Album',
  description: 'Browse Shine Secure jewellery gallery album images.'
};

export default async function GalleryAlbumPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const album = await getGalleryItem(slug);
  if (!album) notFound();

  const images = album.images?.length
    ? album.images
    : album.imageUrl
      ? [{ url: album.imageUrl, alt: album.imageAlt ?? album.title }]
      : [];

  return (
    <main className={styles.section}>
      <div className={styles.albumHero}>
        <div>
          <Link className={styles.textLink} href="/gallery">Back to gallery</Link>
          <h1>{album.title}</h1>
          <p>{album.description}</p>
          <span>{images.length} images</span>
        </div>
        {images[0] ? (
          <Image src={images[0].url} alt={images[0].alt ?? album.title} width={1100} height={720} priority />
        ) : null}
      </div>

      <div className={styles.albumDetailGrid}>
        {images.map((image, index) => (
          <figure className={index % 5 === 0 ? styles.featuredAlbumImage : undefined} key={`${album._id}-${image.url}`}>
            <Image src={image.url} alt={image.alt ?? album.title} width={900} height={1100} />
          </figure>
        ))}
      </div>
    </main>
  );
}
