import { Solicitud } from './solicitud.types';

export interface Renovacion {
  id: number;
  solicitudId: number;
  solicitudAnteriorId: number;
  codigoCertificadoAnterior?: string;
  motivoRenovacion?: string;
  solicitudAnterior?: Solicitud;
  solicitud?: Solicitud;
  createdAt: string;
}

export interface CrearRenovacionDto {
  solicitudAnteriorId: number;
  codigoCertificadoAnterior?: string;
  motivoRenovacion?: string;
}
