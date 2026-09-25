import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SectionTitle } from '@/components/admin/SectionTitle';
import { Badge, Button, Spinner } from '@/components/ui';
import { EmptyState } from '@/components/shared/EmptyState/EmptyState';
import { cumplimientoService, type InspeccionCumplimiento } from '@/services/cumplimiento.service';
import { formatDateTime } from '@/lib/format';
import { toast } from 'sonner';
import styles from './InspeccionDetallePage.module.scss';

const RESULTADOS = ['APTO', 'OBSERVADO', 'NO_APTO'] as const;

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

export function InspeccionDetallePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inspeccion, setInspeccion] = useState<InspeccionCumplimiento | null>(null);
  const [loading, setLoading] = useState(true);
  const [resultado, setResultado] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [guardando, setGuardando] = useState(false);

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await cumplimientoService.obtenerInspeccion(parseInt(id, 10));
      setInspeccion(data);
    } catch {
      setInspeccion(null);
      toast.error('No se pudo cargar la inspección');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const esValido = resultado !== '' && observaciones.trim().length >= 10;

  const handleRegistrar = async () => {
    if (!id || !esValido) return;
    setGuardando(true);
    try {
      await cumplimientoService.registrarInforme(parseInt(id, 10), {
        resultado,
        observaciones: observaciones.trim(),
      });
      toast.success('Informe registrado');
      setResultado('');
      setObservaciones('');
      await fetchData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrar el informe';
      toast.error(msg);
    } finally {
      setGuardando(false);
    }
  };

  if (loading) return <Spinner size="md" />;
  if (!inspeccion) {
    return <EmptyState title="No encontrada" description={`Inspección ${id} no existe`} />;
  }

  const solicitud = inspeccion.solicitud;
  const datos = (solicitud as unknown as Record<string, unknown> | undefined)?.datosJson as
    | Record<string, unknown>
    | undefined;
  const estaProgramada = inspeccion.estado === 'PROGRAMADA';
  const informeRegistrado = inspeccion.estado === 'CONFORME' || inspeccion.estado === 'NO_CONFORME';

  return (
    <div className={styles.page}>
      <SectionTitle
        breadcrumb={['Admin', 'Cumplimiento SIPPCI', 'Inspecciones', `#${inspeccion.id}`]}
        titulo={`Inspección Técnica — #${inspeccion.id}`}
        subtitulo={`Estado: ${inspeccion.estado}`}
      />

      <div className={styles.headerBadge}>
        <Badge variant={variantPorEstado(inspeccion.estado)} size="md">
          {inspeccion.estado}
        </Badge>
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          Volver
        </Button>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Datos de la Inspección</h3>
          <div className={styles.fieldList}>
            <div><strong>Nro.:</strong> #{inspeccion.id}</div>
            <div>
              <strong>Fecha programada:</strong>{' '}
              {inspeccion.fechaProgramada ? formatDateTime(inspeccion.fechaProgramada) : '-'}
            </div>
            <div>
              <strong>Fecha realizada:</strong>{' '}
              {inspeccion.fechaRealizada ? formatDateTime(inspeccion.fechaRealizada) : '-'}
            </div>
            <div><strong>Estado:</strong> {inspeccion.estado}</div>
            <div><strong>Resultado:</strong> {inspeccion.resultado || '-'}</div>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Solicitud</h3>
          <div className={styles.fieldList}>
            <div><strong>Código:</strong> {solicitud?.codigoFormulario || '-'}</div>
            <div>
              <strong>Solicitante:</strong>{' '}
              {solicitud?.empresa?.razonSocial ||
                `${solicitud?.usuario?.nombre ?? ''} ${solicitud?.usuario?.apellido ?? ''}`.trim() ||
                '-'}
            </div>
            <div><strong>Establecimiento:</strong> {(datos?.nombreEstablecimiento as string) || '-'}</div>
            <div>
              <strong>Nivel riesgo:</strong>{' '}
              {datos?.nivelRiesgo ? (
                <Badge
                  variant={
                    datos.nivelRiesgo === 'ALTO' ? 'danger' : datos.nivelRiesgo === 'MEDIO' ? 'warning' : 'success'
                  }
                  size="sm"
                >
                  {String(datos.nivelRiesgo)}
                </Badge>
              ) : (
                '-'
              )}
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Inspector Asignado</h3>
          <div className={styles.fieldList}>
            <div>
              <strong>Nombre:</strong>{' '}
              {inspeccion.inspector
                ? `${inspeccion.inspector.nombre} ${inspeccion.inspector.apellido ?? ''}`.trim()
                : '-'}
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Informe Técnico</h3>

          {estaProgramada && (
            <div className={styles.form}>
              <label className={styles.label} htmlFor="resultado-inspeccion">
                Resultado *
              </label>
              <div className={styles.radioGroup} role="radiogroup" aria-label="Resultado de la inspección">
                {RESULTADOS.map((r) => (
                  <label key={r} className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="resultado"
                      value={r}
                      checked={resultado === r}
                      onChange={() => setResultado(r)}
                    />
                    {r}
                  </label>
                ))}
              </div>

              <label className={styles.label} htmlFor="observaciones-inspeccion">
                Observaciones * (mínimo 10 caracteres)
              </label>
              <textarea
                id="observaciones-inspeccion"
                className={styles.textarea}
                rows={4}
                placeholder="Describa hallazgos, condiciones del establecimiento, observaciones..."
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
              />
              <span className={styles.contador}>{observaciones.trim().length}/10 mínimo</span>

              <div className={styles.formActions}>
                <Button variant="primary" size="sm" onClick={handleRegistrar} disabled={!esValido || guardando}>
                  {guardando ? 'Registrando...' : 'Registrar Informe'}
                </Button>
              </div>
            </div>
          )}

          {informeRegistrado && (
            <div className={styles.fieldList}>
              <div><strong>Resultado:</strong> {inspeccion.resultado || '-'}</div>
              <div>
                <strong>Observaciones:</strong>{' '}
                {inspeccion.observaciones || '-'}
              </div>
              <div>
                <strong>Fecha realizada:</strong>{' '}
                {inspeccion.fechaRealizada ? formatDateTime(inspeccion.fechaRealizada) : '-'}
              </div>
            </div>
          )}

          {!estaProgramada && !informeRegistrado && (
            <p className={styles.empty}>
              Estado {inspeccion.estado}: el informe aún no puede registrarse.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
