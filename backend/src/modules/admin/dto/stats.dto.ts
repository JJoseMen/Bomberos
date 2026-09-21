import { ApiProperty } from '@nestjs/swagger';

export class StatsResponseDto {
  @ApiProperty() totalSolicitudes!: number;
  @ApiProperty() totalUsuarios!: number;
  @ApiProperty() totalEmpresas!: number;
  @ApiProperty() totalCertificados!: number;
  @ApiProperty() totalPagosVerificados!: number;
  @ApiProperty() porEstado!: Record<string, number>;
  @ApiProperty() porTipoTramite!: Record<string, number>;
}

export class AlertasResponseDto {
  @ApiProperty() proximasAVencer!: Array<{ codigoFormulario: string; fechaVencimiento: Date; diasRestantes: number }>;
  @ApiProperty() vencidas!: Array<{ codigoFormulario: string; fechaVencimiento: Date }>;
  @ApiProperty() pagosPendientes!: number;
  @ApiProperty() documentosPendientes!: number;
}
