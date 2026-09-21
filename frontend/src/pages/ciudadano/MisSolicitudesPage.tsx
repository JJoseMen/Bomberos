import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Badge, Spinner, Button, Select } from '@/components/ui';
import { solicitudesService } from '@/services/solicitudes.service';
import type { Solicitud } from '@/types/solicitud.types';
import type { ColumnDef } from '@tanstack/react-table';
import { formatDate } from '@/lib/format';
import styles from './MisSolicitudesPage.module.scss';

export function MisSolicitudesPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [estado, setEstado] = useState('');

  useEffect(() => {
    solicitudesService
      .findMias({ page: 1, limit: 20 })
      .then((r) => setItems(Array.isArray(r) ? r : (r.items ?? [])))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const cols: ColumnDef<Solicitud, unknown>[] = [
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
    {
      header: 'Creada',
      cell: ({ row }) => <span>{formatDate(row.original.createdAt)}</span>,
    },
    {
      header: 'Accion',
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => navigate(`/solicitudes/${row.original.codigoFormulario}`)}
        >
          Ver
        </Button>
      ),
    },
  ];

  const filtradas = estado ? items.filter((s) => s.estado === estado) : items;

  return (
    <div className={styles['page']}>
      <h1 className={styles['title']}>Mis Solicitudes</h1>
      <p className={styles['subtitle']}>Listado de tus tramites enviados y borradores</p>
      <div className={styles['filters']}>
        <Select
          placeholder="Todos los estados"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          options={[
            { value: '', label: 'Todos' },
            { value: 'BORRADOR', label: 'Borrador' },
            { value: 'ENVIADA', label: 'Enviada' },
            { value: 'APROBADA', label: 'Aprobada' },
            { value: 'CERTIFICADO_EMITIDO', label: 'Certificado' },
          ]}
        />
      </div>
      {loading ? (
        <Spinner size="md" />
      ) : (
        <Table columns={cols} data={filtradas} emptyMessage="Sin solicitudes" />
      )}
    </div>
  );
}
