import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Badge, Spinner, Button, Input, Select } from '@/components/ui';
import { adminService } from '@/services/admin.service';
import type { SolicitudWithRelations } from '@/types/solicitud.types';
import type { ColumnDef } from '@tanstack/react-table';
import { formatDate } from '@/lib/format';
import styles from './SolicitudesListPage.module.scss';

export function SolicitudesListPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<SolicitudWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('');

  useEffect(() => {
    adminService
      .findAllSolicitudes({ page: 1, limit: 20 })
      .then((r) => setItems(r.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const cols: ColumnDef<SolicitudWithRelations, unknown>[] = [
    { header: 'Codigo', accessorKey: 'codigoFormulario' },
    { header: 'Tipo', accessorKey: 'tipoTramite' },
    {
      header: 'Estado',
      cell: ({ row }) => (
        <Badge variant="info" size="sm">
          {row.original.estado}
        </Badge>
      ),
    },
    { header: 'Creada', cell: ({ row }) => <span>{formatDate(row.original.createdAt)}</span> },
    {
      header: 'Accion',
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => navigate(`/admin/solicitudes/${row.original.codigoFormulario}`)}
        >
          Ver
        </Button>
      ),
    },
  ];

  const data = items.filter((s) => {
    if (estado && s.estado !== estado) return false;
    if (search && !s.codigoFormulario.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className={styles['page']}>
      <h1 className={styles['title']}>Solicitudes</h1>
      <div className={styles['filters']}>
        <Input
          placeholder="Buscar codigo"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          options={[
            { value: '', label: 'Todos' },
            { value: 'ENVIADA', label: 'Enviada' },
            { value: 'APROBADA', label: 'Aprobada' },
          ]}
        />
      </div>
      {loading ? (
        <Spinner size="md" />
      ) : (
        <Table columns={cols} data={data} emptyMessage="Sin solicitudes" />
      )}
    </div>
  );
}
