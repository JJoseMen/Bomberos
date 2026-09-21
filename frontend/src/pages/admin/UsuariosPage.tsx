import { useEffect, useState } from 'react';
import { Table, Badge, Spinner } from '@/components/ui';
import { usuariosService } from '@/services/usuarios.service';
import type { Usuario } from '@/types/usuario.types';
import type { ColumnDef } from '@tanstack/react-table';
import styles from './UsuariosPage.module.scss';

export function UsuariosPage() {
  const [items, setItems] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usuariosService
      .findAll({ page: 1, limit: 20 })
      .then((r) => setItems(r.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const cols: ColumnDef<Usuario, unknown>[] = [
    {
      header: 'Nombre',
      cell: ({ row }) => (
        <span>
          {row.original.nombre} {row.original.apellido}
        </span>
      ),
    },
    { header: 'Email', accessorKey: 'email' },
    {
      header: 'Tipo',
      cell: ({ row }) => (
        <Badge variant="neutral" size="sm">
          {row.original.tipo}
        </Badge>
      ),
    },
    { header: 'Estado', accessorKey: 'estado' },
  ];

  return (
    <div className={styles['page']}>
      <h1 className={styles['title']}>Usuarios</h1>
      {loading ? (
        <Spinner size="md" />
      ) : (
        <Table columns={cols} data={items} emptyMessage="Sin usuarios" />
      )}
    </div>
  );
}
