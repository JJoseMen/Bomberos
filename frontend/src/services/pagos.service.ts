import api from '@/lib/api';
import type { Pago, RegistrarPagoDto, VerificarPagoDto } from '@/types/pago.types';

export const pagosService = {
  async registrar(codigo: string, data: RegistrarPagoDto): Promise<Pago> {
    const res = await api.post(`/solicitudes/${codigo}/pago`, data);
    return res.data;
  },

  async consultar(codigo: string): Promise<Pago> {
    const res = await api.get(`/solicitudes/${codigo}/pago`);
    return res.data;
  },

  async verificar(id: number, data: VerificarPagoDto): Promise<Pago> {
    const res = await api.patch(`/pagos/${id}/verificar`, data);
    return res.data;
  },
};
