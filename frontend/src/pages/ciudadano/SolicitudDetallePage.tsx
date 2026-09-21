import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Badge, Spinner, Button } from '@/components/ui';
import { solicitudesService } from '@/services/solicitudes.service';
import type { SolicitudWithRelations } from '@/types/solicitud.types';
import { formatDate } from '@/lib/format';
import styles from './SolicitudDetallePage.module.scss';

export function SolicitudDetallePage() {
  const { codigo } = useParams<{ codigo: string }>();
  const [sol, setSol] = useState<SolicitudWithRelations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!codigo) return;
    solicitudesService
      .findOne(codigo)
      .then((d) => setSol(d))
      .catch(() => setSol(null))
      .finally(() => setLoading(false));
  }, [codigo]);

  if (loading) return <Spinner size="md" />;
  if (!sol) return <p>No encontrada: {codigo}</p>;

  return (
    <div className={styles['page']}>
      <div className={styles['head']}>
        <span className={styles['code']}>{sol.codigoFormulario}</span>
        <Badge variant="info" size="md">
          {sol.estado}
        </Badge>
      </div>
      <div className={styles['grid']}>
        <Card title="Datos">
          <p>Tipo: {sol.tipoTramite}</p>
          <p>Creada: {formatDate(sol.createdAt)}</p>
        </Card>
        <Card title="Documentos">
          <p>Total: {sol.documentos?.length ?? 0}</p>
        </Card>
        <Card title="Pagos">
          <p>Total: {sol.pagos?.length ?? 0}</p>
        </Card>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="primary">Enviar</Button>
        <Button variant="ghost">Renovar</Button>
      </div>
    </div>
  );
}
