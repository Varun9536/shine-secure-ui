import Link from 'next/link';
import styles from './products.module.css';

export function Pagination({ page, pages, params }: { page: number; pages: number; params: Record<string, string> }) {
  if (pages <= 1) return null;

  function href(nextPage: number) {
    const next = new URLSearchParams(params);
    next.set('page', String(nextPage));
    return `/products?${next.toString()}`;
  }

  return (
    <nav className={styles.pagination} aria-label="Product pagination">
      {page > 1 ? <Link href={href(page - 1)}>Previous</Link> : <span />}
      <span>Page {page} of {pages}</span>
      {page < pages ? <Link href={href(page + 1)}>Next</Link> : <span />}
    </nav>
  );
}
