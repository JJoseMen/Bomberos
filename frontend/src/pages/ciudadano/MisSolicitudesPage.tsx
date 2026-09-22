import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { Button, Badge, Select, Input, Spinner } from '@/components/ui';
import { solicitudesService } from '@/services/solicitudes.service';
import { documentosService } from '@/services/documentos.service';
import type { Solicitud } from '@/types/solicitud.types';
import { formatDate } from '@/lib/format';
import { descargarBlob } from '@/lib/download';
import styles from './MisSolicitudesPage.module.scss';

const ESTADOS = [
  { value: '', label: 'Todos los estados' },
  { value: 'BORRADOR', label: 'Borrador' },
  { value: 'ENVIADA', label: 'Enviada' },
  { value: 'EN_REVISION', label: 'En revision' },
  { value: 'REVISADO', label: 'Revisado' },
  { value: 'OBSERVADA', label: 'Observada' },
  { value: 'APROBADA', label: 'Aprobada' },
  { value: 'CERTIFICADO_EMITIDO', label: 'Certificado emitido' },
  { value: 'RECHAZADA', label: 'Rechazada' },
  { value: 'VENCIDO', label: 'Vencido' },
  { value: 'RENOVADO', label: 'Renovado' },
];

const TIPOS = [
  { value: '', label: 'Todos los tipos' },
  { value: 'CERTIFICACION_SIPPCI', label: 'SIPPCI' },
  { value: 'REGISTRO_PROFESIONAL', label: 'Profesional' },
  { value: 'CAPACITACION', label: 'Capacitacion' },
];

const PAGE_SIZE = 8;

function badgeVariant(estado: string): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
  if (['APROBADA', 'CERTIFICADO_EMITIDO', 'RENOVADO'].includes(estado)) return 'success';
  if (['RECHAZADA', 'ANULADA', 'VENCIDO'].includes(estado)) return 'danger';
  if (['BORRADOR', 'OBSERVADA'].includes(estado)) return 'warning';
  if (['EN_REVISION', 'REVISADO', 'ENVIADA'].includes(estado)) return 'info';
  return 'neutral';
}

export function MisSolicitudesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('');
  const [tipo, setTipo] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['solicitudes', 'mias'],
    queryFn: () => solicitudesService.findMias(),
  });

  const items: Solicitud[] = useMemo(() => {
    const raw = Array.isArray(data) ? data : (data?.items ?? []);
    return raw.filter((s) => {
      if (estado && s.estado !== estado) return false;
      if (tipo && s.tipoTramite !== tipo) return false;
      if (search && !s.codigoFormulario.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [data, search, estado, tipo]);

  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, page]);

  const descargarComprobante = async (sol: Solicitud) => {
    const doc = (sol.documentos ?? []).find(
      (d) => d.tipo === 'BOLETA_DEPOSITO' || d.tipo === 'COMPROBANTE_PAGO',
    );
    if (!doc) return;
    const blob = await documentosService.descargar(doc.id);
    descargarBlob(blob, doc.nombreOriginal);
  };

  const columns: ColumnDef<Solicitud, unknown>[] = [
    {
      header: 'Codigo',
      accessorKey: 'codigoFormulario',
      cell: ({ row, getValue }) => (
        <button
          type="button"
          className={styles['link']}
          onClick={() => navigate(`/solicitudes/${row.original.codigoFormulario}`)}
        >
          {getValue() as string}
        </button>
      ),
    },
    {
      header: 'Tipo',
      cell: ({ row }) => {
        const map: Record<string, string> = {
          CERTIFICACION_SIPPCI: 'SIPPCI',
          REGISTRO_PROFESIONAL: 'Profesional',
          CAPACITACION: 'Capacitacion',
        };
        return map[row.original.tipoTramite] ?? row.original.tipoTramite;
      },
    },
    {
      header: 'Subtipo',
      cell: ({ row }) => row.original.subtipoTramite ?? '-',
    },
    {
      header: 'Estado',
      cell: ({ row }) => (
        <Badge variant={badgeVariant(row.original.estado)} size="sm">
          {row.original.estado}
        </Badge>
      ),
    },
    {
      header: 'Creada',
      cell: ({ row }) => <span>{formatDate(row.original.createdAt)}</span>,
    },
    {
      header: 'Vencimiento',
      cell: ({ row }) =>
        row.original.fechaVigencia ? formatDate(row.original.fechaVigencia) : '-',
    },
    {
      header: 'Acciones',
      cell: ({ row }) => (
        <div className={styles['acciones']}>
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate(`/solicitudes/${row.original.codigoFormulario}`)}
          >
            Ver detalle
          </Button>
          <Button size="sm" variant="ghost" onClick={() => descargarComprobante(row.original)}>
            Descargar comprobante
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: pageItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={styles['page']}>
      <div className={styles['head']}>
        <div>
          <h1 className={styles['title']}>Mis Solicitudes</h1>
          <p className={styles['subtitle']}>Lista de tus tramites</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/solicitudes/nueva')}>
          Nueva Solicitud
        </Button>
      </div>
      <div className={styles['filters']}>
        <Input
          placeholder="Buscar por codigo"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <Select
          value={estado}
          onChange={(e) => {
            setEstado(e.target.value);
            setPage(1);
          }}
          options={ESTADOS}
        />
        <Select
          value={tipo}
          onChange={(e) => {
            setTipo(e.target.value);
            setPage(1);
          }}
          options={TIPOS}
        />
      </div>
      {isLoading ? (
        <Spinner size="md" />
      ) : isError ? (
        <p className={styles['empty']}>No se pudieron cargar las solicitudes.</p>
      ) : items.length === 0 ? (
        <p className={styles['empty']}>No tienes solicitudes registradas.</p>
      ) : (
        <>
          <table className={styles['table']}>
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles['paginacion']}>
            <span>
              Pagina {page} de {pageCount}
            </span>
            <div className={styles['acciones']}>
              <Button
                size="sm"
                variant="ghost"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={page >= pageCount}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
