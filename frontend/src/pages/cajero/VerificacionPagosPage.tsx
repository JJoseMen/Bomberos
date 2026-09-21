import { Table, Badge, Button } from '@/components/ui';
import type { ColumnDef } from '@tanstack/react-table';
import styles from './VerificacionPagosPage.module.scss';

interface Row {
  id: number;
  numeroOperacion: string;
  monto: number;
  banco: string;
  estado: string;
}

export function VerificacionPagosPage() {
  const cols: ColumnDef<Row, unknown>[] = [
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
    {
      header: 'Accion',
      cell: () => (
        <div style={{ display: 'flex', gap: 6 }}>
          <Button size="sm" variant="primary">
            Verificar
          </Button>
          <Button size="sm" variant="ghost">
            Rechazar
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div className={styles['page']}>
      <h1 className={styles['title']}>Verificacion de Pagos</h1>
      <Table columns={cols} data={[]} emptyMessage="Sin pagos pendientes" />
    </div>
  );
}
