import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const menuItems = {
  master: [
    { name: 'Dashboard', href: '/dashboard/master', icon: '📊' },
    { name: 'Proyectos', href: '/projects', icon: '📁' },
    { name: 'Clientes', href: '/clients', icon: '👥' },
    { name: 'Pagos', href: '/payments', icon: '💰' },
    { name: 'Tareas', href: '/tasks', icon: '✅' },
    { name: 'Reportes', href: '/reports', icon: '📈' },
    { name: 'Usuarios', href: '/users', icon: '👤' },
  ],
  full: [
    { name: 'Dashboard', href: '/dashboard/full', icon: '📊' },
    { name: 'Proyectos', href: '/projects', icon: '📁' },
    { name: 'Clientes', href: '/clients', icon: '👥' },
    { name: 'Pagos', href: '/payments', icon: '💰' },
    { name: 'Tareas', href: '/tasks', icon: '✅' },
    { name: 'Reportes', href: '/reports', icon: '📈' },
  ],
  admin: [
    { name: 'Dashboard', href: '/dashboard/admin', icon: '📊' },
    { name: 'Pagos', href: '/payments', icon: '💰' },
    { name: 'Saldos', href: '/balances', icon: '⏳' },
  ],
  designer: [
    { name: 'Mis Tareas', href: '/dashboard/designer', icon: '✅' },
    { name: 'Proyectos', href: '/completed-projects', icon: '📁' },
  ],
  community_manager: [
    { name: 'Tareas', href: '/dashboard/community_manager', icon: '✅' },
    { name: 'Aprobaciones', href: '/approvals', icon: '🔔' },
    { name: 'Timelines', href: '/timelines', icon: '📅' },
  ],
};

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) router.push('/login');
    else setUser(JSON.parse(userData));
  }, [router]);
  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const roleMenu = menuItems[user.role] || [];

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600 italic">ProyectFlow</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {roleMenu.map(item => (
            <Link key={item.name} href={item.href} className={'flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors ' + (router.pathname === item.href ? 'bg-blue-100 text-blue-600' : 'text-gray-600')}>
              <span className="mr-3">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">{user.name?.[0] || 'U'}</div>
            <div className="ml-3"><p className="text-sm font-bold text-gray-700">{user.name}</p><p className="text-xs text-gray-500">{user.role}</p></div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <span className="mr-3">🚪</span><span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
