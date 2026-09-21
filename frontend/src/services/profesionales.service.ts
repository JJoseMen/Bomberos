import api from '@/lib/api';
import type { PaginatedResponse } from '@/types/common.types';
import type { Profesional, CrearProfesionalDto } from '@/types/profesional.types';

export const profesionalesService = {
  async crear(data: CrearProfesionalDto): Promise<Profesional> {
    const res = await api.post('/profesionales', data);
    return res.data;
  },

  async findAll(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Profesional>> {
    const res = await api.get('/profesionales', { params });
    return res.data;
  },

  async findOne(codigo: string): Promise<Profesional> {
    const res = await api.get(`/profesionales/${codigo}`);
    return res.data;
  },
};
