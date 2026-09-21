export interface AdminStats {
  totalSolicitudes: number;
  totalUsuarios: number;
  totalEmpresas: number;
  totalCertificados: number;
  totalPagosVerificados: number;
  porEstado: Record<string, number>;
  porTipoTramite: Record<string, number>;
}

export interface AlertaVencimiento {
  codigoFormulario: string;
  fechaVencimiento: string;
  diasRestantes: number;
}

export interface AdminAlertas {
  proximasAVencer: AlertaVencimiento[];
  vencidas: AlertaVencimiento[];
  pagosPendientes: number;
  documentosPendientes: number;
}

export interface QueryAdminParams {
  search?: string;
  tipoTramite?: string;
  estado?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  page?: number;
  limit?: number;
}
