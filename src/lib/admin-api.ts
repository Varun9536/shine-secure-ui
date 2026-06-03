export const adminApiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export function getCsrfToken() {
  if (typeof document === 'undefined') return '';
  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith('csrf_token='));
  return cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=')) : '';
}

export async function adminFetch(input: string, init: RequestInit = {}) {
  const method = (init.method ?? 'GET').toUpperCase();
  const needsCsrf = !['GET', 'HEAD', 'OPTIONS'].includes(method);

  const buildHeaders = () => {
    const headers = new Headers(init.headers);

    if (!(init.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    if (needsCsrf) {
      headers.set('x-csrf-token', getCsrfToken());
    }

    return headers;
  };

  const request = () => fetch(`${adminApiBase}${input}`, {
    ...init,
    credentials: 'include',
    headers: buildHeaders(),
  });

  let response = await request();
  if (response.status !== 401) return response;

  const refreshed = await fetch(`${adminApiBase}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'x-csrf-token': getCsrfToken() },
  });

  if (!refreshed.ok) return response;
  response = await request();
  return response;
}
