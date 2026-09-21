import api from '@/lib/api';
import type { PaginatedResponse } from '@/types/common.types';
import type { Empresa, CreateEmpresaDto, UpdateEmpresaDto } from '@/types/empresa.types';

export const empresasService = {
  async findAll(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Empresa>> {
    const res = await api.get('/empresas', { params });
    return res.data;
  },

  async findOne(id: number): Promise<Empresa> {
    const res = await api.get(`/empresas/${id}`);
    return res.data;
  },

  async create(data: CreateEmpresaDto): Promise<Empresa> {
    const res = await api.post('/empresas', data);
    return res.data;
  },

  async update(id: number, data: UpdateEmpresaDto): Promise<Empresa> {
    const res = await api.patch(`/empresas/${id}`, data);
    return res.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/empresas/${id}`);
  },
};
