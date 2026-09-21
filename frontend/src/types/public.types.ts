import { EstadoSolicitud, TipoTramite } from './common.types';

export interface ConsultaSolicitudPublica {
  codigoFormulario: string;
  tipoTramite: TipoTramite;
  estado: EstadoSolicitud;
  fechaCreacion: string;
  fechaAprobacion?: string;
  fechaVencimiento?: string;
  titular: string;
}
