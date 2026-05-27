import type { Banner, GalleryItem, Product, ProductListResponse, SiteSettings } from './types';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

const fallbackProducts: Product[] = [
  {
    _id: 'sample-necklace',
    title: 'Gold Plated Pearl Necklace',
    slug: 'gold-plated-pearl-necklace',
    sku: 'SS-NK-1001',
    price: 1299,
    description: 'A lightweight pearl necklace with a premium gold-plated finish for daily and event wear.',
    tags: ['necklace', 'pearl', 'gold plated'],
    stock: 12,
    isWaterproof: true,
    isAntiTarnish: true,
    isFeatured: true,
    isTrending: true,
    images: [{ url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80', alt: 'Gold plated pearl necklace' }]
  },
  {
    _id: 'sample-earrings',
    title: 'Crystal Drop Earrings',
    slug: 'crystal-drop-earrings',
    sku: 'SS-ER-1002',
    price: 799,
    description: 'Elegant drop earrings with a crystal shine and comfortable all-day fit.',
    tags: ['earrings', 'crystal'],
    stock: 8,
    isWaterproof: false,
    isAntiTarnish: true,
    isFeatured: true,
    isTrending: false,
    images: [{ url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80', alt: 'Crystal drop earrings' }]
  }
];

export async function getProducts(params = ''): Promise<ProductListResponse> {
  try {
    const response = await fetch(`${apiBase}/products${params}`, { next: { revalidate: 60 } });
    if (!response.ok) throw new Error('Products unavailable');
    return response.json();
  } catch {
    if (process.env.NODE_ENV === 'production') {
      return { items: [], total: 0, page: 1, limit: 24, pages: 1, unavailable: true };
    }
    return { items: fallbackProducts, total: fallbackProducts.length, page: 1, limit: 24, pages: 1 };
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`${apiBase}/products/slug/${slug}`, { next: { revalidate: 60 } });
    if (!response.ok) throw new Error('Product unavailable');
    return response.json();
  } catch {
    return fallbackProducts.find((product) => product.slug === slug) ?? null;
  }
}

export async function getCategory(slug: string) {
  try {
    const response = await fetch(`${apiBase}/categories/slug/${slug}`, { next: { revalidate: 60 } });
    if (!response.ok) throw new Error('Category unavailable');
    return response.json() as Promise<{ _id: string; name: string; slug: string; description?: string; metaTitle?: string; metaDescription?: string }>;
  } catch {
    return null;
  }
}

export async function getCategories() {
  try {
    const response = await fetch(`${apiBase}/categories`, { next: { revalidate: 60 } });
    if (!response.ok) throw new Error('Categories unavailable');
    return response.json() as Promise<Array<{ _id: string; name: string; slug: string; description?: string }>>;
  } catch {
    return [
      { _id: 'necklaces', name: 'Necklaces', slug: 'necklaces' },
      { _id: 'earrings', name: 'Earrings', slug: 'earrings' },
      { _id: 'rings', name: 'Rings', slug: 'rings' },
      { _id: 'bangles', name: 'Bangles', slug: 'bangles' },
    ];
  }
}

export async function createWhatsappOrder(
  items: Array<{ product: Product; quantity: number }>,
  customer?: { customerName?: string; customerPhone?: string; customerAddress?: string; message?: string },
) {
  const response = await fetch(`${apiBase}/orders/whatsapp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sourcePage: typeof window !== 'undefined' ? window.location.href : undefined,
      ...customer,
      items: items.map(({ product, quantity }) => ({
        product: product._id,
        quantity
      }))
    })
  });

  if (!response.ok) throw new Error('Could not create WhatsApp inquiry');
  return response.json() as Promise<{ whatsappUrl: string }>;
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const response = await fetch(`${apiBase}/settings`, { next: { revalidate: 60 } });
    if (!response.ok) throw new Error('Settings unavailable');
    return response.json();
  } catch {
    return {
      businessName: 'Shine Secure',
      tagline: 'Premium artificial jewellery',
      instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? 'https://www.instagram.com/shine_secure?igsh=MTVidHV3ZTJmbHFuMQ%3D%3D',
      email: 'hello@shinesecure.example',
      phone: '+91 95368 55214',
      aboutContent: 'Shine Secure curates artificial jewellery for everyday wear, gifting, and occasion styling with a focus on clean finishing and easy WhatsApp ordering.',
      helpContent: 'Browse products, add your choices to the inquiry cart, share your name, phone number, and address, then send the prepared WhatsApp message for confirmation.',
      contactContent: 'For product availability, order support, bulk inquiries, or styling help, contact Shine Secure through WhatsApp, Instagram, or email.',
    };
  }
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const response = await fetch(`${apiBase}/gallery`, { next: { revalidate: 60 } });
    if (!response.ok) throw new Error('Gallery unavailable');
    return response.json();
  } catch {
    return [];
  }
}

export async function getGalleryItem(slug: string): Promise<GalleryItem | null> {
  try {
    const response = await fetch(`${apiBase}/gallery/${slug}`, { next: { revalidate: 60 } });
    if (!response.ok) throw new Error('Gallery album unavailable');
    return response.json();
  } catch {
    return null;
  }
}

export async function getBanners(): Promise<Banner[]> {
  try {
    const response = await fetch(`${apiBase}/banners`, { next: { revalidate: 60 } });
    if (!response.ok) throw new Error('Banners unavailable');
    return response.json();
  } catch {
    return [];
  }
}
