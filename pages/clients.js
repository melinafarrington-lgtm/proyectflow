import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/clients', { headers: { Authorization: 'Bearer ' + token } }).then(r => r.json()).then(d => setClients(Array.isArray(d) ? d : [])).catch(console.error);
  }, []);
  return <Layout>
    <h2 className="text-3xl font-bold text-gray-800 mb-8">👥 Clientes</h2>
    <div className="grid gap-4 md:grid-cols-2">
      {clients.map(c => <div key={c.id} className="bg-white p-6 rounded-xl shadow-md"><h3 className="text-xl font-bold">{c.name}</h3>{c.company && <p className="text-sm text-gray-500">{c.company}</p>}{c.email && <p className="text-sm text-gray-600">{c.email}</p>}{c.phone && <p className="text-sm text-gray-600">{c.phone}</p>}</div>)}
    </div>
  </Layout>;
}
