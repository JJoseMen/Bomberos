export interface Profesional {
  id: number;
  codigoRegistro: string;
  nombre: string;
  apellido: string;
  ci: string;
  profesion: string;
  especialidad?: string;
  telefono?: string;
  email?: string;
  usuarioId?: number;
  createdAt: string;
}

export interface CrearProfesionalDto {
  nombre: string;
  apellido: string;
  ci: string;
  profesion: string;
  especialidad?: string;
  telefono?: string;
  email?: string;
}

export type TipoProfesional = 'NATURAL' | 'JURIDICA';

export type EstadoVigencia = 'VIGENTE' | 'POR_VENCER' | 'VENCIDO' | 'SIN_VIGENCIA';

export interface DatosPersonaNatural {
  nombreCompleto?: string;
  ci?: string;
  profesion?: string;
  matricula?: string;
  especialidad?: string;
  aniosExperiencia?: number;
  institucionTitulo?: string;
  [key: string]: unknown;
}

export interface DatosPersonaJuridica {
  razonSocial?: string;
  nit?: string;
  representanteLegal?: string;
  tipoEmpresa?: string;
  actividadEconomica?: string;
  numeroProfesionales?: number;
  direccionComercial?: string;
  [key: string]: unknown;
}
