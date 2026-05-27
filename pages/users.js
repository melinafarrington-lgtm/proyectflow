import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
export default function UsersPage() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/users', { headers: { Authorization: 'Bearer ' + token } }).then(r => r.json()).then(d => setUsers(Array.isArray(d) ? d : [])).catch(console.error);
  }, []);
  const rc = { master: 'bg-red-100 text-red-800', full: 'bg-blue-100 text-blue-800', admin: 'bg-green-100 text-green-800', designer: 'bg-purple-100 text-purple-800', community_manager: 'bg-orange-100 text-orange-800' };
  return <Layout>
    <h2 className="text-3xl font-bold text-gray-800 mb-8">👤 Usuarios</h2>
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Nombre</th><th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Email</th><th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Rol</th><th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Estado</th></tr></thead>
        <tbody className="divide-y divide-gray-200">{users.map(u => <tr key={u.id} className="hover:bg-gray-50"><td className="px-6 py-4 text-sm font-medium">{u.name}</td><td className="px-6 py-4 text-sm text-gray-500">{u.email}</td><td className="px-6 py-4"><span className={'px-2 py-1 text-xs font-medium rounded-full ' + (rc[u.role] || 'bg-gray-100')}>{u.role}</span></td><td className="px-6 py-4"><span className={'px-2 py-1 text-xs font-medium rounded-full ' + (u.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>{u.active ? 'Activo' : 'Inactivo'}</span></td></tr>)}</tbody>
      </table>
    </div>
  </Layout>;
}
