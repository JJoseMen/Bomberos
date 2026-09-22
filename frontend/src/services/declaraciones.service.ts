import api from '@/lib/api';
import type { DeclaracionJurada } from '@/types/declaracion.types';

export const declaracionesService = {
  async findOne(codigo: string): Promise<DeclaracionJurada> {
    const res = await api.get(`/solicitudes/${codigo}/declaracion`);
    return res.data;
  },

  async findAll(params?: {
    page?: number;
    limit?: number;
    estado?: string;
    search?: string;
  }): Promise<{
    items: DeclaracionJurada[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    const res = await api.get('/declaraciones', { params });
    return res.data;
  },

  async descargarGenerado(codigo: string): Promise<Blob> {
    const res = await api.get(`/solicitudes/${codigo}/declaracion/pdf`, {
      responseType: 'blob',
    });
    return res.data;
  },

  async descargarFirmado(id: number): Promise<Blob> {
    const res = await api.get(`/declaraciones/${id}/pdf-firmado`, {
      responseType: 'blob',
    });
    return res.data;
  },

  async aprobar(id: number, observacion?: string): Promise<DeclaracionJurada> {
    const res = await api.patch(`/declaraciones/${id}/aprobar`, { observacion });
    return res.data;
  },

  async rechazar(id: number, observacion?: string): Promise<DeclaracionJurada> {
    const res = await api.patch(`/declaraciones/${id}/rechazar`, { observacion });
    return res.data;
  },
};
