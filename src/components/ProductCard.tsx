import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { ProductCardActions } from './ProductCardActions';
import styles from './ProductCard.module.css';

export function ProductCard({ product }: { product: Product }) {
  const productImages = product.images ?? [];
  const images = productImages.length
    ? productImages
    : [{ url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80', alt: product.title }];

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap} aria-label={`${product.title} images`}>
        {images.map((image, index) => (
          <Link href={`/products/${product.slug}`} className={styles.slide} key={`${product._id}-${image.url}-${index}`}>
            <Image
              src={image.url}
              alt={image.alt ?? product.title}
              fill
              sizes="(max-width: 560px) 100vw, (max-width: 1100px) 50vw, 25vw"
              className={styles.image}
            />
          </Link>
        ))}
      </div>
      {images.length > 1 ? (
        <div className={styles.imageCount} aria-label={`${images.length} product images`}>
          <strong>1 / {images.length}</strong>
          {images.slice(0, 5).map((image, index) => <span key={`${image.url}-${index}`} />)}
        </div>
      ) : null}
      <div className={styles.body}>
        <div>
          <p className={styles.sku}>{product.sku}</p>
          <h3>{product.title}</h3>
        </div>
        <p className={styles.description}>{product.description}</p>
        <p className={styles.price}>Rs. {product.price.toLocaleString('en-IN')}</p>
        <div className={styles.labels}>
          <span>{product.stock > 0 ? 'In stock' : 'Out of stock'}</span>
          {product.isWaterproof ? <span>Waterproof</span> : null}
          {product.isAntiTarnish ? <span>Anti-tarnish</span> : null}
        </div>
        <ProductCardActions product={product} />
      </div>
    </article>
  );
}
