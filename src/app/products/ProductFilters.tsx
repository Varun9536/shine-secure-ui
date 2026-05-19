'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import styles from './products.module.css';

type CategoryOption = {
  _id: string;
  name: string;
};

export function ProductFilters({ categories }: { categories: CategoryOption[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get('search') ?? '');
  const [category, setCategory] = useState(params.get('category') ?? 'all');
  const [stock, setStock] = useState(params.get('stock') ?? 'all');
  const [sort, setSort] = useState(params.get('sort') ?? 'newest');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = new URLSearchParams();
    if (search) next.set('search', search);
    if (category !== 'all') next.set('category', category);
    if (stock !== 'all') next.set('stock', stock);
    if (sort !== 'newest') next.set('sort', sort);
    next.set('page', '1');
    router.push(`/products?${next.toString()}`);
  }

  return (
    <form className={styles.toolbar} onSubmit={submit}>
      <label className={styles.search}>
        <Search size={18} />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search jewellery, SKU, tags" />
      </label>
      <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Category">
        <option value="all">All categories</option>
        {categories.map((item) => <option value={item._id} key={item._id}>{item.name}</option>)}
      </select>
      <select value={stock} onChange={(event) => setStock(event.target.value)} aria-label="Availability">
        <option value="all">All stock</option>
        <option value="in-stock">In stock</option>
        <option value="out-of-stock">Out of stock</option>
      </select>
      <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products">
        <option value="newest">Newest</option>
        <option value="name">Name</option>
        <option value="price-low">Price low to high</option>
        <option value="price-high">Price high to low</option>
      </select>
      <button>Apply</button>
      {(search || category !== 'all' || stock !== 'all' || sort !== 'newest') ? <button type="button" className={styles.clearButton} onClick={() => router.push('/products')}>Clear</button> : null}
    </form>
  );
}
