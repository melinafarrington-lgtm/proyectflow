import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [payments, setPayments] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/payments', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json())
      .then(d => setPayments(Array.isArray(d) ? d : []))
      .catch(console.error);
  }, []);

  const totalPending = payments.filter(p => p.status === 'pending' || p.status === 'overdue').reduce((s, p) => s + p.amount, 0);
  const totalPaid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const statusColors = { pending: 'bg-yellow-100 text-yellow-800', paid: 'bg-green-100 text-green-800', overdue: 'bg-red-100 text-red-800', cancelled: 'bg-gray-100 text-gray-800' };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Panel Administración</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
          <h3 className="text-gray-500 text-sm uppercase">Saldos Pendientes</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">${totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm uppercase">Total Cobrado</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">${totalPaid.toLocaleString()}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b"><h3 className="text-xl font-bold">Historial de Pagos</h3></div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr><th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Proyecto</th><th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Cliente</th><th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Monto</th><th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Estado</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium">{p.project_name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{p.client_name}</td>
                <td className="px-6 py-4 text-sm font-bold">${p.amount.toLocaleString()}</td>
                <td className="px-6 py-4"><span className={'px-2 py-1 text-xs font-medium rounded-full ' + (statusColors[p.status] || 'bg-gray-100')}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
