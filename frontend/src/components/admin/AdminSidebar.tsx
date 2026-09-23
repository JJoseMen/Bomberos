import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Flame,
  LayoutDashboard,
  FileText,
  Award,
  DollarSign,
  BarChart3,
  Users,
  Settings,
  Shield,
  ChevronDown,
  CheckCircle,
  FileCheck,
  BookOpen,
  UserPlus,
  ClipboardCheck,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import styles from './AdminSidebar.module.scss';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface MenuItem {
  label: string;
  path?: string;
  icon?: ReactNode;
  children?: MenuItem[];
  badge?: number;
}

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const { user } = useAuthStore();
  const location = useLocation();
  const rol = user?.tipo || 'ADMIN';

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Solicitudes: true,
    'Cumplimiento SIPPCI': true,
    Capacitaciones: true,
    'Registro de Profesionales': true,
    Pagos: true,
  });

  const toggle = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getMenuItems = (rolActual: string): MenuItem[] => {
    const dashboard: MenuItem = {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: <LayoutDashboard size={20} />,
    };

    switch (rolActual) {
      case 'GESTOR_CUMPLIMIENTO':
        return [
          dashboard,
          {
            label: 'Cumplimiento SIPPCI',
            icon: <Shield size={20} />,
            children: [
              { label: 'Solicitudes', path: '/admin/solicitudes', icon: <FileText size={18} /> },
              { label: 'Inspecciones', path: '/admin/solicitudes', icon: <ClipboardCheck size={18} /> },
              { label: 'Certificados', path: '/admin/certificados', icon: <Award size={18} /> },
            ],
          },
        ];
      case 'GESTOR_CAPACITACIONES':
        return [
          dashboard,
          {
            label: 'Capacitaciones',
            icon: <BookOpen size={20} />,
            children: [
              { label: 'Cursos', path: '/admin/solicitudes', icon: <BookOpen size={18} /> },
              { label: 'Programar', path: '/admin/solicitudes', icon: <FileText size={18} /> },
              { label: 'Inscripciones', path: '/admin/solicitudes', icon: <UserPlus size={18} /> },
              { label: 'Calificar', path: '/admin/solicitudes', icon: <CheckCircle size={18} /> },
              { label: 'Certificados', path: '/admin/certificados', icon: <Award size={18} /> },
            ],
          },
        ];
      case 'GESTOR_REGISTRO_PROFESIONAL':
        return [
          dashboard,
          {
            label: 'Registro de Profesionales',
            icon: <UserPlus size={20} />,
            children: [
              { label: 'Solicitudes PN', path: '/admin/solicitudes', icon: <FileText size={18} /> },
              { label: 'Solicitudes PJ', path: '/admin/solicitudes', icon: <FileCheck size={18} /> },
              { label: 'Certificados', path: '/admin/certificados', icon: <Award size={18} /> },
            ],
          },
        ];
      case 'CAJERO':
        return [
          dashboard,
          {
            label: 'Pagos',
            icon: <DollarSign size={20} />,
            children: [
              { label: 'Todos', path: '/admin/pagos', icon: <DollarSign size={18} /> },
              { label: 'Pendientes', path: '/admin/pagos', icon: <FileText size={18} /> },
              { label: 'Verificados', path: '/admin/pagos', icon: <CheckCircle size={18} /> },
              { label: 'Observados', path: '/admin/pagos', icon: <FileCheck size={18} /> },
            ],
          },
        ];
      case 'ADMIN':
      default:
        return [
          dashboard,
          {
            label: 'Solicitudes',
            icon: <FileText size={20} />,
            children: [
              { label: 'SIPPCI', path: '/admin/solicitudes', icon: <Shield size={18} /> },
              { label: 'Reglamentación', path: '/admin/solicitudes', icon: <FileCheck size={18} /> },
              { label: 'Turismo', path: '/admin/solicitudes', icon: <FileText size={18} /> },
            ],
          },
          { label: 'Certificados', path: '/admin/certificados', icon: <Award size={20} /> },
          { label: 'Pagos', path: '/admin/pagos', icon: <DollarSign size={20} /> },
          { label: 'Reportes', path: '/admin/reportes', icon: <BarChart3 size={20} /> },
          { label: 'Usuarios', path: '/admin/usuarios', icon: <Users size={20} /> },
          { label: 'Configuración', icon: <Settings size={20} /> },
          { label: 'Auditoría', path: '/admin/auditoria', icon: <ClipboardCheck size={20} /> },
        ];
    }
  };

  const menuItems = getMenuItems(rol);

  const isGroupActive = (item: MenuItem): boolean => {
    if (!item.children) return false;
    return item.children.some(
      (child) => child.path && location.pathname.startsWith(child.path),
    );
  };

  const renderBadge = (badge?: number) => {
    if (badge === undefined) return null;
    return (
      <span className={styles.badge} aria-label={`${badge} pendientes`}>
        {badge}
      </span>
    );
  };

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} aria-hidden="true" />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`} aria-label="Navegación administrativa">
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Flame size={20} aria-hidden="true" />
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>SIPPCI Admin</span>
            <span className={styles.logoSubtitle}>DNB - Policía Boliviana</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {menuItems.map((item) => {
            const key = item.label;

            if (item.children) {
              const isExpanded = expanded[key] ?? false;
              const active = isGroupActive(item);
              return (
                <div key={key} className={styles.group}>
                  <button
                    type="button"
                    className={`${styles.groupBtn} ${active ? styles.groupActive : ''}`}
                    onClick={() => toggle(key)}
                    aria-expanded={isExpanded}
                  >
                    <span className={styles.itemIcon}>{item.icon}</span>
                    <span className={styles.itemLabel}>{item.label}</span>
                    {renderBadge(item.badge)}
                    <ChevronDown
                      size={18}
                      className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  {isExpanded && (
                    <div className={styles.children}>
                      {item.children.map((child) =>
                        child.path ? (
                          <NavLink
                            key={child.label}
                            to={child.path}
                            className={({ isActive }) =>
                              `${styles.link} ${styles.childLink} ${isActive ? styles.active : ''}`
                            }
                            onClick={onClose}
                          >
                            <span className={styles.itemIcon}>{child.icon}</span>
                            <span className={styles.itemLabel}>{child.label}</span>
                            {renderBadge(child.badge)}
                          </NavLink>
                        ) : (
                          <span key={child.label} className={`${styles.link} ${styles.childLink} ${styles.disabled}`}>
                            <span className={styles.itemIcon}>{child.icon}</span>
                            <span className={styles.itemLabel}>{child.label}</span>
                          </span>
                        ),
                      )}
                    </div>
                  )}
                </div>
              );
            }

            if (!item.path) {
              return (
                <span key={key} className={`${styles.link} ${styles.disabled}`} title="Próximamente">
                  <span className={styles.itemIcon}>{item.icon}</span>
                  <span className={styles.itemLabel}>{item.label}</span>
                </span>
              );
            }

            return (
              <NavLink
                key={key}
                to={item.path}
                className={({ isActive }) =>
                  `${styles.link} ${isActive || location.pathname.startsWith(item.path as string) ? styles.active : ''}`
                }
                onClick={onClose}
              >
                <span className={styles.itemIcon}>{item.icon}</span>
                <span className={styles.itemLabel}>{item.label}</span>
                {renderBadge(item.badge)}
              </NavLink>
            );
          })}
        </nav>

        <div className={styles.widget}>
          <div className={styles.widgetTitle}>
            <span className={styles.widgetDot} aria-hidden="true" />
            Protocolo Vigente
          </div>
          <p className={styles.widgetText}>R.M. 123/2024 — SIPPCI v2.1</p>
          <span className={styles.widgetBadge}>Ley 449</span>
        </div>
      </aside>
    </>
  );
}
