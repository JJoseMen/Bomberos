import { Card } from '@/components/ui';
import styles from './ReportesCajaPage.module.scss';

export function ReportesCajaPage() {
  return (
    <div className={styles['page']}>
      <h1 className={styles['title']}>Reportes de Caja</h1>
      <Card title="Pagos por dia">
        <p>Total recaudado: Bs 0</p>
      </Card>
    </div>
  );
}
