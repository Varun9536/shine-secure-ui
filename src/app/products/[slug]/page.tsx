import Image from 'next/image';
import { notFound } from 'next/navigation';
import { OrderButton } from '@/components/OrderButton';
import { ProductCard } from '@/components/ProductCard';
import { getProduct, getProducts } from '@/lib/api';
import styles from './page.module.css';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.metaTitle ?? product.title,
    description: product.metaDescription ?? product.description
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const productImages = product.images ?? [];
  const images = productImages.length
    ? productImages
    : [{ url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80', alt: product.title }];
  const related = await getProducts(product.category?._id ? `?category=${product.category._id}&limit=4` : '?trending=true&limit=4');
  const relatedItems = related.items.filter((item) => item._id !== product._id).slice(0, 3);

  return (
    <main>
      <div className={styles.detail}>
        <div>
          <div className={styles.imageWrap} aria-label={`${product.title} images`}>
            {images.map((image, index) => (
              <div className={styles.slide} id={`image-${index + 1}`} key={`${product._id}-${image.url}-${index}`}>
                <Image
                  src={image.url}
                  alt={image.alt ?? product.title}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 860px) 100vw, 50vw"
                  className={styles.image}
                />
                {images.length > 1 ? (
                  <div className={styles.galleryControls}>
                    <a href={`#image-${index === 0 ? images.length : index}`} aria-label="Previous image">Prev</a>
                    <span>{index + 1} / {images.length}</span>
                    <a href={`#image-${index === images.length - 1 ? 1 : index + 2}`} aria-label="Next image">Next</a>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          {images.length > 1 ? (
            <div className={styles.thumbnails} aria-label={`${images.length} product images`}>
              {images.map((image, index) => (
                <a href={`#image-${index + 1}`} key={`${image.url}-${index}`}>
                  <Image src={image.url} alt={image.alt ?? product.title} width={72} height={72} />
                </a>
              ))}
            </div>
          ) : null}
        </div>
        <section className={styles.content}>
          <p className={styles.eyebrow}>Product detail</p>
          <p className={styles.sku}>SKU: {product.sku}</p>
          <h1>{product.title}</h1>
          <p className={styles.price}>Rs. {product.price.toLocaleString('en-IN')}</p>
          <p className={styles.description}>{product.description}</p>
          <div className={styles.labels}>
            <span>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
            {product.isWaterproof ? <span>Waterproof</span> : null}
            {product.isAntiTarnish ? <span>Anti-tarnish</span> : null}
          </div>
          <div className={styles.metaBox}>
            <span>Order method</span>
            <strong>WhatsApp inquiry</strong>
            <p>Share your details once, then WhatsApp opens with this product already added. Availability and delivery are confirmed before payment.</p>
          </div>
          <OrderButton product={product} />
        </section>
      </div>
      {relatedItems.length ? (
        <section className={styles.related}>
          <div className={styles.relatedHeader}>
            <p className={styles.eyebrow}>More styles</p>
            <h2>Related Products</h2>
          </div>
          <div className={styles.relatedGrid}>
            {relatedItems.map((item) => <ProductCard product={item} key={item._id} />)}
          </div>
        </section>
      ) : null}
    </main>
  );
}
