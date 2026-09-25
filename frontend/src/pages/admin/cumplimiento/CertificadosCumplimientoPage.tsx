import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import { SectionTitle } from '@/components/admin/SectionTitle';
import { Table, Badge, Button, Input, Select, Spinner } from '@/components/ui';
import { EmptyState } from '@/components/shared/EmptyState/EmptyState';
import { cumplimientoService, type CertificadoCumplimiento } from '@/services/cumplimiento.service';
import { formatDate } from '@/lib/format';
import { toast } from 'sonner';
import api from '@/lib/api';
import styles from './CertificadosCumplimientoPage.module.scss';

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
  { value: '', label: 'Todos vigencia' },
  { value: 'VIGENTE', label: 'Vigente' },
  { value: 'POR_VENCER', label: 'Por vencer' },
  { value: 'VENCIDO', label: 'Vencido' },
];

const tipoOptions = [
  { value: '', label: 'Todos tipos' },
  { value: 'NATURAL', label: 'Natural' },
  { value: 'JURIDICA', label: 'Jurídica' },
];

export function CertificadosCumplimientoPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CertificadoCumplimiento[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [vigencia, setVigencia] = useState('');
  const [tipo, setTipo] = useState('');

  const fetchData = async (p: number, searchVal: string) => {
    setLoading(true);
    try {
      const params = { page: p, limit, ...(searchVal ? { search: searchVal } : {}) };
      const res = await cumplimientoService.listarCertificados(params);
      let filtered = res.items;
      if (vigencia) filtered = filtered.filter((c) => c.estadoVigencia === vigencia);
      if (tipo) filtered = filtered.filter((c) => c.solicitud.subtipoTramite === tipo);
      setItems(filtered);
      setTotal(vigencia || tipo ? filtered.length : res.total);
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
  }, [search, vigencia, tipo]);

  const handleSearch = () => setSearch(searchInput.trim());
  const handleLimpiar = () => {
    setSearchInput('');
    setSearch('');
    setVigencia('');
    setTipo('');
    setPage(1);
  };

  const handleCopiar = async (codigo: string) => {
    const url = `${window.location.origin}/validar-certificado/${codigo}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Enlace copiado');
    } catch {
      toast.error('No se pudo copiar');
    }
  };

  const handleDescargar = async (codigo: string) => {
    try {
      const response = await api.get(`/admin/sippci/cumplimiento/certificados/${codigo}/descargar`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${codigo}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Certificado descargado');
    } catch {
      toast.error('Error al descargar el certificado');
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  const cols: ColumnDef<CertificadoCumplimiento, unknown>[] = useMemo(
    () => [
      { header: 'Código Certificado', accessorKey: 'codigoCertificado' },
      {
        header: 'Tipo',
        cell: ({ row }) => (
          <Badge variant="neutral" size="sm">
            {row.original.solicitud.subtipoTramite}
          </Badge>
        ),
      },
      {
        header: 'Titular',
        cell: ({ row }) => (
          <span>{row.original.solicitud.empresa?.razonSocial || row.original.solicitud.usuario?.nombre || '-'}</span>
        ),
      },
      {
        header: 'Establecimiento',
        cell: ({ row }) => (
          <span>
            {(row.original.solicitud.datosJson?.nombreEstablecimiento as string) || '-'}
          </span>
        ),
      },
      {
        header: 'Emisión',
        cell: ({ row }) => <span>{formatDate(row.original.fechaEmision)}</span>,
      },
      {
        header: 'Vigencia',
        cell: ({ row }) => <span>{formatDate(row.original.fechaVigencia)}</span>,
      },
      {
        header: 'Estado',
        cell: ({ row }) => (
          <Badge variant={variantVigencia(row.original.estadoVigencia)} size="sm">
            {row.original.estadoVigencia}
          </Badge>
        ),
      },
      {
        header: 'Acciones',
        cell: ({ row }) => (
          <div className={styles.actions}>
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                navigate(
                  `/admin/sippci/cumplimiento/solicitudes/${row.original.solicitud.subtipoTramite.toLowerCase()}/${row.original.solicitud.codigoFormulario}`,
                )
              }
            >
              Ver
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleDescargar(row.original.codigoCertificado)}>
              PDF
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleCopiar(row.original.codigoCertificado)}>
              Link
            </Button>
          </div>
        ),
      },
    ],
    [navigate],
  );

  return (
    <div className={styles.page}>
      <SectionTitle
        breadcrumb={['Admin', 'Cumplimiento SIPPCI', 'Certificados Emitidos']}
        titulo="Certificados Emitidos"
        subtitulo="Certificados de cumplimiento (PDF con QR)"
      />

      <div className={styles.filters}>
        <Input
          placeholder="Buscar por código o titular..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Select value={tipo} onChange={(e) => setTipo(e.target.value)} options={tipoOptions} />
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
        <EmptyState title="Aún no hay certificados emitidos" description="No se encontraron certificados" />
      ) : (
        <>
          <Table columns={cols} data={items} emptyMessage="Sin certificados" />
          <div className={styles.pagination}>
            <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => fetchData(page - 1, search)}>
              Anterior
            </Button>
            <span className={styles.pageInfo}>
              Página {page} de {totalPages} • {total} registros
            </span>
            <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => fetchData(page + 1, search)}>
              Siguiente
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
