import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/payments', { headers: { Authorization: 'Bearer ' + token } }).then(r => r.json()).then(d => setPayments(Array.isArray(d) ? d : [])).catch(console.error);
  }, []);
  const sc = { pending: 'bg-yellow-100 text-yellow-800', paid: 'bg-green-100 text-green-800', overdue: 'bg-red-100 text-red-800' };
  return <Layout>
    <h2 className="text-3xl font-bold text-gray-800 mb-8">💰 Pagos</h2>
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Proyecto</th><th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Cliente</th><th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Monto</th><th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Estado</th></tr></thead>
        <tbody className="divide-y divide-gray-200">{payments.map(p => <tr key={p.id} className="hover:bg-gray-50"><td className="px-6 py-4 text-sm font-medium">{p.project_name}</td><td className="px-6 py-4 text-sm text-gray-500">{p.client_name}</td><td className="px-6 py-4 text-sm font-bold">${p.amount.toLocaleString()}</td><td className="px-6 py-4"><span className={'px-2 py-1 text-xs font-medium rounded-full ' + (sc[p.status] || 'bg-gray-100')}>{p.status}</span></td></tr>)}</tbody>
      </table>
    </div>
  </Layout>;
}
