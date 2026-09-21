import api from '@/lib/api';
import type { DeclaracionJurada } from '@/types/declaracion.types';

export const declaracionesService = {
  async firmar(
    codigo: string,
    data: { firmadoPor: string; ciFirmante: string },
  ): Promise<DeclaracionJurada> {
    const res = await api.post(`/solicitudes/${codigo}/declaracion`, data);
    return res.data;
  },

  async findOne(codigo: string): Promise<DeclaracionJurada> {
    const res = await api.get(`/solicitudes/${codigo}/declaracion`);
    return res.data;
  },

  async findAll(params?: {
    page?: number;
    limit?: number;
  }): Promise<{ items: DeclaracionJurada[]; total: number }> {
    const res = await api.get('/declaraciones', { params });
    return res.data;
  },
};
