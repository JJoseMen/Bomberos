import { Table, Badge } from '@/components/ui';
import { EmptyState } from '@/components/shared/EmptyState/EmptyState';
import type { ColumnDef } from '@tanstack/react-table';
import styles from './PagosPage.module.scss';

interface PagoRow {
  id: number;
  numeroOperacion: string;
  monto: number;
  banco: string;
  estado: string;
}

export function PagosPage() {
  const cols: ColumnDef<PagoRow, unknown>[] = [
    { header: 'Operacion', accessorKey: 'numeroOperacion' },
    { header: 'Monto', accessorKey: 'monto' },
    { header: 'Banco', accessorKey: 'banco' },
    {
      header: 'Estado',
      cell: ({ row }) => (
        <Badge variant="warning" size="sm">
          {row.original.estado}
        </Badge>
      ),
    },
  ];
  return (
    <div className={styles['page']}>
      <h1 className={styles['title']}>Pagos</h1>
      <EmptyState title="Sin pagos" description="No hay pagos pendientes de revision" />
      <Table columns={cols} data={[]} emptyMessage="Sin pagos" />
    </div>
  );
}
