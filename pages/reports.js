import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
export default function ReportsPage() {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/projects', { headers: { Authorization: 'Bearer ' + token } }).then(r => r.json()).then(d => setProjects(Array.isArray(d) ? d : [])).catch(console.error);
  }, []);
  const total = projects.reduce((s, p) => s + (p.budget_hours * p.hourly_rate || 0), 0);
  return <Layout>
    <h2 className="text-3xl font-bold text-gray-800 mb-8">📈 Reportes</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-md"><h3 className="text-gray-500 text-sm uppercase">Proyectos</h3><p className="text-3xl font-bold mt-2">{projects.length}</p></div>
      <div className="bg-white p-6 rounded-xl shadow-md"><h3 className="text-gray-500 text-sm uppercase">Horas totales</h3><p className="text-3xl font-bold text-blue-600 mt-2">{projects.reduce((s, p) => s + (p.budget_hours || 0), 0)}h</p></div>
      <div className="bg-white p-6 rounded-xl shadow-md"><h3 className="text-gray-500 text-sm uppercase">Presupuesto Total</h3><p className="text-3xl font-bold text-green-600 mt-2">${total.toLocaleString()}</p></div>
    </div>
  </Layout>;
}
