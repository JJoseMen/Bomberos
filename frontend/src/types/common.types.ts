export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export type EstadoSolicitud =
  | 'BORRADOR'
  | 'ENVIADA'
  | 'EN_REVISION'
  | 'REVISADO'
  | 'OBSERVADA'
  | 'APROBADA'
  | 'RECHAZADA'
  | 'CERTIFICADO_EMITIDO'
  | 'VENCIDO'
  | 'RENOVADO'
  | 'ANULADA';

export type TipoTramite = 'CERTIFICACION_SIPPCI' | 'REGISTRO_PROFESIONAL' | 'CAPACITACION';

export type TipoPersona = 'NATURAL' | 'JURIDICA';
