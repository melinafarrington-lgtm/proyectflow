import { useState, useEffect } from 'react';

export default function MasterDashboard() {
  const [stats, setStats] = useState({ projects: 0, clients: 0, tasks: 0, payments: 0 });
  useEffect(() => {
    const token = localStorage.getItem('token');
    Promise.all([
      fetch('/api/projects', { headers: { Authorization: 'Bearer ' + token } }).then(r => r.json()),
      fetch('/api/clients', { headers: { Authorization: 'Bearer ' + token } }).then(r => r.json()),
      fetch('/api/tasks', { headers: { Authorization: 'Bearer ' + token } }).then(r => r.json()),
      fetch('/api/payments', { headers: { Authorization: 'Bearer ' + token } }).then(r => r.json()),
    ]).then(([p, c, t, pay]) => setStats({
      projects: Array.isArray(p) ? p.length : 0,
      clients: Array.isArray(c) ? c.length : 0,
      tasks: Array.isArray(t) ? t.length : 0,
      payments: Array.isArray(pay) ? pay.length : 0,
    })).catch(console.error);
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Panel Master</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md"><div className="text-4xl mb-2">📁</div><h3 className="text-gray-500 text-sm uppercase">Proyectos</h3><p className="text-3xl font-bold mt-2">{stats.projects}</p></div>
        <div className="bg-white p-6 rounded-xl shadow-md"><div className="text-4xl mb-2">👥</div><h3 className="text-gray-500 text-sm uppercase">Clientes</h3><p className="text-3xl font-bold mt-2">{stats.clients}</p></div>
        <div className="bg-white p-6 rounded-xl shadow-md"><div className="text-4xl mb-2">✅</div><h3 className="text-gray-500 text-sm uppercase">Tareas</h3><p className="text-3xl font-bold mt-2">{stats.tasks}</p></div>
        <div className="bg-white p-6 rounded-xl shadow-md"><div className="text-4xl mb-2">💰</div><h3 className="text-gray-500 text-sm uppercase">Pagos</h3><p className="text-3xl font-bold mt-2">{stats.payments}</p></div>
      </div>
    </div>
  );
}
