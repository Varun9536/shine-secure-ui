'use client';

import Link from 'next/link';
import { Eye, ShoppingBag } from 'lucide-react';
import type { Product } from '@/lib/types';
import styles from './ProductCard.module.css';

function readCart() {
  try {
    return JSON.parse(localStorage.getItem('shine-secure-cart') ?? '[]') as Array<{ product: Product; quantity: number }>;
  } catch {
    localStorage.removeItem('shine-secure-cart');
    return [];
  }
}

export function ProductCardActions({ product }: { product: Product }) {
  function addToCart() {
    const current = readCart();
    const existing = current.find((item) => item.product._id === product._id);
    const next = existing
      ? current.map((item) => item.product._id === product._id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...current, { product, quantity: 1 }];

    localStorage.setItem('shine-secure-cart', JSON.stringify(next));
    window.dispatchEvent(new Event('shine-secure-cart-updated'));
    window.dispatchEvent(new Event('shine-secure-cart-open'));
  }

  return (
    <div className={styles.actions}>
      <Link className={styles.viewAction} href={`/products/${product.slug}`}>
        <Eye size={16} /> View
      </Link>
      <button className={styles.addAction} type="button" onClick={addToCart} disabled={product.stock < 1}>
        <ShoppingBag size={16} /> {product.stock < 1 ? 'Out' : 'Add'}
      </button>
    </div>
  );
}
