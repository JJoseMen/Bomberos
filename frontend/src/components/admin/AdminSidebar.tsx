import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Flame,
  ChevronDown,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { MENU_POR_ROL, type RolInterno, type MenuItem } from '@/config/menu.config';
import styles from './AdminSidebar.module.scss';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const { user } = useAuthStore();
  const location = useLocation();
  const rol = (user?.rol || user?.tipo || 'ADMIN') as RolInterno;

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    SIPPCI: true,
    Profesionales: true,
    Capacitaciones: true,
    'Cumplimiento SIPPCI': true,
    Pagos: true,
    Administraci\u00f3n: true,
  });

  const toggle = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const menuItems = MENU_POR_ROL[rol] || MENU_POR_ROL.ADMIN;

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
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`} aria-label="Navegaci\u00f3n administrativa">
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Flame size={20} aria-hidden="true" />
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>SIPPCI Admin</span>
            <span className={styles.logoSubtitle}>DNB - Polic\u00eda Boliviana</span>
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
                              `${styles.link} ${styles.childLink} ${isActive ? styles.active : ''}`}
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
                <span key={key} className={`${styles.link} ${styles.disabled}`} title="Pr\u00f3ximamente">
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
                  `${styles.link} ${isActive || location.pathname.startsWith(item.path as string) ? styles.active : ''}`}
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
          <p className={styles.widgetText}>R.M. 123/2024 \u2014 SIPPCI v2.1</p>
          <span className={styles.widgetBadge}>Ley 449</span>
        </div>
      </aside>
    </>
  );
}