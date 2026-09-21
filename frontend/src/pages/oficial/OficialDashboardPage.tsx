import { Card } from '@/components/ui';
import styles from './OficialDashboardPage.module.scss';

export function OficialDashboardPage() {
  const kpis = [
    { l: 'Asignadas', v: '0' },
    { l: 'En revision', v: '0' },
    { l: 'Inspecciones', v: '0' },
    { l: 'Por emitir', v: '0' },
  ];
  return (
    <div className={styles['page']}>
      <h1 className={styles['title']}>Dashboard Oficial</h1>
      <div className={styles['kpis']}>
        {kpis.map((k) => (
          <div key={k.l} className={styles['kpi']}>
            <div className={styles['num']}>{k.v}</div>
            <div className={styles['lbl']}>{k.l}</div>
          </div>
        ))}
      </div>
      <Card title="Ultimas asignadas">
        <p>Sin datos</p>
      </Card>
    </div>
  );
}
