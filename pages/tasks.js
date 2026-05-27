import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/tasks', { headers: { Authorization: 'Bearer ' + token } }).then(r => r.json()).then(d => setTasks(Array.isArray(d) ? d : [])).catch(console.error);
  }, []);
  const sc = { pending: 'bg-yellow-100 text-yellow-800', in_progress: 'bg-blue-100 text-blue-800', for_approval: 'bg-purple-100 text-purple-800', approved: 'bg-green-100 text-green-800', completed: 'bg-gray-100 text-gray-800' };
  return <Layout>
    <h2 className="text-3xl font-bold text-gray-800 mb-8">✅ Tareas</h2>
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Título</th><th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Proyecto</th><th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Asignado</th><th className="px-6 py-3 text-left text-xs uppercase text-gray-500">Estado</th></tr></thead>
        <tbody className="divide-y divide-gray-200">{tasks.map(t => <tr key={t.id} className="hover:bg-gray-50"><td className="px-6 py-4 text-sm font-medium">{t.title}</td><td className="px-6 py-4 text-sm text-gray-500">{t.project_name}</td><td className="px-6 py-4 text-sm text-gray-500">{t.assigned_to_name}</td><td className="px-6 py-4"><span className={'px-2 py-1 text-xs font-medium rounded-full ' + (sc[t.status] || 'bg-gray-100')}>{t.status}</span></td></tr>)}</tbody>
      </table>
    </div>
  </Layout>;
}
