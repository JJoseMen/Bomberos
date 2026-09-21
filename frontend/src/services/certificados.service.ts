import api from '@/lib/api';
import type {
  Certificado,
  RegistrarCertificadoDto,
  VerificarCertificadoResponse,
} from '@/types/certificado.types';

export const certificadosService = {
  async listar(params?: {
    page?: number;
    limit?: number;
  }): Promise<{ items: Certificado[]; total: number }> {
    const res = await api.get('/certificados', { params });
    return res.data;
  },

  async findOne(codigo: string): Promise<Certificado> {
    const res = await api.get(`/solicitudes/${codigo}/certificado`);
    return res.data;
  },

  async registrar(codigo: string, data: RegistrarCertificadoDto): Promise<Certificado> {
    const res = await api.patch(`/solicitudes/${codigo}/registrar-certificado`, data);
    return res.data;
  },

  async verificarPorCodigo(codigo: string): Promise<VerificarCertificadoResponse> {
    const res = await api.get(`/certificados/verificar/${codigo}`);
    return res.data;
  },

  async marcarEntregado(id: number): Promise<Certificado> {
    const res = await api.patch(`/certificados/${id}/entregar`);
    return res.data;
  },
};
