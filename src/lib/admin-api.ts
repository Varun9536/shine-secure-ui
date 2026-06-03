export const adminApiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export function getCsrfToken() {
  if (typeof document === 'undefined') return '';
  const cookieToken = document.cookie
    .split('; ')
    .find((item) => item.startsWith('csrf_token='));
  if (cookieToken) return decodeURIComponent(cookieToken.split('=').slice(1).join('='));
  return window.localStorage.getItem('csrf_token') ?? '';
}

export function setCsrfToken(token?: string) {
  if (typeof window === 'undefined' || !token) return;
  window.localStorage.setItem('csrf_token', token);
}

export function clearCsrfToken() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem('csrf_token');
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

  const refresh = async () => {
    const refreshed = await fetch(`${adminApiBase}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'x-csrf-token': getCsrfToken() },
    });

    if (!refreshed.ok) return false;
    const refreshBody = await refreshed.json().catch(() => null);
    setCsrfToken(refreshBody?.csrfToken);
    return true;
  };

  let response = await request();
  if (response.status === 401) {
    if (!(await refresh())) return response;
    return request();
  }

  if (response.status === 403) {
    const responseBody = await response.clone().json().catch(() => null);
    if (responseBody?.message === 'Invalid CSRF token' && await refresh()) {
      response = await request();
    }
  }
  return response;
}
