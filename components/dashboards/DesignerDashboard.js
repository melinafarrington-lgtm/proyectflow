import { useState, useEffect } from 'react';

export default function DesignerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ task_id: '', hours: '', description: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    Promise.all([
      fetch('/api/tasks/my', { headers: { Authorization: 'Bearer ' + token } }).then(r => r.json()),
      fetch('/api/projects', { headers: { Authorization: 'Bearer ' + token } }).then(r => r.json()),
    ]).then(([t, p]) => { setTasks(Array.isArray(t) ? t : []); setProjects(Array.isArray(p) ? p : []); }).catch(console.error);
  }, []);

  const statusColors = { pending: 'bg-yellow-100 text-yellow-800', in_progress: 'bg-blue-100 text-blue-800', for_approval: 'bg-purple-100 text-purple-800', approved: 'bg-green-100 text-green-800', completed: 'bg-gray-100 text-gray-800' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('/api/time-entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ task_id: parseInt(form.task_id), hours: parseFloat(form.hours), description: form.description }),
    });
    setMsg(res.ok ? '✅ Tiempo registrado' : '❌ Error');
    if (res.ok) setForm({ task_id: '', hours: '', description: '' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl shadow-md">
        <div className="p-6 border-b"><h3 className="text-xl font-bold">Mis Tareas</h3></div>
        <div className="p-6 space-y-3">
          {tasks.map(t => (
            <div key={t.id} className="p-4 border rounded-lg flex justify-between items-start">
              <div><h4 className="font-semibold">{t.title}</h4><p className="text-sm text-gray-500">{t.project_name}</p></div>
              <span className={'px-2 py-1 text-xs font-medium rounded-full ' + (statusColors[t.status] || 'bg-gray-100')}>{t.status}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="p-6 border-b"><h3 className="text-xl font-bold">⏱️ Time Tracker</h3></div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <select className="w-full px-4 py-2 border rounded-lg" value={form.task_id} onChange={e => setForm({ ...form, task_id: e.target.value })} required>
                <option value="">Seleccionar tarea...</option>
                {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
              <input type="number" step="0.5" min="0.25" className="w-full px-4 py-2 border rounded-lg" placeholder="Horas" value={form.hours} onChange={e => setForm({ ...form, hours: e.target.value })} required />
              <textarea className="w-full px-4 py-2 border rounded-lg" rows="2" placeholder="Descripción" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium">Registrar Tiempo</button>
              {msg && <p className="text-sm text-center">{msg}</p>}
            </form>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md">
          <div className="p-6 border-b"><h3 className="text-xl font-bold">📁 Proyectos</h3></div>
          <div className="p-6 space-y-2">
            {projects.map(p => (
              <div key={p.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div><p className="font-medium">{p.name}</p><p className="text-xs text-gray-500">{p.client_name}</p></div>
                <span className={'px-2 py-1 text-xs font-medium rounded-full ' + (p.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800')}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
