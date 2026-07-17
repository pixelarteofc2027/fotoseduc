'use client';
import { useState } from 'react';
import { post } from '../../lib/api';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return setStatus('Selecione um arquivo');
    setStatus('Pedindo presigned URL...');
    const token = localStorage.getItem('fe_token');
    const res = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/api/upload/presign', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ filename: file.name, contentType: file.type }) });
    const data = await res.json();
    if (!data.ok) return setStatus('Erro ao obter presigned URL');
    setStatus('Fazendo upload para storage...');
    const put = await fetch(data.url, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
    if (![200,201].includes(put.status)) return setStatus('Erro no upload');
    setStatus('Informando backend...');
    const complete = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/api/upload/complete', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ key: data.key, galleryId: 1 }) });
    const c = await complete.json();
    if (c.ok) setStatus('Upload realizado e processado');
    else setStatus('Erro ao completar upload');
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h3 className="text-xl font-semibold">Upload de Foto</h3>
      <form onSubmit={onUpload} className="mt-4 space-y-4">
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded">Enviar</button>
        </div>
      </form>
      <p className="mt-3 text-sm">{status}</p>
    </div>
  );
}
