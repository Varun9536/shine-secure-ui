export type ProductImage = {
  url: string;
  publicId?: string;
  alt?: string;
};

export type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
};

export type Product = {
  _id: string;
  title: string;
  slug: string;
  sku: string;
  price: number;
  description: string;
  category?: Category;
  tags: string[];
  images: ProductImage[];
  stock: number;
  isWaterproof: boolean;
  isAntiTarnish: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  metaTitle?: string;
  metaDescription?: string;
};

export type ProductListResponse = {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  unavailable?: boolean;
};

export type SiteSettings = {
  businessName?: string;
  tagline?: string;
  whatsappNumber?: string;
  instagramUrl?: string;
  email?: string;
  phone?: string;
  address?: string;
  footerText?: string;
  aboutContent?: string;
  helpContent?: string;
  contactContent?: string;
};

export type GalleryItem = {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  images?: Array<{ url: string; alt?: string; publicId?: string }>;
};

export type Banner = {
  _id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  imageAlt?: string;
  linkUrl?: string;
};
