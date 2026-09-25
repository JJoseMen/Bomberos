import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import { SectionTitle } from '@/components/admin/SectionTitle';
import { Table, Badge, Button, Input, Select, Spinner } from '@/components/ui';
import { EmptyState } from '@/components/shared/EmptyState/EmptyState';
import { cumplimientoService, type InspeccionCumplimiento } from '@/services/cumplimiento.service';
import { formatDateTime } from '@/lib/format';
import styles from './SolicitudesListPage.module.scss';

const estadoOptions = [
  { value: '', label: 'Todos los estados' },
  { value: 'PROGRAMADA', label: 'Programada' },
  { value: 'EN_CURSO', label: 'En curso' },
  { value: 'CONFORME', label: 'Conforme' },
  { value: 'NO_CONFORME', label: 'No conforme' },
];

const resultadoOptions = [
  { value: '', label: 'Todos los resultados' },
  { value: 'APTO', label: 'Apto' },
  { value: 'OBSERVADO', label: 'Observado' },
  { value: 'NO_APTO', label: 'No apto' },
];

function variantPorEstado(estado: string): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
  switch (estado) {
    case 'CONFORME':
      return 'success';
    case 'EN_CURSO':
      return 'warning';
    case 'NO_CONFORME':
      return 'danger';
    case 'PROGRAMADA':
      return 'info';
    default:
      return 'neutral';
  }
}

function variantPorResultado(resultado: string): 'success' | 'warning' | 'danger' | 'neutral' {
  switch (resultado) {
    case 'APTO':
      return 'success';
    case 'OBSERVADO':
      return 'warning';
    case 'NO_APTO':
      return 'danger';
    default:
      return 'neutral';
  }
}

export function InspeccionesListPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<InspeccionCumplimiento[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [estado, setEstado] = useState('');
  const [resultado, setResultado] = useState('');

  const fetchData = async (p: number, searchVal: string, estadoVal: string) => {
    setLoading(true);
    try {
      const params = {
        page: p,
        limit,
        ...(searchVal ? { search: searchVal } : {}),
        ...(estadoVal ? { estado: estadoVal } : {}),
      };
      const res = await cumplimientoService.listarInspecciones(params);
      const filtered = resultado ? res.items.filter((i) => i.resultado === resultado) : res.items;
      setItems(filtered);
      setTotal(estadoVal || resultado ? filtered.length : res.total);
      setPage(res.page);
    } catch {
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, search, estado);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, estado, resultado]);

  const handleSearch = () => setSearch(searchInput.trim());
  const handleLimpiar = () => {
    setSearchInput('');
    setSearch('');
    setEstado('');
    setResultado('');
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit) || 1;

  const cols: ColumnDef<InspeccionCumplimiento, unknown>[] = useMemo(
    () => [
      { header: 'Nro. Inspección', accessorKey: 'id' },
      {
        header: 'Solicitud',
        cell: ({ row }) => <span>{row.original.solicitud?.codigoFormulario || '-'}</span>,
      },
      {
        header: 'Solicitante',
        cell: ({ row }) => (
          <span>
            {row.original.solicitud?.empresa?.razonSocial ||
              `${row.original.solicitud?.usuario?.nombre ?? ''} ${row.original.solicitud?.usuario?.apellido ?? ''}`.trim() ||
              '-'}
          </span>
        ),
      },
      {
        header: 'Inspector',
        cell: ({ row }) => (
          <span>
            {row.original.inspector
              ? `${row.original.inspector.nombre} ${row.original.inspector.apellido ?? ''}`.trim()
              : '-'}
          </span>
        ),
      },
      {
        header: 'Fecha Programada',
        cell: ({ row }) => (
          <span>{row.original.fechaProgramada ? formatDateTime(row.original.fechaProgramada) : '-'}</span>
        ),
      },
      {
        header: 'Estado',
        cell: ({ row }) => (
          <Badge variant={variantPorEstado(row.original.estado)} size="sm">
            {row.original.estado}
          </Badge>
        ),
      },
      {
        header: 'Resultado',
        cell: ({ row }) =>
          row.original.resultado ? (
            <Badge variant={variantPorResultado(row.original.resultado)} size="sm">
              {row.original.resultado}
            </Badge>
          ) : (
            <span>-</span>
          ),
      },
      {
        header: 'Acciones',
        cell: ({ row }) => (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(`/admin/sippci/cumplimiento/inspecciones/${row.original.id}`)}
          >
            Ver
          </Button>
        ),
      },
    ],
    [navigate],
  );

  return (
    <div className={styles.page}>
      <SectionTitle
        breadcrumb={['Admin', 'Cumplimiento SIPPCI', 'Inspecciones']}
        titulo="Inspecciones Técnicas"
        subtitulo="Gestión de inspecciones programadas y realizadas"
      />

      <div className={styles.filters}>
        <Input
          placeholder="Buscar por código de solicitud..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Select value={estado} onChange={(e) => setEstado(e.target.value)} options={estadoOptions} />
        <Select value={resultado} onChange={(e) => setResultado(e.target.value)} options={resultadoOptions} />
        <Button variant="secondary" size="sm" onClick={handleSearch}>
          Buscar
        </Button>
        <Button variant="ghost" size="sm" onClick={handleLimpiar}>
          Limpiar
        </Button>
      </div>

      {loading ? (
        <Spinner size="md" />
      ) : items.length === 0 ? (
        <EmptyState title="Aún no hay inspecciones programadas" description="No se encontraron inspecciones para este filtro" />
      ) : (
        <>
          <Table columns={cols} data={items} emptyMessage="Sin inspecciones" />
          <div className={styles.pagination}>
            <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => fetchData(page - 1, search, estado)}>
              Anterior
            </Button>
            <span className={styles.pageInfo}>
              Página {page} de {totalPages} • {total} registros
            </span>
            <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => fetchData(page + 1, search, estado)}>
              Siguiente
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
