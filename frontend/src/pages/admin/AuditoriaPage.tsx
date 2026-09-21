import { Table } from '@/components/ui';
import type { ColumnDef } from '@tanstack/react-table';
import styles from './AuditoriaPage.module.scss';

interface Row {
  fecha: string;
  usuario: string;
  accion: string;
  detalle: string;
}

export function AuditoriaPage() {
  const cols: ColumnDef<Row, unknown>[] = [
    { header: 'Fecha', accessorKey: 'fecha' },
    { header: 'Usuario', accessorKey: 'usuario' },
    { header: 'Accion', accessorKey: 'accion' },
    { header: 'Detalle', accessorKey: 'detalle' },
  ];
  return (
    <div className={styles['page']}>
      <h1 className={styles['title']}>Auditoria</h1>
      <Table columns={cols} data={[]} emptyMessage="Sin registros" />
    </div>
  );
}
