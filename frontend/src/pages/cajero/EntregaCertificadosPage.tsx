import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, Button, Spinner, Badge } from '@/components/ui';
import { certificadosService } from '@/services/certificados.service';
import type { Certificado } from '@/types/certificado.types';
import { formatDate } from '@/lib/format';
import styles from './EntregaCertificadosPage.module.scss';

export function EntregaCertificadosPage() {
  const [items, setItems] = useState<Certificado[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = () => {
    setLoading(true);
    certificadosService
      .listar({ page: 1, limit: 20 })
      .then((r) => setItems(r.items.filter((c) => !c.fechaEntrega)))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleEntregar = async (id: number) => {
    console.log('entregar certificado', id);
    try {
      await certificadosService.marcarEntregado(id);
      toast.success('Certificado entregado');
      cargar();
    } catch (e) {
      console.log('error entregar', e);
      toast.error('No se pudo marcar la entrega');
    }
  };

  return (
    <div className={styles['page']}>
      <h1 className={styles['title']}>Entrega de Certificados</h1>
      {loading ? (
        <Spinner size="md" />
      ) : items.length === 0 ? (
        <Card title="Listos para entregar">
          <p>Sin certificados pendientes</p>
        </Card>
      ) : (
        items.map((c) => (
          <Card key={c.id} title={c.codigoCertificado}>
            <p>
              Emitido: {formatDate(c.createdAt)}{' '}
              <Badge variant="warning" size="sm">
                Pendiente
              </Badge>
            </p>
            <Button variant="primary" size="sm" onClick={() => handleEntregar(c.id)}>
              Marcar como entregado
            </Button>
          </Card>
        ))
      )}
    </div>
  );
}
