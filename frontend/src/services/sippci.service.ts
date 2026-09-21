import api from '@/lib/api';
import type { PaginatedResponse } from '@/types/common.types';
import type { Sippci, CrearSippciDto } from '@/types/sippci.types';

export const sippciService = {
  async crear(data: CrearSippciDto): Promise<Sippci> {
    const res = await api.post('/sippci', data);
    return res.data;
  },

  async findAll(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Sippci>> {
    const res = await api.get('/sippci', { params });
    return res.data;
  },

  async findOne(id: number): Promise<Sippci> {
    const res = await api.get(`/sippci/${id}`);
    return res.data;
  },
};
