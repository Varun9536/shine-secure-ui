'use client';

import { FormEvent, useState } from 'react';
import { X } from 'lucide-react';
import type { Product } from '@/lib/types';
import styles from './InquiryDetailsModal.module.css';

type Details = {
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  message?: string;
};

export function InquiryDetailsModal({
  open,
  loading,
  items,
  onClose,
  onSubmit,
}: {
  open: boolean;
  loading: boolean;
  items: Array<{ product: Product; quantity: number }>;
  onClose: () => void;
  onSubmit: (details: Details) => void;
}) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [message, setMessage] = useState('');

  if (!open) return null;
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ customerName, customerPhone, customerAddress, message });
  }

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-label="Inquiry details">
      <form className={styles.modal} onSubmit={submit}>
        <div className={styles.header}>
          <h2>Send Inquiry</h2>
          <button type="button" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <p>Add your details before WhatsApp opens.</p>
        <div className={styles.summary} aria-label="Inquiry summary">
          {items.map((item) => (
            <div key={item.product._id}>
              <span>{item.product.title}</span>
              <strong>Qty {item.quantity} - Rs. {(item.product.price * item.quantity).toLocaleString('en-IN')}</strong>
            </div>
          ))}
          <div>
            <span>Estimated total</span>
            <strong>Rs. {total.toLocaleString('en-IN')}</strong>
          </div>
        </div>
        <label>
          Name
          <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Your name" required />
        </label>
        <label>
          Phone
          <input type="tel" inputMode="tel" value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="Your phone number" required />
        </label>
        <label>
          Address
          <textarea value={customerAddress} onChange={(event) => setCustomerAddress(event.target.value)} placeholder="Full delivery address" required />
        </label>
        <label>
          Message
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Size, color, delivery question..." />
        </label>
        <button disabled={loading}>{loading ? 'Opening WhatsApp...' : 'Continue to WhatsApp'}</button>
      </form>
    </div>
  );
}
