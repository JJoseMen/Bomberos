import { useState } from 'react';
import { Input, Button } from '@/components/ui';
import { Search } from 'lucide-react';
import { publicService } from '@/services/public.service';
import { formatDate } from '@/lib/format';
import type { ConsultaSolicitudPublica } from '@/types/public.types';
import styles from './ConsultaPublicaPage.module.scss';

export function ConsultaPublicaPage() {
  const [codigo, setCodigo] = useState('');
  const [result, setResult] = useState<ConsultaSolicitudPublica | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!codigo.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await publicService.consultarEstado(codigo);
      setResult(data);
    } catch {
      setError('No se encontro ninguna solicitud con ese codigo');
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const map: Record<string, string> = {
      APROBADA: styles.badgeSuccess,
      CERTIFICADO_EMITIDO: styles.badgeSuccess,
      VENCIDO: styles.badgeDanger,
      ENVIADA: styles.badgeWarning,
      EN_REVISION: styles.badgeWarning,
      RECHAZADA: styles.badgeDanger,
    };
    return map[estado] || '';
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Consultar mi tramite</h1>
      <p className={styles.subtitle}>Ingresa el codigo de tu solicitud para consultar su estado</p>

      <div className={styles.form}>
        <Input
          placeholder="Codigo de solicitud (ej: SIPPCI-NAT-2026-00001)"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button
          variant="primary"
          onClick={handleSearch}
          loading={loading}
          leftIcon={<Search size={16} />}
        >
          Consultar
        </Button>
      </div>

      {error && (
        <div
          style={{
            padding: '1rem',
            background: '#ffebee',
            borderRadius: 8,
            color: '#c62828',
            textAlign: 'center',
          }}
        >
          {error}
        </div>
      )}

      {result && (
        <div className={styles.result}>
          <div className={styles.resultRow}>
            <span className={styles.resultLabel}>Codigo</span>
            <span className={styles.resultValue}>{result.codigoFormulario}</span>
          </div>
          <div className={styles.resultRow}>
            <span className={styles.resultLabel}>Tipo</span>
            <span className={styles.resultValue}>{result.tipoTramite}</span>
          </div>
          <div className={styles.resultRow}>
            <span className={styles.resultLabel}>Estado</span>
            <span className={`${styles.badge} ${getEstadoBadge(result.estado)}`}>
              {result.estado}
            </span>
          </div>
          <div className={styles.resultRow}>
            <span className={styles.resultLabel}>Titular</span>
            <span className={styles.resultValue}>{result.titular}</span>
          </div>
          <div className={styles.resultRow}>
            <span className={styles.resultLabel}>Fecha creacion</span>
            <span className={styles.resultValue}>{formatDate(result.fechaCreacion)}</span>
          </div>
          {result.fechaAprobacion && (
            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>Fecha aprobacion</span>
              <span className={styles.resultValue}>{formatDate(result.fechaAprobacion)}</span>
            </div>
          )}
          {result.fechaVencimiento && (
            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>Vencimiento</span>
              <span className={styles.resultValue}>{formatDate(result.fechaVencimiento)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
