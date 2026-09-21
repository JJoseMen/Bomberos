export type EstadoPago = 'PENDIENTE' | 'VERIFICADO' | 'OBSERVADO' | 'RECHAZADO';

export interface Pago {
  id: number;
  solicitudId: number;
  numeroOperacion: string;
  monto: number;
  fechaDeposito: string;
  banco: string;
  estado: EstadoPago;
  verificadoPorId?: number;
  verificadoEn?: string;
  createdAt: string;
}

export interface RegistrarPagoDto {
  numeroOperacion?: string;
  monto: number;
  fechaDeposito?: string;
  banco?: string;
}

export interface VerificarPagoDto {
  estado: 'VERIFICADO' | 'RECHAZADO';
  observaciones?: string;
}
