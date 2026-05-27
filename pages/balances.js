import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
export default function BalancesPage() {
  const [payments, setPayments] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/payments', { headers: { Authorization: 'Bearer ' + token } }).then(r => r.json()).then(d => setPayments(Array.isArray(d) ? d : [])).catch(console.error);
  }, []);
  const pending = payments.filter(p => p.status === 'pending' || p.status === 'overdue');
  const total = pending.reduce((s, p) => s + p.amount, 0);
  const byClient = {};
  pending.forEach(p => { const k = p.client_name || 'Sin cliente'; if (!byClient[k]) byClient[k] = { name: k, total: 0, items: [] }; byClient[k].total += p.amount; byClient[k].items.push(p); });
  return <Layout>
    <h2 className="text-3xl font-bold text-gray-800 mb-8">⏳ Saldos Pendientes</h2>
    <div className="bg-white p-6 rounded-xl shadow-md mb-8 border-l-4 border-yellow-500"><h3 className="text-gray-500 text-sm uppercase">Total por Cobrar</h3><p className="text-4xl font-bold text-yellow-600 mt-2">${total.toLocaleString()}</p></div>
    {Object.values(byClient).map(c => <div key={c.name} className="bg-white rounded-xl shadow-md mb-4 p-6"><div className="flex justify-between"><h3 className="text-xl font-bold">{c.name}</h3><span className="text-xl font-bold text-yellow-600">${c.total.toLocaleString()}</span></div></div>)}
  </Layout>;
}
