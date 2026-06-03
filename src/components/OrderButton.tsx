'use client';

import { MessageCircle, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { createWhatsappOrder } from '@/lib/api';
import type { Product } from '@/lib/types';
import { InquiryDetailsModal } from './InquiryDetailsModal';
import styles from './OrderButton.module.css';

export function OrderButton({ product }: { product: Product }) {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');

  async function orderNow(details?: { customerName?: string; customerPhone?: string; customerAddress?: string; message?: string }) {
    setLoading(true);
    setError('');
    try {
      const inquiry = await createWhatsappOrder([{ product, quantity: 1 }], details);
      window.location.href = inquiry.whatsappUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not open WhatsApp inquiry. Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  }

  function addToCart() {
    let current: Array<{ product: Product; quantity: number }>;
    try {
      current = JSON.parse(localStorage.getItem('shine-secure-cart') ?? '[]') as Array<{ product: Product; quantity: number }>;
    } catch {
      current = [];
      localStorage.removeItem('shine-secure-cart');
    }
    const existing = current.find((item) => item.product._id === product._id);
    const next = existing
      ? current.map((item) => item.product._id === product._id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...current, { product, quantity: 1 }];
    localStorage.setItem('shine-secure-cart', JSON.stringify(next));
    window.dispatchEvent(new Event('shine-secure-cart-updated'));
    window.dispatchEvent(new Event('shine-secure-cart-open'));
  }

  return (
    <>
      <div className={styles.actions}>
        <button className={styles.primary} onClick={() => setModalOpen(true)} disabled={loading || product.stock < 1}>
          <MessageCircle size={18} />
          {loading ? 'Opening WhatsApp' : product.stock < 1 ? 'Out of Stock' : 'Order on WhatsApp'}
        </button>
        <button className={styles.secondary} onClick={addToCart} disabled={product.stock < 1} aria-label="Add to inquiry cart">
          <ShoppingBag size={18} />
          Add to Inquiry
        </button>
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}
      <InquiryDetailsModal
        open={modalOpen}
        loading={loading}
        items={[{ product, quantity: 1 }]}
        onClose={() => setModalOpen(false)}
        onSubmit={(details) => void orderNow(details)}
      />
    </>
  );
}
