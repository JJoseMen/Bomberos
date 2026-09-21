import { useEffect, useState } from 'react';
import { Table, Badge, Spinner } from '@/components/ui';
import { certificadosService } from '@/services/certificados.service';
import type { Certificado } from '@/types/certificado.types';
import type { ColumnDef } from '@tanstack/react-table';
import styles from './CertificadosPage.module.scss';

export function CertificadosPage() {
  const [items, setItems] = useState<Certificado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    certificadosService
      .listar({ page: 1, limit: 20 })
      .then((r) => setItems(r.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const cols: ColumnDef<Certificado, unknown>[] = [
    { header: 'Certificado', accessorKey: 'codigoCertificado' },
    { header: 'Solicitud', accessorKey: 'solicitudId' },
    {
      header: 'Estado',
      cell: () => (
        <Badge variant="success" size="sm">
          VIGENTE
        </Badge>
      ),
    },
  ];

  return (
    <div className={styles['page']}>
      <h1 className={styles['title']}>Certificados</h1>
      {loading ? (
        <Spinner size="md" />
      ) : (
        <Table columns={cols} data={items} emptyMessage="Sin certificados" />
      )}
    </div>
  );
}
