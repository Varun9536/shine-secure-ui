'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/admin-api';
import styles from '../admin.module.css';

type OrderItem = {
  title: string;
  sku: string;
  price: number;
  quantity: number;
};

type OrderRequest = {
  _id: string;
  items: OrderItem[];
  status: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  message?: string;
  sourcePage?: string;
  whatsappUrl?: string;
  createdAt: string;
};

export function OrderAdmin() {
  const [orders, setOrders] = useState<OrderRequest[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    setLoading(true);
    const response = await adminFetch('/orders');
    if (!response.ok) {
      setError('Could not load orders. Login again if your session expired.');
      setLoading(false);
      return;
    }
    setOrders(await response.json());
    setLoading(false);
  }

  useEffect(() => {
    void loadOrders();
  }, []);

  async function updateStatus(id: string, status: string) {
    setMessage('');
    const response = await adminFetch(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    if (response.ok) await loadOrders();
  }

  async function copy(value: string, label: string) {
    await navigator.clipboard.writeText(value);
    setMessage(`${label} copied.`);
  }

  return (
    <section className={styles.panel}>
      <h2>WhatsApp Order Requests</h2>
      {error ? <span className={styles.error}>{error}</span> : null}
      {message ? <span className={styles.message}>{message}</span> : null}
      <div className={styles.list}>
        {loading ? <p className={styles.empty}>Loading order requests...</p> : null}
        {orders.map((order) => (
          <article className={styles.item} key={order._id}>
            <strong>{order.items.map((item) => item.title).join(', ')}</strong>
            <span>{new Date(order.createdAt).toLocaleString()} - {order.status}</span>
            {order.customerName || order.customerPhone ? <p>Customer: {order.customerName || 'N/A'} - {order.customerPhone || 'N/A'}</p> : null}
            {order.customerAddress ? <p>Address: {order.customerAddress}</p> : null}
            {order.message ? <p>Message: {order.message}</p> : null}
            {order.items.map((item) => (
              <p key={`${order._id}-${item.sku}`}>{item.sku} - Rs. {item.price.toLocaleString('en-IN')} - Qty {item.quantity}</p>
            ))}
            <div className={styles.row}>
              <select value={order.status} onChange={(event) => void updateStatus(order._id, event.target.value)}>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {order.whatsappUrl ? <a className={styles.buttonLink} href={order.whatsappUrl} target="_blank" rel="noopener noreferrer">Open WhatsApp</a> : null}
            </div>
            <div className={styles.actionRow}>
              {order.customerPhone ? <button className={styles.secondaryButton} type="button" onClick={() => void copy(order.customerPhone!, 'Phone')}>Copy phone</button> : null}
              {order.customerAddress ? <button className={styles.secondaryButton} type="button" onClick={() => void copy(order.customerAddress!, 'Address')}>Copy address</button> : null}
              <button className={styles.buttonLink} type="button" onClick={() => void updateStatus(order._id, 'contacted')}>Mark contacted</button>
            </div>
          </article>
        ))}
        {!loading && !orders.length ? <p className={styles.empty}>No WhatsApp order requests yet.</p> : null}
      </div>
    </section>
  );
}
