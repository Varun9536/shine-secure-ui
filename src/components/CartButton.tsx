'use client';

import { ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import styles from './CartButton.module.css';

export function CartButton() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const load = () => {
      try {
        const items = JSON.parse(localStorage.getItem('shine-secure-cart') ?? '[]') as Array<unknown>;
        setCount(items.length);
      } catch {
        localStorage.removeItem('shine-secure-cart');
        setCount(0);
      }
    };
    load();
    window.addEventListener('shine-secure-cart-updated', load);
    return () => window.removeEventListener('shine-secure-cart-updated', load);
  }, []);

  return (
    <button className={styles.button} onClick={() => window.dispatchEvent(new Event('shine-secure-cart-open'))} aria-label="Open inquiry cart">
      <ShoppingBag size={18} />
      <span className={styles.label}>Inquiry Cart</span>
      <span className={styles.count}>{count}</span>
    </button>
  );
}
