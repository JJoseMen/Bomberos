export type TipoNotificacion = 'EMAIL' | 'SMS' | 'APP' | 'SISTEMA';

export interface Notificacion {
  id: number;
  usuarioId: number;
  solicitudId?: number;
  tipo: TipoNotificacion;
  asunto: string;
  mensaje: string;
  leida: boolean;
  solicitud?: { id: number; codigoFormulario: string };
  createdAt: string;
}

export interface CrearNotificacionDto {
  usuarioId?: number;
  solicitudId?: number;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
}
