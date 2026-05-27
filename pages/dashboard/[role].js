import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import MasterDashboard from '../../components/dashboards/MasterDashboard';
import FullDashboard from '../../components/dashboards/FullDashboard';
import AdminDashboard from '../../components/dashboards/AdminDashboard';
import DesignerDashboard from '../../components/dashboards/DesignerDashboard';
import CommunityManagerDashboard from '../../components/dashboards/CommunityManagerDashboard';

export default function Dashboard() {
  const router = useRouter();
  const { role } = router.query;
  const dashboards = {
    master: <MasterDashboard />,
    full: <FullDashboard />,
    admin: <AdminDashboard />,
    designer: <DesignerDashboard />,
    community_manager: <CommunityManagerDashboard />,
  };
  return <Layout>{dashboards[role] || <div className="text-center py-20 text-gray-500">Cargando...</div>}</Layout>;
}
