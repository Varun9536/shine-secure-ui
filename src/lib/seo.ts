import type { Metadata } from 'next';

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export function absoluteUrl(path = '/') {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  type = 'website',
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
}): Metadata {
  const url = absoluteUrl(path);
  const images = image ? [{ url: absoluteUrl(image) }] : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Shine Secure',
      type,
      images,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [absoluteUrl(image)] : undefined,
    },
  };
}

export function shortDescription(value?: string, fallback = 'Browse Shine Secure artificial jewellery.') {
  const text = (value ?? fallback).replace(/\s+/g, ' ').trim();
  return text.length > 155 ? `${text.slice(0, 152).trim()}...` : text;
}
