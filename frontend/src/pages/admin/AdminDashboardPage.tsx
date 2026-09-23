import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { SectionTitle } from '@/components/admin/SectionTitle';
import { StatCard } from '@/components/admin/StatCard';
import { ModuleProgressBar } from '@/components/admin/ModuleProgressBar';
import { Table, Spinner, Badge, Button } from '@/components/ui';
import { EmptyState } from '@/components/shared/EmptyState/EmptyState';
import { adminService } from '@/services/admin.service';
import type { AdminStats } from '@/types/admin.types';
import type { SolicitudWithRelations } from '@/types/solicitud.types';
import styles from './AdminDashboardPage.module.scss';

function mapearModulo(tipoTramite: string, subtipoTramite?: string): string {
  switch (subtipoTramite) {
    case 'POLIGONO_TIRO':
    case 'HIDROCARBUROS':
      return 'Reglamentación';
    case 'TURISMO':
      return 'Turismo';
    default:
      break;
  }
  switch (tipoTramite) {
    case 'CERTIFICACION_SIPPCI':
    case 'REGISTRO_PROFESIONAL':
    case 'CAPACITACION':
      return 'SIPPCI';
    case 'POLIGONO_TIRO':
    case 'HIDROCARBUROS':
      return 'Reglamentación';
    case 'TURISMO':
      return 'Turismo';
    default:
      return 'Otro';
  }
}

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [solicitudes, setSolicitudes] = useState<SolicitudWithRelations[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    Promise.all([
      adminService.getStats(),
      adminService.findAllSolicitudes({ page: 1, limit: 8 }),
    ])
      .then(([statsData, solicitudesData]) => {
        setStats(statsData);
        setSolicitudes(solicitudesData.items);
      })
      .catch(() => {
        setStats(null);
        setSolicitudes([]);
      })
      .finally(() => setCargando(false));
  }, []);

  const solicitudesFiltradas = useMemo(() => {
    const q = filtro.trim().toLowerCase();
    if (!q) return solicitudes;
    return solicitudes.filter((sol) => {
      const contribuyente = (sol.empresa?.razonSocial || sol.usuario?.nombre || '').toLowerCase();
      return sol.codigoFormulario.toLowerCase().includes(q) || contribuyente.includes(q);
    });
  }, [solicitudes, filtro]);

  const columnas: ColumnDef<SolicitudWithRelations, unknown>[] = useMemo(
    () => [
      { header: 'Nro. Trámite', accessorKey: 'codigoFormulario' },
      {
        header: 'Contribuyente',
        cell: ({ row }) => (
          <span>{row.original.empresa?.razonSocial || row.original.usuario?.nombre || '-'}</span>
        ),
      },
      {
        header: 'Módulo',
        cell: ({ row }) => (
          <span>{mapearModulo(row.original.tipoTramite, row.original.subtipoTramite)}</span>
        ),
      },
      {
        header: 'Estado',
        cell: ({ row }) => (
          <Badge variant="info" size="sm">
            {row.original.estado}
          </Badge>
        ),
      },
      {
        header: 'Acción',
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
    ],
    [navigate],
  );

  if (cargando) return <Spinner size="md" />;
  if (!stats)
    return <EmptyState title="Sin datos" description="No se pudieron cargar las estadísticas" />;

  const kpis = [
    {
      titulo: 'Trámites Totales',
      valor: stats.totalSolicitudes,
      subtitulo: '+12% este mes',
      icono: <FolderOpen size={20} />,
      colorIcono: styles.iconBlue,
    },
    {
      titulo: 'En Revisión',
      valor: stats.porEstado.EN_REVISION || 0,
      subtitulo: 'En turno hoy',
      icono: <Clock size={20} />,
      colorIcono: styles.iconAmber,
    },
    {
      titulo: 'Aprobados',
      valor: stats.porEstado.APROBADA || 0,
      subtitulo: 'Certificados emitidos',
      icono: <CheckCircle size={20} />,
      colorIcono: styles.iconEmerald,
    },
    {
      titulo: 'Observados',
      valor: stats.porEstado.OBSERVADA || 0,
      subtitulo: 'Requieren subsanación',
      icono: <AlertTriangle size={20} />,
      colorIcono: styles.iconRed,
      colorValor: styles.valorRed,
    },
  ];

  const distribucion = [
    {
      nombre: 'Módulo SIPPCI (Infraestructura)',
      tramites: stats.porTipoTramite.CERTIFICACION_SIPPCI || 0,
      color: '#0f1f3c',
    },
    {
      nombre: 'Módulo Reglamentación (Armería y Polígonos)',
      tramites:
        (stats.porTipoTramite.POLIGONO_TIRO || 0) + (stats.porTipoTramite.HIDROCARBUROS || 0),
      color: '#c8102e',
    },
    {
      nombre: 'Módulo Turismo (Hotelería y Aventura)',
      tramites: stats.porTipoTramite.TURISMO || 0,
      color: '#f2a900',
    },
  ];

  const totalDistribucion = distribucion.reduce((sum, d) => sum + d.tramites, 0);
  const distribucionConPorcentaje = distribucion.map((d) => ({
    ...d,
    porcentaje: totalDistribucion > 0 ? Math.round((d.tramites / totalDistribucion) * 100) : 0,
  }));

  return (
    <div className={styles.page}>
      <SectionTitle
        breadcrumb={['Admin', 'Panel Principal']}
        titulo="Panel de Control — DNB"
        subtitulo="Visión global de los 3 módulos operativos"
      />

      <div className={styles.kpisGrid}>
        {kpis.map((kpi) => (
          <StatCard key={kpi.titulo} {...kpi} />
        ))}
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Distribución por Módulo</h2>
        <p className={styles.cardSubtitle}>Carga activa sobre el total de expedientes</p>
        <div className={styles.distribucionList}>
          {distribucionConPorcentaje.map((d) => (
            <ModuleProgressBar
              key={d.nombre}
              nombre={d.nombre}
              tramites={d.tramites}
              porcentaje={d.porcentaje}
              color={d.color}
            />
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Últimas Carpetas</h2>
          <input
            type="text"
            placeholder="Filtrar por contribuyente o N°..."
            className={styles.searchInput}
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            aria-label="Filtrar últimas carpetas"
          />
        </div>
        <Table
          columns={columnas}
          data={solicitudesFiltradas}
          emptyMessage="No hay solicitudes recientes"
        />
      </div>
    </div>
  );
}
