import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Badge, Spinner } from '@/components/ui';
import { notificacionesService } from '@/services/notificaciones.service';
import type { Notificacion } from '@/types/notificacion.types';
import { formatDateTime } from '@/lib/format';
import styles from './NotificacionesPage.module.scss';

type Filtro = 'todas' | 'noleidas' | 'leidas';

const FILTROS: { value: Filtro; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'noleidas', label: 'No leidas' },
  { value: 'leidas', label: 'Leidas' },
];

export function NotificacionesPage() {
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notificaciones'],
    queryFn: () => notificacionesService.findAll({ page: 1, limit: 50 }),
  });

  const marcar = useMutation({
    mutationFn: (id: number) => notificacionesService.marcarLeida(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notificaciones'] }),
  });

  const todas = useMutation({
    mutationFn: () => notificacionesService.marcarTodasLeidas(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notificaciones'] }),
  });

  const items: Notificacion[] = data?.items ?? [];
  const list = items.filter((n) => {
    if (filtro === 'noleidas') return !n.leida;
    if (filtro === 'leidas') return n.leida;
    return true;
  });
  const noLeidas = items.filter((n) => !n.leida).length;

  return (
    <div className={styles['page']}>
      <div className={styles['head']}>
        <div>
          <h1 className={styles['title']}>Notificaciones</h1>
          <p className={styles['subtitle']}>
            {noLeidas > 0 ? `${noLeidas} sin leer` : 'No tienes notificaciones sin leer'}
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          loading={todas.isPending}
          disabled={noLeidas === 0}
          onClick={() => todas.mutate()}
        >
          Marcar todas como leidas
        </Button>
      </div>

      <div className={styles['tabs']}>
        {FILTROS.map((f) => (
          <button
            key={f.value}
            type="button"
            className={`${styles['tab']} ${filtro === f.value ? styles['tabsActive'] : ''}`}
            onClick={() => setFiltro(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Spinner size="md" />
      ) : isError ? (
        <p className={styles['empty']}>No se pudieron cargar las notificaciones.</p>
      ) : list.length === 0 ? (
        <p className={styles['empty']}>No hay notificaciones.</p>
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
            <div className={styles['bottom']}>
              <small>{formatDateTime(n.createdAt)}</small>
              {!n.leida && (
                <Button
                  variant="ghost"
                  size="sm"
                  loading={marcar.isPending}
                  onClick={() => marcar.mutate(n.id)}
                >
                  Marcar como leida
                </Button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
