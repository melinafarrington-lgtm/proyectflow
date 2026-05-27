import { useState, useEffect } from 'react';

export default function CommunityManagerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [tab, setTab] = useState('pending');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/tasks/my', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json())
      .then(d => setTasks(Array.isArray(d) ? d : []))
      .catch(console.error);
  }, []);

  const statusColors = { pending: 'bg-yellow-100 text-yellow-800', in_progress: 'bg-blue-100 text-blue-800', for_approval: 'bg-purple-100 text-purple-800', approved: 'bg-green-100 text-green-800', scheduled: 'bg-indigo-100 text-indigo-800' };

  const filtered = {
    pending: tasks.filter(t => t.status === 'pending' || t.status === 'in_progress'),
    approval: tasks.filter(t => t.status === 'for_approval'),
    approved: tasks.filter(t => t.status === 'approved'),
    scheduled: tasks.filter(t => t.status === 'scheduled'),
  };

  const tabs = [
    { key: 'pending', label: '📋 Pendientes', count: filtered.pending.length },
    { key: 'approval', label: '🔔 Por Aprobar', count: filtered.approval.length },
    { key: 'approved', label: '✅ Aprobadas', count: filtered.approved.length },
    { key: 'scheduled', label: '📅 Cronogramas', count: filtered.scheduled.length },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Panel Community Manager</h2>
      <div className="bg-white rounded-xl shadow-md">
        <div className="border-b">
          <nav className="flex">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} className={'px-6 py-3 text-sm font-medium border-b-2 ' + (tab === t.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500')}>
                {t.label} ({t.count})
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6">
          {filtered[tab].length === 0 ? (
            <p className="text-gray-500 text-center py-8">Sin elementos</p>
          ) : (
            <div className="space-y-3">
              {filtered[tab].map(t => (
                <div key={t.id} className="p-4 border rounded-lg flex justify-between items-center">
                  <div><h4 className="font-semibold">{t.title}</h4><p className="text-sm text-gray-500">{t.project_name}</p></div>
                  <span className={'px-2 py-1 text-xs font-medium rounded-full ' + (statusColors[t.status] || 'bg-gray-100')}>{t.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
