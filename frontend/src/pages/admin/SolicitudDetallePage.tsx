import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Badge, Spinner, Button } from '@/components/ui';
import { adminService } from '@/services/admin.service';
import type { SolicitudWithRelations } from '@/types/solicitud.types';
import styles from './SolicitudDetallePage.module.scss';

export function AdminSolicitudDetallePage() {
  const { codigo } = useParams<{ codigo: string }>();
  const [sol, setSol] = useState<SolicitudWithRelations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!codigo) return;
    adminService
      .findOneSolicitud(codigo)
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
        <Card title="Solicitante">
          <p>
            {sol.usuario?.nombre} {sol.usuario?.email}
          </p>
        </Card>
        <Card title="Documentos">
          <p>{sol.documentos?.length ?? 0} docs</p>
        </Card>
        <Card title="Pagos">
          <p>{sol.pagos?.length ?? 0} pagos</p>
        </Card>
      </div>
      <div className={styles['actions']}>
        <Button variant="primary" size="sm">
          Revisar
        </Button>
        <Button variant="secondary" size="sm">
          Aprobar
        </Button>
        <Button variant="ghost" size="sm">
          Cambiar estado
        </Button>
      </div>
    </div>
  );
}
