export type EstadoDeclaracion =
  'PENDIENTE' | 'GENERADA' | 'FIRMADA_SUBIDA' | 'APROBADA' | 'RECHAZADA';

export interface DeclaracionJurada {
  id: number;
  solicitudId: number;
  codigoDeclaracion: string;
  pdfGeneradoRuta: string;
  pdfGeneradoHash: string;
  pdfFirmadoRuta: string | null;
  pdfFirmadoHash: string | null;
  firmadoPor: string;
  ciFirmante: string;
  fechaFirma: string | null;
  ipFirma?: string | null;
  estado: EstadoDeclaracion;
  observacion: string | null;
  createdAt: string;
  updatedAt: string;
  solicitud?: { id: number; codigoFormulario: string; estado: string };
}

export interface GenerarDeclaracionDto {
  codigoDeclaracion: string;
}
