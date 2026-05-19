'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/admin-api';
import styles from '../admin.module.css';

type Stats = {
  products: {
    total: number;
    active: number;
    deleted: number;
    featured: number;
    trending: number;
    lowStock: number;
    outOfStock: number;
    popular: Array<{ _id: string; title: string; viewCount: number; whatsappClickCount: number }>;
  };
  orders: {
    total: number;
    new: number;
    contacted: number;
    converted: number;
    cancelled: number;
  };
  categories: number;
};

export function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminFetch('/dashboard/stats')
      .then((response) => {
        if (!response.ok) throw new Error('Could not load dashboard stats.');
        return response.json();
      })
      .then(setStats)
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) return <span className={styles.error}>{error}</span>;
  if (!stats) return <span className={styles.message}>Loading dashboard stats...</span>;

  return (
    <>
      <div className={styles.statsGrid}>
        <article><strong>{stats.products.active}</strong><span>Active products</span></article>
        <article><strong>{stats.orders.total}</strong><span>Order requests</span></article>
        <article><strong>{stats.categories}</strong><span>Categories</span></article>
        <article><strong>{stats.products.lowStock}</strong><span>Low stock</span></article>
        <article><strong>{stats.products.outOfStock}</strong><span>Out of stock</span></article>
        <article><strong>{stats.orders.converted}</strong><span>Converted</span></article>
      </div>
      <section className={styles.panel}>
        <h2>Order Status</h2>
        <div className={styles.chart}>
          {[
            ['New', stats.orders.new],
            ['Contacted', stats.orders.contacted],
            ['Converted', stats.orders.converted],
            ['Cancelled', stats.orders.cancelled],
          ].map(([label, value]) => (
            <div className={styles.barRow} key={label}>
              <span>{label}</span>
              <div><i style={{ width: `${stats.orders.total ? (Number(value) / stats.orders.total) * 100 : 0}%` }} /></div>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className={styles.panel}>
        <h2>Popular Products</h2>
        <div className={styles.list}>
          {stats.products.popular.map((product) => (
            <article className={styles.item} key={product._id}>
              <strong>{product.title}</strong>
              <span>{product.viewCount} views - {product.whatsappClickCount} WhatsApp clicks</span>
            </article>
          ))}
          {!stats.products.popular.length ? <p className={styles.empty}>No product analytics yet.</p> : null}
        </div>
      </section>
    </>
  );
}
