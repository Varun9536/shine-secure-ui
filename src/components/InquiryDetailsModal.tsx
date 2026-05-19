'use client';

import { FormEvent, useState } from 'react';
import { X } from 'lucide-react';
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
  onClose,
  onSubmit,
}: {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (details: Details) => void;
}) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [message, setMessage] = useState('');

  if (!open) return null;

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
