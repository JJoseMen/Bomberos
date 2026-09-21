import api from '@/lib/api';
import type { ConsultaSolicitudPublica } from '@/types/public.types';
import type { VerificarCertificadoResponse } from '@/types/certificado.types';

export const publicService = {
  async consultarEstado(codigo: string): Promise<ConsultaSolicitudPublica> {
    const res = await api.get(`/public/solicitudes/${codigo}/estado`);
    return res.data;
  },

  async verificarCertificado(codigo: string): Promise<VerificarCertificadoResponse> {
    const res = await api.get(`/public/certificados/verificar/${codigo}`);
    return res.data;
  },
};
