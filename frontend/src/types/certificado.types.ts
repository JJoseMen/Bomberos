export interface Certificado {
  id: number;
  solicitudId: number;
  tipo: string;
  codigoCertificado: string;
  emitidoPorId: number;
  fechaEmision: string;
  fechaVigencia: string;
  activo: boolean;
  observaciones?: string;
  fechaEntrega?: string;
  entregadoPorId?: number;
  createdAt: string;
}

export interface RegistrarCertificadoDto {
  codigoCertificado: string;
}

export interface VerificarCertificadoResponse {
  codigoCertificado: string;
  codigoFormulario: string;
  tipoTramite: string;
  titular: string;
  fechaAprobacion?: string;
  fechaVencimiento?: string;
  estado: 'VIGENTE' | 'VENCIDO';
}
