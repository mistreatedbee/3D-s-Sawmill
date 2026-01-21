import { getLocalStorage, setLocalStorage } from './helpers';

/**
 * Fetch wrapper that:
 * - Adds Authorization header if auth_token exists
 * - If response is 401, clears auth and redirects to /portal (session expired)
 */
export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = getLocalStorage<string | null>('auth_token', null);
  const headers = new Headers(init.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(input, { ...init, headers });

  if (res.status === 401) {
    // Clear auth and force re-login
    setLocalStorage('auth_token', null);
    setLocalStorage('auth_user', null);

    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/portal')) {
      window.location.href = '/portal';
    }
  }

  return res;
}

