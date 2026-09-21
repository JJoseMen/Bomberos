export interface DeclaracionJurada {
  id: number;
  solicitudId: number;
  usuarioId: number;
  textoJuramento: string;
  hashVerificacion: string;
  ipAddress?: string;
  createdAt: string;
}

export interface FirmarDeclaracionDto {
  solicitudId: number;
}
