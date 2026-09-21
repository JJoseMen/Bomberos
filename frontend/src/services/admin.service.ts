import api from '@/lib/api';
import type { PaginatedResponse } from '@/types/common.types';
import type { AdminStats, AdminAlertas, QueryAdminParams } from '@/types/admin.types';
import type { SolicitudWithRelations } from '@/types/solicitud.types';

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const res = await api.get('/admin/stats');
    return res.data;
  },

  async findAllSolicitudes(
    params?: QueryAdminParams,
  ): Promise<PaginatedResponse<SolicitudWithRelations>> {
    const res = await api.get('/admin/solicitudes', { params });
    return res.data;
  },

  async findOneSolicitud(codigo: string): Promise<SolicitudWithRelations> {
    const res = await api.get(`/admin/solicitudes/${codigo}`);
    return res.data;
  },

  async getEstadosPermitidos(
    codigo: string,
  ): Promise<{ estadoActual: string; estadosPermitidos: string[] }> {
    const res = await api.get(`/admin/solicitudes/${codigo}/estados-permitidos`);
    return res.data;
  },

  async getAlertas(): Promise<AdminAlertas> {
    const res = await api.get('/admin/alertas');
    return res.data;
  },
};
