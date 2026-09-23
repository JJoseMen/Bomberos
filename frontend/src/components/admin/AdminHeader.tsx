import { Search, Bell, Menu } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import styles from './AdminHeader.module.scss';

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { user } = useAuthStore();

  // TODO: Conectar notificaciones al backend
  const notificacionesCount = 5;

  const iniciales = (user?.nombre || 'Usuario')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button
          type="button"
          className={styles.menuBtn}
          onClick={onMenuClick}
          aria-label="Abrir menú de navegación"
        >
          <Menu size={24} />
        </button>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} aria-hidden="true" />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Buscar por trámite, cédula, razón social... (Ctrl + K)"
            aria-label="Búsqueda global"
          />
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.systemBadge} role="status">
          <span className={styles.systemDot} aria-hidden="true" />
          <span>SISTEMA OPERATIVO</span>
        </div>
        <button
          type="button"
          className={styles.notifBtn}
          aria-label={`Notificaciones (${notificacionesCount} sin leer)`}
        >
          <Bell size={20} />
          <span className={styles.notifBadge} aria-hidden="true">
            {notificacionesCount}
          </span>
        </button>
        <div className={styles.divider} aria-hidden="true" />
        <div className={styles.profile}>
          <div className={styles.avatar} aria-hidden="true">
            {iniciales}
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>{user?.nombre || 'Usuario'}</span>
            <span className={styles.profileRole}>{user?.tipo || 'Usuario'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
