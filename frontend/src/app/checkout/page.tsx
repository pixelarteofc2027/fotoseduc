'use client';
import { useState } from 'react';

export default function CheckoutPage() {
  const [orderId, setOrderId] = useState<number | null>(null);
  const [status, setStatus] = useState('');

  async function createOrder() {
    // For demo: create a simple order on backend
    const token = localStorage.getItem('fe_token');
    const resp = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/api/orders/create', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ items: [{ photoId: 1, priceCents: 1000, quantity: 1 }] }) });
    const json = await resp.json();
    if (!json.ok) return setStatus('Erro ao criar pedido');
    setOrderId(json.order.id);
    // create payment preference
    setStatus('Criando preferência de pagamento...');
    const pay = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/api/payments/create', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: json.order.id }) });
    const payj = await pay.json();
    if (payj.init_point) {
      window.location.href = payj.init_point;
    } else {
      setStatus('Erro ao iniciar pagamento');
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h3 className="text-xl font-semibold">Checkout</h3>
      <p className="mt-3 text-sm">Crie um pedido de exemplo e será redirecionado ao MercadoPago (sandbox).</p>
      <div className="mt-4">
        <button onClick={createOrder} className="px-4 py-2 bg-emerald-600 text-white rounded">Pagar (sandbox)</button>
      </div>
      <p className="mt-3 text-sm">{status}</p>
    </div>
  );
}
