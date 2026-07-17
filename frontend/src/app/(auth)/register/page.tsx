'use client';
import { useState } from 'react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      const data = await res.json();
      if (data.ok) {
        setMessage('Conta criada. Faça login.');
        setTimeout(() => (window.location.href = '/auth/login'), 1200);
      } else {
        setMessage(data.message || 'Erro ao criar conta');
      }
    } catch (err) {
      setMessage('Erro de conexão');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h3 className="text-2xl font-semibold">Criar conta</h3>
      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block text-sm">Nome</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm">Senha</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
        </div>
        <div>
          <button disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">{loading ? 'Criando...' : 'Criar conta'}</button>
        </div>
      </form>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}
