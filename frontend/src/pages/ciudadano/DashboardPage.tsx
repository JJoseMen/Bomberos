import { useAuthStore } from '@/stores/auth.store';
import { Button, Spinner, Badge } from '@/components/ui';
import styles from './DashboardPage.module.scss';

interface KPI {
  label: string;
  value: string;
  badge?: string;
  badgeColor?: 'success' | 'warning' | 'danger';
}

export function DashboardPage() {
  const { user } = useAuthStore();

  const kpis: KPI[] = [
    { label: 'Solicitudes totales', value: '0' },
    { label: 'En proceso', value: '0', badge: 'proceso' },
    { label: 'Certificados vigentes', value: '0', badgeColor: 'success' },
    { label: 'Notificaciones no leidas', value: '0', badgeColor: 'warning' },
  ];

  return (
    <div className={styles['dashboard']}>
      <div className={styles['header']}>
        <div className={styles['welcome']}>Bienvenido, {user?.nombre || 'Ciudadano'}</div>
      </div>

      <div className={styles['kpis']}>
        {kpis.map((kpi) => (
          <div key={kpi.label} className={styles['kpi-card']}>
            <div className={styles['kpi-number']}>{kpi.value}</div>
            <div className={styles['kpi-label']}>{kpi.label}</div>
            {kpi.badge && (
              <Badge variant="warning" size="sm">
                {kpi.badge}
              </Badge>
            )}
            {kpi.badgeColor && (
              <Badge variant={kpi.badgeColor} size="sm">
                {kpi.label}
              </Badge>
            )}
          </div>
        ))}
      </div>

      <div className={styles['grid-2']}>
        <div>
          <h3 className={styles['section-title']}>Acceso Rapido</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <Button variant="primary" style={{ width: '100%' }}>
              Nueva Solicitud
            </Button>
            <Button variant="ghost" style={{ width: '100%' }}>
              Mis Solicitudes
            </Button>
            <Button variant="ghost" style={{ width: '100%' }}>
              Notificaciones
            </Button>
          </div>
        </div>

        <div>
          <h3 className={styles['section-title']}>Ultimas Solicitudes</h3>
          <div style={{ maxHeight: '300px', overflow: 'auto' }}>
            <Spinner size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
