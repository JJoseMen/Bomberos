import api from '@/lib/api';
import type { PaginatedResponse } from '@/types/common.types';
import type { Renovacion, CrearRenovacionDto } from '@/types/renovacion.types';

export const renovacionesService = {
  async crear(solicitudCodigo: string, data: CrearRenovacionDto): Promise<Renovacion> {
    const res = await api.post(`/solicitudes/${solicitudCodigo}/renovar`, data);
    return res.data;
  },

  async findAll(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Renovacion>> {
    const res = await api.get('/renovaciones', { params });
    return res.data;
  },

  async findOne(codigo: string): Promise<Renovacion> {
    const res = await api.get(`/renovaciones/${codigo}`);
    return res.data;
  },
};
