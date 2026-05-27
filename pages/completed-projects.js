import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
export default function CompletedProjects() {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/projects', { headers: { Authorization: 'Bearer ' + token } }).then(r => r.json()).then(d => setProjects(Array.isArray(d) ? d.filter(p => p.status === 'completed') : [])).catch(console.error);
  }, []);
  return <Layout>
    <h2 className="text-3xl font-bold text-gray-800 mb-8">📁 Proyectos Finalizados</h2>
    <div className="grid gap-4 md:grid-cols-2">{projects.map(p => <div key={p.id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500"><h3 className="text-xl font-bold">{p.name}</h3><p className="text-sm text-gray-500">{p.client_name}</p><p className="text-sm mt-2">${(p.budget_hours * p.hourly_rate || 0).toLocaleString()}</p></div>)}</div>
  </Layout>;
}
