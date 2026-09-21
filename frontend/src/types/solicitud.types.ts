import { EstadoSolicitud, TipoTramite } from './common.types';
import { Usuario } from './usuario.types';
import { Empresa } from './empresa.types';

export interface Solicitud {
  id: number;
  codigoFormulario: string;
  tipoTramite: TipoTramite;
  subtipoTramite: string;
  estado: EstadoSolicitud;
  datosJson: Record<string, unknown>;
  usuarioId: number;
  empresaId?: number;
  fechaVigencia?: string;
  fechaAprobacion?: string;
  esRenovacion?: boolean;
  solicitudAnteriorId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SolicitudWithRelations extends Solicitud {
  usuario: Pick<Usuario, 'id' | 'nombre' | 'email'>;
  empresa?: Empresa;
  documentos?: Documento[];
  pagos?: Pago[];
  certificados?: Certificado[];
  historial?: HistorialSolicitud[];
}

export interface CreateSolicitudDto {
  tipoTramite: TipoTramite;
  subtipoTramite: string;
  empresaId?: number;
  datosJson: Record<string, unknown>;
}

export interface CambiarEstadoDto {
  estado: EstadoSolicitud;
  comentario?: string;
}

export interface HistorialSolicitud {
  id: number;
  estadoAnterior: string;
  estadoNuevo: string;
  comentario?: string;
  createdAt: string;
}

import { Documento } from './documento.types';
import { Pago } from './pago.types';
import { Certificado } from './certificado.types';
