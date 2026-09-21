import api from '@/lib/api';
import type { PaginatedResponse } from '@/types/common.types';
import type { Usuario, CreateUsuarioDto, UpdateUsuarioDto } from '@/types/usuario.types';

export const usuariosService = {
  async findAll(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Usuario>> {
    const res = await api.get('/usuarios', { params });
    return res.data;
  },

  async findOne(id: number): Promise<Usuario> {
    const res = await api.get(`/usuarios/${id}`);
    return res.data;
  },

  async create(data: CreateUsuarioDto): Promise<Usuario> {
    const res = await api.post('/usuarios', data);
    return res.data;
  },

  async update(id: number, data: UpdateUsuarioDto): Promise<Usuario> {
    const res = await api.patch(`/usuarios/${id}`, data);
    return res.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/usuarios/${id}`);
  },
};
