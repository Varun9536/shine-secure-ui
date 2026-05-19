'use client';

import { Download } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { adminApiBase, adminFetch } from '@/lib/admin-api';
import styles from '../admin.module.css';

type Status = 'new' | 'contacted' | 'converted' | 'cancelled';

type Analytics = {
  products: {
    active: number;
    lowStock: number;
    outOfStock: number;
  };
  orders: Record<Status, number> & { total: number };
  orderAnalytics: {
    statusCounts: Array<{ _id: Status; count: number }>;
    periodStatusCounts: Array<{ _id: { period: 'today' | 'week' | 'month' | 'year'; status: Status }; count: number }>;
    productInterest: Array<{ title: string; sku: string; quantity: number; inquiries: number; estimatedValue: number }>;
    dailyRequests: Array<{ _id: string; count: number; estimatedValue: number }>;
    monthlyRequests: Array<{ _id: string; count: number; estimatedValue: number }>;
    totals: {
      totalOrders: number;
      estimatedValue: number;
      totalQuantity: number;
      averageOrderValue: number;
    };
  };
};

const statuses: Array<{ key: Status; label: string }> = [
  { key: 'new', label: 'New' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'converted', label: 'Converted' },
  { key: 'cancelled', label: 'Cancelled' },
];

const periods = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'Last 7 days' },
  { key: 'month', label: 'Last 30 days' },
  { key: 'year', label: 'This year' },
] as const;

function currency(value: number) {
  return `Rs. ${value.toLocaleString('en-IN')}`;
}

function maxOf(rows: Array<{ count?: number; quantity?: number; estimatedValue?: number }>, key: 'count' | 'quantity' | 'estimatedValue') {
  return Math.max(1, ...rows.map((row) => Number(row[key] ?? 0)));
}

export function AnalyticsAdmin() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    adminFetch('/dashboard/analytics')
      .then((response) => {
        if (!response.ok) throw new Error('Could not load analytics.');
        return response.json();
      })
      .then(setAnalytics)
      .catch((err: Error) => setError(err.message));
  }, []);

  const periodRows = useMemo(() => {
    if (!analytics) return [];
    return periods.map((period) => {
      const rows = analytics.orderAnalytics.periodStatusCounts.filter((row) => row._id.period === period.key);
      return {
        ...period,
        total: rows.reduce((sum, row) => sum + row.count, 0),
        statuses: statuses.map((status) => ({
          ...status,
          count: rows.find((row) => row._id.status === status.key)?.count ?? 0,
        })),
      };
    });
  }, [analytics]);

  async function downloadCsv() {
    setDownloading(true);
    setError('');
    try {
      const response = await fetch(`${adminApiBase}/orders/export.csv`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Could not download CSV. Login again if your session expired.');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `shine-secure-orders-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'CSV download failed.');
    } finally {
      setDownloading(false);
    }
  }

  if (error) return <span className={styles.error}>{error}</span>;
  if (!analytics) return <span className={styles.message}>Loading analytics...</span>;

  const statusTotal = Math.max(1, analytics.orders.total);
  const dailyMax = maxOf(analytics.orderAnalytics.dailyRequests, 'count');
  const monthMax = maxOf(analytics.orderAnalytics.monthlyRequests, 'count');
  const productMax = maxOf(analytics.orderAnalytics.productInterest, 'quantity');

  return (
    <div className={styles.analyticsStack}>
      <div className={styles.actionRow}>
        <button className={styles.button} onClick={() => void downloadCsv()} disabled={downloading}>
          <Download size={16} /> {downloading ? 'Preparing CSV...' : 'Download Orders CSV'}
        </button>
      </div>

      <div className={styles.statsGrid}>
        <article><strong>{analytics.orderAnalytics.totals.totalOrders}</strong><span>Total inquiries</span></article>
        <article><strong>{analytics.orderAnalytics.totals.totalQuantity}</strong><span>Product quantity</span></article>
        <article><strong>{currency(analytics.orderAnalytics.totals.estimatedValue)}</strong><span>Estimated value</span></article>
        <article><strong>{currency(analytics.orderAnalytics.totals.averageOrderValue)}</strong><span>Average inquiry</span></article>
        <article><strong>{analytics.products.lowStock}</strong><span>Low stock</span></article>
        <article><strong>{analytics.products.outOfStock}</strong><span>Out of stock</span></article>
      </div>

      <section className={styles.panel}>
        <div className={styles.splitHeader}>
          <h2>Status Overview</h2>
          <span className={styles.empty}>{analytics.orders.total} total inquiries</span>
        </div>
        <div className={styles.chartGrid}>
          {statuses.map((status) => {
            const value = analytics.orderAnalytics.statusCounts.find((row) => row._id === status.key)?.count ?? 0;
            return (
              <article className={styles.donutCard} key={status.key}>
                <div
                  className={styles.donut}
                  style={{ '--percent': `${Math.round((value / statusTotal) * 100)}%` } as React.CSSProperties}
                >
                  <strong>{value}</strong>
                </div>
                <span>{status.label}</span>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.panel}>
        <h2>Today, Weekly, Monthly, Yearly Status</h2>
        <div className={styles.periodGrid}>
          {periodRows.map((period) => (
            <article className={styles.periodCard} key={period.key}>
              <div className={styles.splitHeader}>
                <strong>{period.label}</strong>
                <span>{period.total}</span>
              </div>
              {period.statuses.map((status) => (
                <div className={styles.barRow} key={status.key}>
                  <span>{status.label}</span>
                  <div><i style={{ width: `${period.total ? (status.count / period.total) * 100 : 0}%` }} /></div>
                  <strong>{status.count}</strong>
                </div>
              ))}
            </article>
          ))}
        </div>
      </section>

      <section className={styles.panel}>
        <h2>Daily Requests - Last 30 Days</h2>
        <div className={styles.columnChart}>
          {analytics.orderAnalytics.dailyRequests.map((row) => (
            <div className={styles.column} key={row._id} title={`${row._id}: ${row.count} inquiries, ${currency(row.estimatedValue)}`}>
              <i style={{ height: `${Math.max(8, (row.count / dailyMax) * 100)}%` }} />
              <span>{row._id.slice(5)}</span>
            </div>
          ))}
          {!analytics.orderAnalytics.dailyRequests.length ? <p className={styles.empty}>No recent order inquiries.</p> : null}
        </div>
      </section>

      <section className={styles.panel}>
        <h2>Monthly Requests - This Year</h2>
        <div className={styles.columnChart}>
          {analytics.orderAnalytics.monthlyRequests.map((row) => (
            <div className={styles.column} key={row._id} title={`${row._id}: ${row.count} inquiries, ${currency(row.estimatedValue)}`}>
              <i style={{ height: `${Math.max(8, (row.count / monthMax) * 100)}%` }} />
              <span>{row._id}</span>
            </div>
          ))}
          {!analytics.orderAnalytics.monthlyRequests.length ? <p className={styles.empty}>No yearly order inquiries.</p> : null}
        </div>
      </section>

      <section className={styles.panel}>
        <h2>Product Interest</h2>
        <div className={styles.chart}>
          {analytics.orderAnalytics.productInterest.map((product) => (
            <div className={styles.barRowWide} key={product.sku}>
              <span>{product.title}</span>
              <div><i style={{ width: `${(product.quantity / productMax) * 100}%` }} /></div>
              <strong>{product.quantity} qty / {currency(product.estimatedValue)}</strong>
            </div>
          ))}
          {!analytics.orderAnalytics.productInterest.length ? <p className={styles.empty}>No product inquiry data yet.</p> : null}
        </div>
      </section>
    </div>
  );
}
