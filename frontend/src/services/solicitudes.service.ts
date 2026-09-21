import api from '@/lib/api';
import type { PaginatedResponse } from '@/types/common.types';
import type {
  Solicitud,
  SolicitudWithRelations,
  CreateSolicitudDto,
  CambiarEstadoDto,
} from '@/types/solicitud.types';

export const solicitudesService = {
  async findAll(params?: {
    page?: number;
    limit?: number;
    estado?: string;
  }): Promise<PaginatedResponse<Solicitud>> {
    const res = await api.get('/solicitudes', { params });
    return res.data;
  },

  async findMias(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Solicitud> | Solicitud[]> {
    const res = await api.get('/solicitudes/mias', { params });
    return res.data;
  },

  async findOne(codigo: string): Promise<SolicitudWithRelations> {
    const res = await api.get(`/solicitudes/${codigo}`);
    return res.data;
  },

  async create(data: CreateSolicitudDto): Promise<Solicitud> {
    const res = await api.post('/solicitudes', data);
    return res.data;
  },

  async enviar(codigo: string): Promise<Solicitud> {
    const res = await api.post(`/solicitudes/${codigo}/enviar`);
    return res.data;
  },

  async cambiarEstado(codigo: string, data: CambiarEstadoDto): Promise<Solicitud> {
    const res = await api.patch(`/solicitudes/${codigo}/estado`, data);
    return res.data;
  },

  async renovar(
    codigo: string,
    data: { codigoCertificadoAnterior?: string; motivoRenovacion?: string },
  ): Promise<Solicitud> {
    const res = await api.post(`/solicitudes/${codigo}/renovar`, data);
    return res.data;
  },
};
