import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/projects', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json())
      .then(d => setProjects(Array.isArray(d) ? d : []))
      .catch(console.error);
  }, []);
  return <Layout>
    <h2 className="text-3xl font-bold text-gray-800 mb-8">📁 Proyectos</h2>
    <div className="grid gap-4">
      {projects.map(p => <div key={p.id} className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between"><div><h3 className="text-xl font-bold">{p.name}</h3><p className="text-sm text-gray-500">{p.client_name}</p></div><span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">{p.status}</span></div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm"><div>Horas: <strong>{p.budget_hours}h</strong></div><div>Precio/h: <strong>${p.hourly_rate}</strong></div><div>Total: <strong>${(p.budget_hours * p.hourly_rate || 0).toLocaleString()}</strong></div></div>
      </div>)}
    </div>
  </Layout>;
}
