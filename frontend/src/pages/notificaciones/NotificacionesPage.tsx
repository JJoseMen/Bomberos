import { useEffect, useState } from 'react';
import { Button, Badge, Spinner } from '@/components/ui';
import { notificacionesService } from '@/services/notificaciones.service';
import type { Notificacion } from '@/types/notificacion.types';
import { formatDate } from '@/lib/format';
import styles from './NotificacionesPage.module.scss';

export function NotificacionesPage() {
  const [items, setItems] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<'todas' | 'noleidas'>('todas');

  const cargar = () => {
    setLoading(true);
    notificacionesService
      .findAll({ page: 1, limit: 20 })
      .then((r) => setItems(r.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargar();
  }, []);

  const marcar = async (id: number) => {
    await notificacionesService.marcarLeida(id);
    cargar();
  };

  const todas = async () => {
    await notificacionesService.marcarTodasLeidas();
    cargar();
  };

  const list = filtro === 'noleidas' ? items.filter((n) => !n.leida) : items;

  return (
    <div className={styles['page']}>
      <h1 className={styles['title']}>Notificaciones</h1>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="ghost" size="sm" onClick={() => setFiltro('todas')}>
          Todas
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setFiltro('noleidas')}>
          No leidas
        </Button>
        <Button variant="primary" size="sm" onClick={todas}>
          Marcar todas
        </Button>
      </div>
      {loading ? (
        <Spinner size="md" />
      ) : (
        list.map((n) => (
          <div key={n.id} className={`${styles['item']} ${!n.leida ? styles['unread'] : ''}`}>
            <div className={styles['top']}>
              <strong>{n.asunto}</strong>
              <Badge variant={n.leida ? 'neutral' : 'danger'} size="sm">
                {n.leida ? 'Leida' : 'Nueva'}
              </Badge>
            </div>
            <p className={styles['msg']}>{n.mensaje}</p>
            <small>{formatDate(n.createdAt)}</small>
            {!n.leida && (
              <div style={{ marginTop: 8 }}>
                <Button variant="ghost" size="sm" onClick={() => marcar(n.id)}>
                  Marcar leida
                </Button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
