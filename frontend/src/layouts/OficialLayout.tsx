import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Menu, LogOut, LayoutDashboard, FileText, ClipboardCheck, Award } from 'lucide-react';
import { Sidebar } from '@/components/shared/Sidebar/Sidebar';
import { useAuthStore } from '@/stores/auth.store';
import styles from './OficialLayout.module.scss';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/oficial/dashboard' },
  { label: 'Solicitudes', icon: <FileText size={20} />, path: '/oficial/solicitudes' },
  { label: 'Revision', icon: <ClipboardCheck size={20} />, path: '/oficial/revision' },
  { label: 'Certificados', icon: <Award size={20} />, path: '/oficial/certificados' },
];

export function OficialLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <Link to="/oficial/dashboard" className={styles.logo}>
            <div
              style={{
                width: 32,
                height: 32,
                background: '#fff',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2e7d32',
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              DNB
            </div>
            SIPPCI Oficial
          </Link>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.userName}>{user?.nombre}</span>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              padding: 8,
              borderRadius: 4,
            }}
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>
      <div className={styles.body}>
        <Sidebar items={SIDEBAR_ITEMS} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
