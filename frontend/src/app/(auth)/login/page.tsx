'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.ok && data.accessToken) {
        localStorage.setItem('fe_token', data.accessToken);
        setMessage('Login realizado com sucesso');
        // redirect to dashboard
        window.location.href = '/';
      } else {
        setMessage(data.message || 'Erro ao autenticar');
      }
    } catch (err) {
      setMessage('Erro de conexão');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h3 className="text-2xl font-semibold">Entrar</h3>
      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block text-sm">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm">Senha</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
        </div>
        <div className="flex items-center justify-between">
          <button disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded">{loading ? 'Entrando...' : 'Entrar'}</button>
          <a href="#" className="text-sm text-indigo-600">Esqueci a senha</a>
        </div>
      </form>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}
