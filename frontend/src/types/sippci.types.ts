import { TipoPersona } from './common.types';

export interface Sippci {
  id: number;
  codigoFormulario: string;
  tipoPersona: TipoPersona;
  razonSocial?: string;
  nombre?: string;
  nit?: string;
  ci?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  datosJson: Record<string, unknown>;
  usuarioId: number;
  createdAt: string;
}

export interface CrearSippciDto {
  tipoPersona: TipoPersona;
  razonSocial?: string;
  nombre?: string;
  nit?: string;
  ci?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  datosJson?: Record<string, unknown>;
}
