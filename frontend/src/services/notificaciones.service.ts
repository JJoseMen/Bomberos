import api from '@/lib/api';
import type { PaginatedResponse } from '@/types/common.types';
import type { Notificacion } from '@/types/notificacion.types';

export const notificacionesService = {
  async findAll(params?: {
    leida?: boolean;
    tipo?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Notificacion>> {
    const res = await api.get('/notificaciones', { params });
    return res.data;
  },

  async marcarLeida(id: number): Promise<Notificacion> {
    const res = await api.patch(`/notificaciones/${id}/leida`);
    return res.data;
  },

  async marcarTodasLeidas(): Promise<{ count: number }> {
    const res = await api.patch('/notificaciones/leer-todas');
    return res.data;
  },
};
