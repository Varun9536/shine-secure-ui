'use client';

import { FormEvent, useEffect, useState } from 'react';
import { adminFetch } from '@/lib/admin-api';
import styles from '../admin.module.css';

type Settings = {
  businessName?: string;
  tagline?: string;
  whatsappNumber?: string;
  instagramUrl?: string;
  email?: string;
  phone?: string;
  address?: string;
  footerText?: string;
  aboutContent?: string;
  helpContent?: string;
  contactContent?: string;
};

export function SettingsAdmin() {
  const [settings, setSettings] = useState<Settings>({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    adminFetch('/settings')
      .then((response) => response.json())
      .then(setSettings)
      .catch(() => setError('Could not load settings.'));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setError('');

    if (settings.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
      setError('Enter a valid email address.');
      return;
    }

    if (settings.instagramUrl && !/^https?:\/\/.+/i.test(settings.instagramUrl)) {
      setError('Instagram URL must start with http:// or https://.');
      return;
    }

    if (settings.whatsappNumber && settings.whatsappNumber.replace(/\D/g, '').length < 10) {
      setError('Enter a valid WhatsApp number with country code.');
      return;
    }

    const response = await adminFetch('/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      setError('Could not save settings. Login again if your session expired.');
      return;
    }

    setSettings(await response.json());
    setMessage('Settings saved.');
  }

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  return (
    <form className={styles.panel} onSubmit={submit}>
      <h2>Site Settings</h2>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="businessName">Business name</label>
          <input id="businessName" value={settings.businessName ?? ''} onChange={(event) => update('businessName', event.target.value)} />
        </div>
        <div className={styles.field}>
          <label htmlFor="tagline">Tagline</label>
          <input id="tagline" value={settings.tagline ?? ''} onChange={(event) => update('tagline', event.target.value)} />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="whatsappNumber">WhatsApp number</label>
          <input id="whatsappNumber" type="tel" inputMode="tel" value={settings.whatsappNumber ?? ''} onChange={(event) => update('whatsappNumber', event.target.value)} />
        </div>
        <div className={styles.field}>
          <label htmlFor="instagramUrl">Instagram URL</label>
          <input id="instagramUrl" type="url" value={settings.instagramUrl ?? ''} onChange={(event) => update('instagramUrl', event.target.value)} />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={settings.email ?? ''} onChange={(event) => update('email', event.target.value)} />
        </div>
        <div className={styles.field}>
          <label htmlFor="phone">Phone</label>
          <input id="phone" type="tel" inputMode="tel" value={settings.phone ?? ''} onChange={(event) => update('phone', event.target.value)} />
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor="address">Address</label>
        <textarea id="address" value={settings.address ?? ''} onChange={(event) => update('address', event.target.value)} />
      </div>
      <div className={styles.field}>
        <label htmlFor="footerText">Footer text</label>
        <textarea id="footerText" value={settings.footerText ?? ''} onChange={(event) => update('footerText', event.target.value)} />
      </div>
      <div className={styles.field}>
        <label htmlFor="aboutContent">About content</label>
        <textarea id="aboutContent" value={settings.aboutContent ?? ''} onChange={(event) => update('aboutContent', event.target.value)} />
      </div>
      <div className={styles.field}>
        <label htmlFor="helpContent">Help content</label>
        <textarea id="helpContent" value={settings.helpContent ?? ''} onChange={(event) => update('helpContent', event.target.value)} />
      </div>
      <div className={styles.field}>
        <label htmlFor="contactContent">Contact content</label>
        <textarea id="contactContent" value={settings.contactContent ?? ''} onChange={(event) => update('contactContent', event.target.value)} />
      </div>
      {message ? <span className={styles.message}>{message}</span> : null}
      {error ? <span className={styles.error}>{error}</span> : null}
      <button className={styles.button}>Save Settings</button>
    </form>
  );
}
