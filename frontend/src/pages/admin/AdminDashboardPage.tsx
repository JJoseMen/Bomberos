import { useEffect, useState } from 'react';
import { Card, Spinner, Badge } from '@/components/ui';
import { adminService } from '@/services/admin.service';
import type { AdminStats, AdminAlertas } from '@/types/admin.types';
import styles from './AdminDashboardPage.module.scss';

export function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [alertas, setAlertas] = useState<AdminAlertas | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminService.getStats(), adminService.getAlertas()])
      .then(([s, a]) => {
        setStats(s);
        setAlertas(a);
      })
      .catch(() => {
        setStats(null);
        setAlertas(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner size="md" />;

  const kpis = [
    { l: 'Solicitudes', v: stats?.totalSolicitudes ?? 0 },
    { l: 'Usuarios', v: stats?.totalUsuarios ?? 0 },
    { l: 'Empresas', v: stats?.totalEmpresas ?? 0 },
    { l: 'Certificados', v: stats?.totalCertificados ?? 0 },
    { l: 'Pagos verif.', v: stats?.totalPagosVerificados ?? 0 },
  ];

  return (
    <div className={styles['page']}>
      <h1 className={styles['title']}>Dashboard Administrativo</h1>
      <div className={styles['kpis']}>
        {kpis.map((k) => (
          <div key={k.l} className={styles['kpi']}>
            <div className={styles['kpiNum']}>{k.v}</div>
            <div className={styles['kpiLbl']}>{k.l}</div>
          </div>
        ))}
      </div>
      <Card title="Por estado">
        <div className={styles['bars']}>
          {Object.entries(stats?.porEstado ?? {}).map(([e, n]) => (
            <div
              key={e}
              title={`${e}: ${n}`}
              className={styles['bar']}
              style={{ height: `${Math.min(100, Number(n) * 8 + 6)}px` }}
            />
          ))}
        </div>
      </Card>
      <Card title="Alertas">
        <p>Proximas a vencer: {alertas?.proximasAVencer?.length ?? 0}</p>
        <p>
          Pagos pendientes: {alertas?.pagosPendientes ?? 0}{' '}
          <Badge variant="warning" size="sm">
            revisar
          </Badge>
        </p>
        <p>Docs pendientes: {alertas?.documentosPendientes ?? 0}</p>
      </Card>
    </div>
  );
}
