export interface Certificado {
  id: number;
  solicitudId: number;
  codigoCertificado: string;
  aprobadoPorId?: number;
  aprobadoEn?: string;
  registradoPorId?: number;
  registradoEn?: string;
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
