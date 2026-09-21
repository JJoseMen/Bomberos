import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Plus,
  Bell,
  User,
  Settings,
  DollarSign,
  Users,
  Award,
  ClipboardList,
} from 'lucide-react';
import type { ReactNode } from 'react';
import styles from './Sidebar.module.scss';

interface SidebarItem {
  label: string;
  icon: ReactNode;
  path: string;
}

interface SidebarProps {
  items: SidebarItem[];
  isOpen?: boolean;
  onClose?: () => void;
}

const ICON_MAP: Record<string, ReactNode> = {
  dashboard: <LayoutDashboard size={20} />,
  solicitudes: <FileText size={20} />,
  nueva: <Plus size={20} />,
  notificaciones: <Bell size={20} />,
  perfil: <User size={20} />,
  usuarios: <Users size={20} />,
  certificados: <Award size={20} />,
  pagos: <DollarSign size={20} />,
  reportes: <ClipboardList size={20} />,
  config: <Settings size={20} />,
};

export function Sidebar({ items, isOpen = false, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <nav className={styles.nav}>
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.link} ${isActive || location.pathname.startsWith(item.path) ? styles.active : ''}`
              }
              onClick={onClose}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export { ICON_MAP };
