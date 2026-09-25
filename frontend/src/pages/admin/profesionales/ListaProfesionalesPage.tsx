import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import { SectionTitle } from '@/components/admin/SectionTitle';
import { Table, Badge, Button, Input, Select, Spinner } from '@/components/ui';
import { EmptyState } from '@/components/shared/EmptyState/EmptyState';
import { profesionalesService, type CertificadoProfesional } from '@/services/profesionales.service';
import { formatDate } from '@/lib/format';
import styles from './ListaProfesionalesPage.module.scss';

interface Props {
  tipo: 'NATURAL' | 'JURIDICA';
}

function variantVigencia(v: string): 'success' | 'warning' | 'danger' | 'neutral' {
  switch (v) {
    case 'VIGENTE':
      return 'success';
    case 'POR_VENCER':
      return 'warning';
    case 'VENCIDO':
      return 'danger';
    default:
      return 'neutral';
  }
}

const vigenciaOptions = [
  { value: '', label: 'Todos' },
  { value: 'VIGENTE', label: 'Vigente' },
  { value: 'POR_VENCER', label: 'Por vencer' },
  { value: 'VENCIDO', label: 'Vencido' },
];

export function ListaProfesionalesPage({ tipo }: Props) {
  const navigate = useNavigate();
  const [items, setItems] = useState<CertificadoProfesional[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [vigencia, setVigencia] = useState('');

  const tipoLabel = tipo === 'NATURAL' ? 'Naturales' : 'Jurídicas';
  const basePath = `/admin/profesionales/solicitudes/${tipo.toLowerCase()}`;

  const fetchData = async (p: number, searchVal: string) => {
    setLoading(true);
    try {
      const params = {
        page: p,
        limit,
        ...(searchVal ? { search: searchVal } : {}),
      };
      const res =
        tipo === 'NATURAL'
          ? await profesionalesService.listarCertificadosNaturales(params)
          : await profesionalesService.listarCertificadosJuridicas(params);
      // Filtro client-side por vigencia (backend no filtra por vigencia aún)
      let filtered = res.items;
      if (vigencia) {
        filtered = filtered.filter((c) => c.estadoVigencia === vigencia);
      }
      setItems(filtered);
      setTotal(vigencia ? filtered.length : res.total);
      setPage(res.page);
    } catch {
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo, search, vigencia]);

  const handleSearch = () => setSearch(searchInput.trim());
  const handleLimpiar = () => {
    setSearchInput('');
    setSearch('');
    setVigencia('');
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit) || 1;

  const cols: ColumnDef<CertificadoProfesional, unknown>[] = useMemo(
    () => [
      {
        header: tipo === 'JURIDICA' ? 'Razón Social' : 'Nombre',
        cell: ({ row }) => (
          <span>{row.original.solicitud.empresa?.razonSocial || row.original.solicitud.usuario?.nombre || '-'}</span>
        ),
      },
      {
        header: tipo === 'JURIDICA' ? 'NIT' : 'CI',
        cell: ({ row }) => (
          <span>{row.original.solicitud.empresa?.nit || '-'}</span>
        ),
      },
      { header: 'Código Certificado', accessorKey: 'codigoCertificado' },
      {
        header: 'Fecha Emisión',
        cell: ({ row }) => <span>{formatDate(row.original.fechaEmision)}</span>,
      },
      {
        header: 'Estado Vigencia',
        cell: ({ row }) => (
          <Badge variant={variantVigencia(row.original.estadoVigencia)} size="sm">
            {row.original.estadoVigencia}
          </Badge>
        ),
      },
      {
        header: 'Acciones',
        cell: ({ row }) => (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(`${basePath}/${row.original.solicitud.codigoFormulario}`)}
          >
            Ver
          </Button>
        ),
      },
    ],
    [navigate, basePath, tipo],
  );

  return (
    <div className={styles.page}>
      <SectionTitle
        breadcrumb={['Admin', 'Profesionales', 'Lista de Profesionales', tipoLabel]}
        titulo={`Lista de Profesionales — ${tipoLabel}`}
        subtitulo="Profesionales certificados con vigencia de 2 años"
      />

      <div className={styles.filters}>
        <Input
          placeholder="Buscar por nombre, CI/NIT o código..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Select value={vigencia} onChange={(e) => setVigencia(e.target.value)} options={vigenciaOptions} />
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
        <EmptyState title="Aún no hay profesionales certificados" description={`No hay ${tipoLabel.toLowerCase()} certificados`} />
      ) : (
        <>
          <Table columns={cols} data={items} emptyMessage="Sin profesionales" />
          <div className={styles.pagination}>
            <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => fetchData(page - 1, search)}>
              Anterior
            </Button>
            <span className={styles.pageInfo}>
              Página {page} de {totalPages} • {total} registros
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => fetchData(page + 1, search)}
            >
              Siguiente
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
