'use client';

import { MessageCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createWhatsappOrder } from '@/lib/api';
import type { Product } from '@/lib/types';
import { InquiryDetailsModal } from './InquiryDetailsModal';
import styles from './InquiryCart.module.css';

type CartItem = { product: Product; quantity: number };

export function InquiryCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const load = () => {
      try {
        setItems(JSON.parse(localStorage.getItem('shine-secure-cart') ?? '[]') as CartItem[]);
      } catch {
        localStorage.removeItem('shine-secure-cart');
        setItems([]);
      }
    };
    load();
    window.addEventListener('shine-secure-cart-updated', load);
    const open = () => {
      setModalOpen(false);
      setDrawerOpen(true);
    };
    window.addEventListener('shine-secure-cart-open', open);
    return () => {
      window.removeEventListener('shine-secure-cart-updated', load);
      window.removeEventListener('shine-secure-cart-open', open);
    };
  }, []);

  function remove(productId: string) {
    const next = items.filter((item) => item.product._id !== productId);
    localStorage.setItem('shine-secure-cart', JSON.stringify(next));
    setItems(next);
  }

  async function send(details?: { customerName?: string; customerPhone?: string; customerAddress?: string; message?: string }) {
    setLoading(true);
    setError('');
    try {
      const inquiry = await createWhatsappOrder(items, details);
      localStorage.removeItem('shine-secure-cart');
      setItems([]);
      window.location.href = inquiry.whatsappUrl;
    } catch {
      setError('Could not send inquiry. Please try again or contact us directly on WhatsApp.');
    } finally {
      setLoading(false);
    }
  }

  if (!drawerOpen) return null;

  return (
    <div className={styles.backdrop}>
      <button className={styles.scrim} onClick={() => {
        setModalOpen(false);
        setDrawerOpen(false);
      }} aria-label="Close inquiry cart" />
      <aside className={styles.cart} aria-label="WhatsApp inquiry cart">
        <div className={styles.header}>
          <div>
            <strong>Inquiry Cart</strong>
            <p>{items.length ? `${items.length} selected item${items.length > 1 ? 's' : ''}` : 'No products selected yet.'}</p>
          </div>
          <button className={styles.close} onClick={() => {
            setModalOpen(false);
            setDrawerOpen(false);
          }} aria-label="Close cart"><X size={18} /></button>
        </div>
        <div className={styles.items}>
          {items.map((item) => (
            <article key={item.product._id}>
              <div>
                <strong>{item.product.title}</strong>
                <span>{item.product.sku} - Rs. {item.product.price.toLocaleString('en-IN')} - Qty {item.quantity}</span>
              </div>
              <button onClick={() => remove(item.product._id)} aria-label={`Remove ${item.product.title}`}>
                <X size={15} />
              </button>
            </article>
          ))}
          {!items.length ? <p className={styles.empty}>Add products from any product detail page.</p> : null}
        </div>
        {error ? <p className={styles.error}>{error}</p> : null}
        <button className={styles.send} onClick={() => setModalOpen(true)} disabled={loading || !items.length}>
          <MessageCircle size={17} />
          {loading ? 'Opening WhatsApp' : 'Send Inquiry'}
        </button>
      </aside>
      <InquiryDetailsModal open={modalOpen} loading={loading} onClose={() => setModalOpen(false)} onSubmit={(details) => void send(details)} />
    </div>
  );
}
