import { Table, Button } from '@/components/ui';
import type { ColumnDef } from '@tanstack/react-table';
import styles from './InspeccionesPage.module.scss';

interface Row {
  id: number;
  codigo: string;
  fecha: string;
  estado: string;
}

export function InspeccionesPage() {
  const cols: ColumnDef<Row, unknown>[] = [
    { header: 'Solicitud', accessorKey: 'codigo' },
    { header: 'Fecha', accessorKey: 'fecha' },
    { header: 'Estado', accessorKey: 'estado' },
  ];
  return (
    <div className={styles['page']}>
      <h1 className={styles['title']}>Inspecciones</h1>
      <div style={{ marginBottom: 12 }}>
        <Button variant="primary" size="sm">
          Registrar inspeccion
        </Button>
      </div>
      <Table columns={cols} data={[]} emptyMessage="Sin inspecciones" />
    </div>
  );
}
