'use client';

const API = (path: string, opts: RequestInit = {}) => {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const token = typeof window !== 'undefined' ? localStorage.getItem('fe_token') : null;
  const headers: Record<string,string> = { 'Content-Type': 'application/json', ...((opts.headers || {}) as Record<string,string>) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return fetch(base + path, { ...opts, headers });
};

export async function post(path: string, body: any) {
  const res = await API(path, { method: 'POST', body: JSON.stringify(body) });
  if (res.status === 401) {
    // try refresh
    const refreshToken = localStorage.getItem('fe_refresh_token');
    const refreshId = Number(localStorage.getItem('fe_refresh_id'));
    if (refreshToken && refreshId) {
      const r = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/api/auth/refresh', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: Number(localStorage.getItem('fe_user_id')), refreshToken }) });
      const rd = await r.json();
      if (rd && rd.accessToken) {
        localStorage.setItem('fe_token', rd.accessToken);
        return API(path, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${rd.accessToken}` } });
      }
    }
  }
  return res;
}
