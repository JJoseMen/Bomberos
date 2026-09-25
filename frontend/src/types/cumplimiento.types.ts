export type TipoCumplimiento = 'NATURAL' | 'JURIDICA';

export type NivelRiesgo = 'BAJO' | 'MEDIO' | 'ALTO';

export type EstadoVigencia = 'VIGENTE' | 'POR_VENCER' | 'VENCIDO' | 'SIN_VIGENCIA';

export type ResultadoInspeccion = 'APTO' | 'OBSERVADO' | 'NO_APTO';

export interface DatosEstablecimiento {
  nombreEstablecimiento?: string;
  direccion?: string;
  zona?: string;
  ciudad?: string;
  actividadEconomica?: string;
  superficieM2?: number;
  nivelRiesgo?: NivelRiesgo;
  sistemasContraIncendios?: string[];
  [key: string]: unknown;
}

export interface DatosPersonaNaturalCumplimiento {
  nombreCompleto?: string;
  ci?: string;
  telefono?: string;
  email?: string;
  [key: string]: unknown;
}

export interface DatosPersonaJuridicaCumplimiento {
  razonSocial?: string;
  nit?: string;
  representanteLegal?: string;
  telefono?: string;
  email?: string;
  [key: string]: unknown;
}
