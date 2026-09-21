import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Badge, Spinner, Button } from '@/components/ui';
import { adminService } from '@/services/admin.service';
import type { SolicitudWithRelations } from '@/types/solicitud.types';
import type { ColumnDef } from '@tanstack/react-table';
import styles from './SolicitudesAsignadasPage.module.scss';

export function SolicitudesAsignadasPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<SolicitudWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .findAllSolicitudes({ page: 1, limit: 20 })
      .then((r) => setItems(r.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const cols: ColumnDef<SolicitudWithRelations, unknown>[] = [
    { header: 'Codigo', accessorKey: 'codigoFormulario' },
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
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="primary"
          onClick={() => navigate(`/oficial/solicitudes/${row.original.codigoFormulario}`)}
        >
          Revisar
        </Button>
      ),
    },
  ];

  return (
    <div className={styles['page']}>
      <h1 className={styles['title']}>Solicitudes Asignadas</h1>
      {loading ? (
        <Spinner size="md" />
      ) : (
        <Table columns={cols} data={items} emptyMessage="Sin asignadas" />
      )}
    </div>
  );
}
