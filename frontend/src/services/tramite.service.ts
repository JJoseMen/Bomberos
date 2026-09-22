import api from '@/lib/api';
import type { Pago, RegistrarPagoDto } from '@/types/pago.types';

export type TipoDocumentoBackend =
  | 'FORMULARIO'
  | 'PLANO_SIPPCI'
  | 'PLAN_EMERGENCIA'
  | 'CREDENCIAL_PROFESIONAL'
  | 'NIT'
  | 'BOLETA_DEPOSITO'
  | 'CERTIFICADO_ANTERIOR'
  | 'CI'
  | 'TITULO_PROFESIONAL'
  | 'ESCRITURA_PUBLICA'
  | 'PODER_REPRESENTANTE'
  | 'LICENCIA_FUNCIONAMIENTO'
  | 'REGISTRO_COMERCIO'
  | 'CERTIFICADO_NIT'
  | 'PLANILLA_EXCEL'
  | 'COMPROBANTE_PAGO'
  | 'OTRO';

export interface SubirDocumentoResultado {
  id: number;
  tipo: string;
  nombreOriginal: string;
}

export interface GenerarDeclaracionResultado {
  id: number;
  codigoDeclaracion: string;
  rutaPdf: string;
  hash: string;
  estado: string;
}

export const tramiteService = {
  async subirDocumento(
    codigo: string,
    tipoDocumento: TipoDocumentoBackend,
    file: File,
  ): Promise<SubirDocumentoResultado> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tipoDocumento', tipoDocumento);
    const res = await api.post(`/solicitudes/${codigo}/documentos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async registrarPago(codigo: string, dto: RegistrarPagoDto): Promise<Pago> {
    const res = await api.post(`/solicitudes/${codigo}/pago`, dto);
    return res.data;
  },

  async generarDeclaracion(codigo: string): Promise<GenerarDeclaracionResultado> {
    const res = await api.post(`/solicitudes/${codigo}/declaracion/generar`);
    return res.data;
  },

  async consultarDeclaracion(codigo: string) {
    const res = await api.get(`/solicitudes/${codigo}/declaracion`);
    return res.data;
  },

  async descargarDeclaracionPdf(codigo: string): Promise<Blob> {
    const res = await api.get(`/solicitudes/${codigo}/declaracion/pdf`, {
      responseType: 'blob',
    });
    return res.data;
  },

  async subirDeclaracionFirmada(codigo: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post(`/solicitudes/${codigo}/declaracion/firmada`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};
