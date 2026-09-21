import { Card } from '@/components/ui';
import styles from './CajeroDashboardPage.module.scss';

export function CajeroDashboardPage() {
  const kpis = [
    { l: 'Pendientes', v: '0' },
    { l: 'Verificados hoy', v: '0' },
    { l: 'Por entregar', v: '0' },
    { l: 'Recaudado', v: 'Bs 0' },
  ];
  return (
    <div className={styles['page']}>
      <h1 className={styles['title']}>Dashboard Cajero</h1>
      <div className={styles['kpis']}>
        {kpis.map((k) => (
          <div key={k.l} className={styles['kpi']}>
            <div className={styles['num']}>{k.v}</div>
            <div className={styles['lbl']}>{k.l}</div>
          </div>
        ))}
      </div>
      <Card title="Ultimos pagos">
        <p>Sin datos</p>
      </Card>
    </div>
  );
}
