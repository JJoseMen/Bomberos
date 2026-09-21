import { Card, Button } from '@/components/ui';
import styles from './ReportesPage.module.scss';

export function ReportesPage() {
  return (
    <div className={styles['page']}>
      <h1 className={styles['title']}>Reportes</h1>
      <div className={styles['row']}>
        <Button variant="primary" size="sm">
          Exportar PDF
        </Button>
        <Button variant="ghost" size="sm">
          Exportar Excel
        </Button>
      </div>
      <Card title="Solicitudes por estado">
        <p>Pendiente de datos</p>
      </Card>
      <Card title="Pagos por mes">
        <p>Pendiente de datos</p>
      </Card>
    </div>
  );
}
